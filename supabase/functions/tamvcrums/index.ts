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

    const body = await req.json();
    const { op, userId, context, description, action, id, priority } = body;

    if (op === "create") {
      if (!userId || !context || !description || !action) {
        return new Response(
          JSON.stringify({ error: "userId, context, description, action required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data, error } = await sb.from("tamvcrums")
        .insert({
          user_id: userId,
          context,
          description,
          action,
          priority: priority || 5,
          status: 'open'
        })
        .select();

      if (error) throw error;

      const payload = { id: data![0].id, context, action, timestamp: new Date().toISOString() };
      const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(payload)));
      const hex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");

      await Promise.all([
        sb.from("federation_registry_local").insert({
          entity_type: "tamvcrum",
          entity_id: data![0].id,
          hash: hex,
          signer: "node_local_crum"
        }),
        sb.from("federation_registry_continental").insert({
          entity_type: "tamvcrum",
          entity_id: data![0].id,
          hash: hex,
          signer: "node_continental_crum"
        })
      ]);

      console.log(`TAMVCRUM created: ${data![0].id}, hash: ${hex.slice(0, 16)}...`);

      return new Response(
        JSON.stringify({ status: "open", id: data![0].id, meta: { hash: hex } }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (op === "mitigate") {
      const { error } = await sb.from("tamvcrums")
        .update({ status: "mitigating", updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      return new Response(
        JSON.stringify({ status: "mitigating", id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (op === "close") {
      const { error } = await sb.from("tamvcrums")
        .update({ status: "closed", updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      const payload = { id, status: "closed", timestamp: new Date().toISOString() };
      const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(payload)));
      const hex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");

      await Promise.all([
        sb.from("federation_registry_local").insert({
          entity_type: "tamvcrum_close",
          entity_id: id,
          hash: hex,
          signer: "node_local_crum"
        }),
        sb.from("federation_registry_continental").insert({
          entity_type: "tamvcrum_close",
          entity_id: id,
          hash: hex,
          signer: "node_continental_crum"
        })
      ]);

      console.log(`TAMVCRUM closed: ${id}, hash: ${hex.slice(0, 16)}...`);

      return new Response(
        JSON.stringify({ status: "closed", meta: { hash: hex } }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid operation. Use: create, mitigate, close" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("TAMVCRUMS exception:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
