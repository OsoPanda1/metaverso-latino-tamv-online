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

    const { context, userId } = await req.json();

    if (!context) {
      return new Response(
        JSON.stringify({ error: "context required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch active Dekateotl rules
    const { data: rules } = await sb.from("dekateotl_rules")
      .select()
      .eq("active", true);

    const effects: Array<{ deity: string; effect: any; power: number }> = [];
    const activatedDeities: string[] = [];

    for (const rule of (rules ?? [])) {
      const deityScore = context?.[rule.deity]?.score ?? 0;
      const weightedScore = deityScore * rule.weight;

      if (weightedScore > 0.5) {
        effects.push({
          deity: rule.deity,
          effect: rule.effect,
          power: weightedScore
        });
        activatedDeities.push(rule.deity);

        // Update invocation count
        await sb.from("dekateotl_rules")
          .update({ invocation_count: (rule.invocation_count || 0) + 1 })
          .eq("id", rule.id);
      }
    }

    // Record Aztek reaction if deities activated
    if (activatedDeities.length > 0 && userId) {
      await sb.from("aztek_gods_reactions").insert({
        user_id: userId,
        module: "dekateotl",
        reaction: "invocation",
        deity_invoked: activatedDeities.join(","),
        power_level: effects.reduce((sum, e) => sum + e.power, 0) / effects.length,
        meta: { effects, context }
      });
    }

    // Generate federation hash
    const payload = {
      context,
      effects,
      activatedDeities,
      timestamp: new Date().toISOString()
    };
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(payload)));
    const hex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");

    const entityId = crypto.randomUUID();
    await Promise.all([
      sb.from("federation_registry_local").insert({
        entity_type: "dekateotl",
        entity_id: entityId,
        hash: hex,
        signer: "node_local_deka"
      }),
      sb.from("federation_registry_continental").insert({
        entity_type: "dekateotl",
        entity_id: entityId,
        hash: hex,
        signer: "node_continental_deka"
      })
    ]);

    console.log(`DEKATEOTL: ${activatedDeities.length} deities activated, hash: ${hex.slice(0, 16)}...`);

    return new Response(
      JSON.stringify({
        effects,
        activatedDeities,
        totalPower: effects.reduce((sum, e) => sum + e.power, 0),
        meta: { hash: hex, federation: "double" }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Dekateotl exception:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
