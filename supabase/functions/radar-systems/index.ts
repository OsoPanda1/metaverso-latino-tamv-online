import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { system, operation, payload } = await req.json();

    if (!system || !operation) {
      return new Response(
        JSON.stringify({ error: "system and operation required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result: any;
    let entityType: string;

    switch (system) {
      case 'mos': {
        // MOS Gemelos - Twin Radar System
        const { pair_id, role, scope, metrics } = payload;
        if (!pair_id || !role || !scope) {
          throw new Error("MOS requires pair_id, role, scope");
        }

        const { data, error } = await sb.from("radars_mos")
          .upsert({ pair_id, role, scope, metrics: metrics || {}, last_ping: new Date().toISOString() })
          .select();

        if (error) throw error;

        // Check twin correlation
        const { data: twin } = await sb.from("radars_mos")
          .select()
          .eq("pair_id", pair_id)
          .neq("role", role)
          .limit(1);

        result = {
          id: data![0].id,
          role,
          twinFound: !!twin?.[0],
          twinRole: twin?.[0]?.role,
          correlated: !!twin?.[0]
        };
        entityType = "radar_mos";
        break;
      }

      case 'ra': {
        // Ojo de Ra - Surveillance Radar
        const { coverage, signals, threat_level } = payload;
        if (!coverage || !signals) {
          throw new Error("Ra requires coverage and signals");
        }

        const { data, error } = await sb.from("radars_ra")
          .insert({ coverage, signals, threat_level: threat_level || 'normal' })
          .select();

        if (error) throw error;

        result = { id: data![0].id, coverage, threat_level: threat_level || 'normal' };
        entityType = "radar_ra";
        break;
      }

      case 'quetzal': {
        // Ojo de Quetzalcóatl - Wisdom Radar
        const { coverage, signals, wisdom_score, prophecy_data } = payload;
        if (!coverage || !signals) {
          throw new Error("Quetzal requires coverage and signals");
        }

        const { data, error } = await sb.from("radars_quetzalcoatl")
          .insert({ coverage, signals, wisdom_score: wisdom_score || 0, prophecy_data })
          .select();

        if (error) throw error;

        result = { id: data![0].id, coverage, wisdom_score: wisdom_score || 0 };
        entityType = "radar_quetzal";
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: "Unknown radar system. Use: mos, ra, quetzal" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // Generate federation hash
    const hashPayload = { system, result, timestamp: new Date().toISOString() };
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(hashPayload)));
    const hex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");

    await Promise.all([
      sb.from("federation_registry_local").insert({
        entity_type: entityType,
        entity_id: result.id,
        hash: hex,
        signer: `node_local_${system}`
      }),
      sb.from("federation_registry_continental").insert({
        entity_type: entityType,
        entity_id: result.id,
        hash: hex,
        signer: `node_continental_${system}`
      })
    ]);

    console.log(`RADAR ${system.toUpperCase()}: ${operation} complete, hash: ${hex.slice(0, 16)}...`);

    return new Response(
      JSON.stringify({
        system,
        operation,
        result,
        meta: { hash: hex, federation: "double" }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: unknown) {
    console.error("Radar systems exception:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
