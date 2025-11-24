import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserInteraction {
  artwork_id: string;
  interaction_type: string;
  duration_seconds: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) throw new Error("Unauthorized");

    // Get user's interaction history
    const { data: interactions } = await supabaseClient
      .from("user_interactions")
      .select("artwork_id, interaction_type, duration_seconds")
      .eq("user_id", user.id)
      .order("timestamp", { ascending: false })
      .limit(50);

    // Get all artworks
    const { data: artworks } = await supabaseClient
      .from("artworks")
      .select("id, tags, artist_id, views_count, likes_count")
      .eq("status", "published");

    if (!artworks || !interactions) {
      return new Response(JSON.stringify({ recommendations: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Simple collaborative filtering algorithm
    const interactedArtworks = new Set(interactions.map(i => i.artwork_id));
    const tagFrequency: Record<string, number> = {};
    const artistFrequency: Record<string, number> = {};

    // Build user preference profile
    interactions.forEach((interaction: UserInteraction) => {
      const artwork = artworks.find(a => a.id === interaction.artwork_id);
      if (!artwork) return;

      const weight = interaction.interaction_type === "purchase" ? 5 :
                     interaction.interaction_type === "like" ? 3 :
                     interaction.duration_seconds > 30 ? 2 : 1;

      artwork.tags?.forEach((tag: string) => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + weight;
      });

      if (artwork.artist_id) {
        artistFrequency[artwork.artist_id] = (artistFrequency[artwork.artist_id] || 0) + weight;
      }
    });

    // Score uninteracted artworks
    const recommendations = artworks
      .filter(artwork => !interactedArtworks.has(artwork.id))
      .map(artwork => {
        let score = 0;

        // Tag matching
        artwork.tags?.forEach((tag: string) => {
          score += (tagFrequency[tag] || 0) * 2;
        });

        // Artist matching
        if (artwork.artist_id && artistFrequency[artwork.artist_id]) {
          score += artistFrequency[artwork.artist_id] * 3;
        }

        // Popularity boost
        score += Math.log(artwork.views_count + 1) * 0.5;
        score += artwork.likes_count * 0.3;

        return {
          artwork_id: artwork.id,
          score: score / 100,
          reason: `Based on your interests in ${Object.keys(tagFrequency).slice(0, 3).join(", ")}`
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    // Store recommendations
    const recommendationsToInsert = recommendations.map(rec => ({
      user_id: user.id,
      artwork_id: rec.artwork_id,
      score: rec.score,
      reason: rec.reason,
      algorithm_version: "collaborative_v1"
    }));

    await supabaseClient.from("user_recommendations").delete().eq("user_id", user.id);
    await supabaseClient.from("user_recommendations").insert(recommendationsToInsert);

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
