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

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) throw new Error("Unauthorized");

    const { artwork_id, blockchain, owner_wallet } = await req.json();

    if (!artwork_id || !blockchain || !owner_wallet) {
      throw new Error("artwork_id, blockchain, and owner_wallet are required");
    }

    // Get artwork
    const { data: artwork } = await supabaseClient
      .from("artworks")
      .select("*, artist:artists(*)")
      .eq("id", artwork_id)
      .single();

    if (!artwork) {
      throw new Error("Artwork not found");
    }

    // Check if NFT already exists
    const { data: existingNFT } = await supabaseClient
      .from("nft_certificates")
      .select("*")
      .eq("artwork_id", artwork_id)
      .single();

    if (existingNFT) {
      throw new Error("NFT already minted for this artwork");
    }

    // Generate token ID (simplified - in production use proper smart contract)
    const token_id = `TAMV_${Date.now()}_${artwork_id.substring(0, 8)}`;
    
    // Simulate blockchain transaction (in production, integrate with Web3/Ethers.js)
    const mock_tx_hash = `0x${Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;

    const contract_address = blockchain === "ethereum" 
      ? "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
      : "0x8B3c8c8B8B8c8c8B8c8B8c8c8B8c8c8B8c8c8c8";

    // Create metadata URI
    const metadata = {
      name: artwork.title,
      description: artwork.description,
      image: artwork.image_url,
      attributes: [
        { trait_type: "Artist", value: artwork.artist?.bio || "Unknown" },
        { trait_type: "Creation Date", value: artwork.created_at },
        { trait_type: "Rarity Score", value: artwork.rarity_score || 0 }
      ],
      external_url: `https://tamv.app/artwork/${artwork_id}`
    };

    // In production, upload metadata to IPFS
    const metadata_uri = `ipfs://QmMockHash${artwork_id}`;

    // Store NFT certificate
    const { data: nftCert, error: nftError } = await supabaseClient
      .from("nft_certificates")
      .insert({
        artwork_id,
        token_id,
        contract_address,
        blockchain,
        mint_tx_hash: mock_tx_hash,
        owner_wallet,
        metadata_uri,
        verified: true
      })
      .select()
      .single();

    if (nftError) throw nftError;

    // Update artwork with NFT info
    await supabaseClient
      .from("artworks")
      .update({
        nft_token_id: token_id,
        nft_contract_address: contract_address,
        blockchain_hash: mock_tx_hash
      })
      .eq("id", artwork_id);

    // Create audit log
    await supabaseClient.from("entity_logs").insert({
      entity_type: "nft_certificate",
      entity_id: nftCert.id,
      action: "nft_minted",
      actor_id: user.id,
      new_state: { token_id, blockchain, contract_address }
    });

    return new Response(JSON.stringify({
      success: true,
      nft: {
        token_id,
        contract_address,
        blockchain,
        transaction_hash: mock_tx_hash,
        metadata_uri,
        explorer_url: `https://${blockchain}.io/tx/${mock_tx_hash}`
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
