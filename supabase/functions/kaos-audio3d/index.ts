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

    const { userId, streamId, audio_url, spatial_config, frequency_spectrum, duration_ms } = await req.json();

    if (!audio_url) {
      return new Response(
        JSON.stringify({ error: "audio_url required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Default spatial config for 3D audio
    const config = spatial_config || {
      x: 0,
      y: 0,
      z: 0,
      rolloff: 1,
      maxDistance: 100,
      coneInnerAngle: 360,
      coneOuterAngle: 360
    };

    const { data, error } = await sb.from("kaos_audio3d_events")
      .insert({
        user_id: userId,
        stream_id: streamId,
        audio_url,
        spatial_config: config,
        frequency_spectrum,
        duration_ms
      })
      .select();

    if (error) throw error;

    // Generate federation hash
    const payload = {
      id: data![0].id,
      audio_url,
      spatial_config: config,
      timestamp: new Date().toISOString()
    };
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(payload)));
    const hex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");

    await Promise.all([
      sb.from("federation_registry_local").insert({
        entity_type: "kaos_audio3d",
        entity_id: data![0].id,
        hash: hex,
        signer: "node_local_audio"
      }),
      sb.from("federation_registry_continental").insert({
        entity_type: "kaos_audio3d",
        entity_id: data![0].id,
        hash: hex,
        signer: "node_continental_audio"
      })
    ]);

    console.log(`KAOS AUDIO 3D: Event created, spatial: [${config.x}, ${config.y}, ${config.z}], hash: ${hex.slice(0, 16)}...`);

    return new Response(
      JSON.stringify({
        id: data![0].id,
        audio_url,
        spatial_config: config,
        meta: { hash: hex, federation: "double" }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Kaos Audio 3D exception:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
