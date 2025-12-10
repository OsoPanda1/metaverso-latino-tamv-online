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

    const { engineName, event, userId } = await req.json();

    if (!engineName || !event) {
      return new Response(
        JSON.stringify({ error: "engineName and event required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch engine policy
    const { data: engineData } = await sb.from("engines_eoct")
      .select()
      .eq("name", engineName)
      .eq("active", true)
      .limit(1);

    if (!engineData?.[0]) {
      return new Response(
        JSON.stringify({ error: "Engine not found or inactive" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const policy = engineData[0].policy as { threshold?: number; mode?: string };
    const threshold = policy?.threshold ?? 0.7;
    const score = event?.score ?? 0;

    // Deterministic evaluation
    let severity: string;
    let action: string;
    let quantumFilters: string[] = [];

    if (score >= threshold + 0.2) {
      severity = "critical";
      action = "quarantine_immediate";
    } else if (score >= threshold) {
      severity = "high";
      action = "quarantine";
    } else if (score >= threshold - 0.2) {
      severity = "medium";
      action = "warn";
    } else {
      severity = "low";
      action = "log";
    }

    // Apply quantum filters if available
    const filters = engineData[0].quantum_filters as string[] || [];
    if (event?.emotions) {
      quantumFilters = filters.filter(f => event.emotions.includes(f));
    }

    // Update engine execution stats
    await sb.from("engines_eoct")
      .update({
        last_execution: new Date().toISOString(),
        execution_count: (engineData[0].execution_count || 0) + 1
      })
      .eq("id", engineData[0].id);

    // Generate federation hash
    const payload = {
      engineName,
      severity,
      action,
      score,
      quantumFilters,
      timestamp: new Date().toISOString()
    };
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(payload)));
    const hex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");

    const entityId = crypto.randomUUID();
    await Promise.all([
      sb.from("federation_registry_local").insert({
        entity_type: "eoct",
        entity_id: entityId,
        hash: hex,
        signer: "node_local_eoct"
      }),
      sb.from("federation_registry_continental").insert({
        entity_type: "eoct",
        entity_id: entityId,
        hash: hex,
        signer: "node_continental_eoct"
      })
    ]);

    // If critical/high, trigger Anubis Sentinel
    if (severity === "critical" || severity === "high") {
      await sb.from("anubis_sentinel_alerts").insert({
        user_id: userId,
        module: "eoct",
        signal: { engineName, score, severity },
        risk: severity === "critical" ? "critical" : "high",
        action
      });
    }

    console.log(`EOCT triage: ${engineName} -> ${severity}/${action}, hash: ${hex.slice(0, 16)}...`);

    return new Response(
      JSON.stringify({
        decision: { severity, action, score, threshold },
        quantumFilters,
        engine: { name: engineName, mode: policy?.mode },
        meta: { hash: hex, federation: "double" }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("EOCT exception:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
