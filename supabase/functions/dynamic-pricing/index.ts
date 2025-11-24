import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { artwork_id } = await req.json();

    if (!artwork_id) {
      throw new Error("artwork_id is required");
    }

    // Get artwork data
    const { data: artwork } = await supabaseClient
      .from("artworks")
      .select("*, artist:artists(reputation_score, total_sales)")
      .eq("id", artwork_id)
      .single();

    if (!artwork) {
      throw new Error("Artwork not found");
    }

    // Get recent interactions
    const { data: interactions } = await supabaseClient
      .from("user_interactions")
      .select("interaction_type, timestamp")
      .eq("artwork_id", artwork_id)
      .gte("timestamp", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    const basePrice = artwork.price || 100;
    let dynamicPrice = basePrice;

    // Scarcity factor (low views = more rare)
    const scarcityMultiplier = artwork.views_count < 10 ? 1.15 : 
                               artwork.views_count < 50 ? 1.05 : 1.0;
    dynamicPrice *= scarcityMultiplier;

    // Trend factor (high likes relative to views)
    const likesRatio = artwork.views_count > 0 ? artwork.likes_count / artwork.views_count : 0;
    const trendMultiplier = likesRatio > 0.2 ? 1.20 :
                           likesRatio > 0.1 ? 1.10 : 1.0;
    dynamicPrice *= trendMultiplier;

    // Recent activity factor
    const recentViews = interactions?.filter(i => i.interaction_type === "view").length || 0;
    const recentLikes = interactions?.filter(i => i.interaction_type === "like").length || 0;
    const activityMultiplier = recentViews > 20 ? 1.15 :
                              recentViews > 10 ? 1.08 : 1.0;
    dynamicPrice *= activityMultiplier;

    // Artist reputation boost
    const artistReputation = artwork.artist?.reputation_score || 0;
    const reputationMultiplier = artistReputation > 8 ? 1.25 :
                                artistReputation > 5 ? 1.15 : 1.0;
    dynamicPrice *= reputationMultiplier;

    // Sales history factor
    if (artwork.sales_count > 5) {
      dynamicPrice *= 1.10;
    }

    // Rarity score
    if (artwork.rarity_score > 8) {
      dynamicPrice *= 1.30;
    }

    // Round to 2 decimals
    dynamicPrice = Math.round(dynamicPrice * 100) / 100;

    // Update store product with dynamic price
    await supabaseClient
      .from("store_products")
      .update({ dynamic_price: dynamicPrice })
      .eq("artwork_id", artwork_id);

    return new Response(JSON.stringify({ 
      artwork_id,
      base_price: basePrice,
      dynamic_price: dynamicPrice,
      factors: {
        scarcity: scarcityMultiplier,
        trend: trendMultiplier,
        activity: activityMultiplier,
        reputation: reputationMultiplier
      }
    }), {
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
