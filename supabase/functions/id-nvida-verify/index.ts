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

    const { userId, biometric_hash, device_fingerprint } = await req.json();
    
    if (!userId || !biometric_hash) {
      return new Response(
        JSON.stringify({ error: "userId and biometric_hash required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Upsert identity
    const { data, error } = await sb.from("id_nvida_identities")
      .upsert({
        user_id: userId,
        biometric_hash,
        device_fingerprint,
        verified: true,
        trust_score: 0.9,
        updated_at: new Date().toISOString()
      })
      .select()
      .limit(1);

    if (error) {
      console.error("ID-NVIDA error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate federation hash
    const entity = { id: data![0].id, userId, biometric_hash, device_fingerprint, verified: true };
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(entity)));
    const hex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");

    // Double federation registration
    await Promise.all([
      sb.from("federation_registry_local").insert({
        entity_type: "id_nvida",
        entity_id: data![0].id,
        hash: hex,
        signer: "node_local_id"
      }),
      sb.from("federation_registry_continental").insert({
        entity_type: "id_nvida",
        entity_id: data![0].id,
        hash: hex,
        signer: "node_continental_id"
      })
    ]);

    console.log(`ID-NVIDA verified for user ${userId}, hash: ${hex.slice(0, 16)}...`);

    return new Response(
      JSON.stringify({
        ok: true,
        id: data![0].id,
        verified: true,
        trust_score: 0.9,
        meta: { hash: hex, federation: "double" }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("ID-NVIDA exception:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
