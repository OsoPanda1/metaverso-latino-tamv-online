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

    const { userId, source, signal, severity } = await req.json();

    if (!source || !signal || !severity) {
      return new Response(
        JSON.stringify({ error: "source, signal, and severity required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert quarantine event
    const { data, error } = await sb.from("blackhole_events")
      .insert({
        user_id: userId,
        source,
        signal,
        severity,
        quarantined: true,
        resolution_status: 'pending'
      })
      .select();

    if (error) {
      console.error("Blackhole error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate federation hash
    const payload = { id: data![0].id, source, severity, timestamp: new Date().toISOString() };
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(payload)));
    const hex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");

    // Double federation
    await Promise.all([
      sb.from("federation_registry_local").insert({
        entity_type: "blackhole",
        entity_id: data![0].id,
        hash: hex,
        signer: "node_local_sec"
      }),
      sb.from("federation_registry_continental").insert({
        entity_type: "blackhole",
        entity_id: data![0].id,
        hash: hex,
        signer: "node_continental_sec"
      })
    ]);

    console.log(`BLACKHOLE: Quarantined ${source} with severity ${severity}, hash: ${hex.slice(0, 16)}...`);

    return new Response(
      JSON.stringify({
        quarantined: true,
        id: data![0].id,
        severity,
        meta: { hash: hex, federation: "double" }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Blackhole exception:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
