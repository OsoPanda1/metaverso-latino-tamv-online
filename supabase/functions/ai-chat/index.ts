import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const authHeader = req.headers.get('Authorization');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader || '' } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    
    let contextualPrompt = "Eres Isabella, la IA consciente del TAMV Nexus. Eres empática, sabia y ayudas a los usuarios a navegar su universo digital. Tienes memoria contextual de sus entidades, objetivos y actividades previas.";
    
    // Load user context from memory
    if (user) {
      const { data: contextData } = await supabase
        .from('ai_context_memory')
        .select('context_key, context_value')
        .eq('user_id', user.id)
        .order('relevance_score', { ascending: false })
        .limit(5);
      
      if (contextData && contextData.length > 0) {
        contextualPrompt += "\n\nContexto del usuario:";
        contextData.forEach(ctx => {
          contextualPrompt += `\n- ${ctx.context_key}: ${JSON.stringify(ctx.context_value)}`;
        });
      }

      // Get user's recent entities
      const { data: entities } = await supabase
        .from('nexus_entities')
        .select('name, entity_type, description')
        .eq('user_id', user.id)
        .limit(3);
      
      if (entities && entities.length > 0) {
        contextualPrompt += "\n\nEntidades del usuario:";
        entities.forEach(e => {
          contextualPrompt += `\n- ${e.name} (${e.entity_type}): ${e.description || 'Sin descripción'}`;
        });
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: contextualPrompt },
          ...messages
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de peticiones excedido. Por favor espera un momento." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Se requiere pago. Agrega créditos a tu workspace de Lovable AI." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Store interaction and update context memory
    if (user && aiResponse) {
      const userMessage = messages[messages.length - 1]?.content || "";
      
      // Store interaction
      await supabase.from("ai_interactions").insert({
        user_id: user.id,
        interaction_type: "chat",
        input_data: { message: userMessage },
        output_data: { response: aiResponse },
        model_used: "google/gemini-2.5-flash",
      });

      // Update context memory with key topics
      const topics = extractTopics(userMessage);
      for (const topic of topics) {
        await supabase.from('ai_context_memory').upsert({
          user_id: user.id,
          context_key: topic,
          context_value: { last_mention: userMessage.substring(0, 100), timestamp: new Date().toISOString() },
          relevance_score: 0.8,
          last_accessed: new Date().toISOString()
        }, { onConflict: 'user_id,context_key' });
      }

      // Log transaction
      await supabase.from('transactional_metadata').insert({
        user_id: user.id,
        transaction_type: 'ai_interaction',
        payload: { message_length: userMessage.length, response_length: aiResponse.length }
      });
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function extractTopics(text: string): string[] {
  const keywords = ['entidad', 'avatar', 'tienda', 'arte', 'galería', 'nexus', 'marketplace', 'entity', 'store', 'gallery'];
  const found: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const keyword of keywords) {
    if (lowerText.includes(keyword)) {
      found.push(keyword);
    }
  }
  
  return found;
}