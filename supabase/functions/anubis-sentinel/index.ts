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

    const { module, signal, risk, userId, action } = await req.json();

    if (!module || !signal || !risk || !action) {
      return new Response(
        JSON.stringify({ error: "module, signal, risk, action required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate risk level
    const validRisks = ['low', 'medium', 'high', 'critical'];
    if (!validRisks.includes(risk)) {
      return new Response(
        JSON.stringify({ error: "risk must be: low, medium, high, critical" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert alert
    const { data, error } = await sb.from("anubis_sentinel_alerts")
      .insert({
        user_id: userId,
        module,
        signal,
        risk,
        action,
        auto_resolved: action === 'log' || action === 'warn'
      })
      .select();

    if (error) throw error;

    // Auto-escalation for critical risks
    if (risk === 'critical') {
      // Trigger blackhole quarantine
      await sb.from("blackhole_events").insert({
        user_id: userId,
        source: `anubis_${module}`,
        signal: { alert_id: data![0].id, ...signal },
        severity: 'critical',
        quarantined: true
      });
    }

    // Generate federation hash
    const payload = {
      id: data![0].id,
      module,
      risk,
      action,
      timestamp: new Date().toISOString()
    };
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(payload)));
    const hex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");

    await Promise.all([
      sb.from("federation_registry_local").insert({
        entity_type: "anubis_sentinel",
        entity_id: data![0].id,
        hash: hex,
        signer: "node_local_anubis"
      }),
      sb.from("federation_registry_continental").insert({
        entity_type: "anubis_sentinel",
        entity_id: data![0].id,
        hash: hex,
        signer: "node_continental_anubis"
      })
    ]);

    console.log(`ANUBIS SENTINEL: ${module} alert, risk: ${risk}, action: ${action}, hash: ${hex.slice(0, 16)}...`);

    return new Response(
      JSON.stringify({
        id: data![0].id,
        module,
        risk,
        action,
        escalated: risk === 'critical',
        meta: { hash: hex, federation: "double" }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Anubis Sentinel exception:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
