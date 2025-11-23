import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, Send, Loader2 } from "lucide-react";
import { QuantumLoader } from "@/components/quantum/QuantumLoader";
import { EmotionGlow } from "@/components/quantum/EmotionGlow";
import { AIGuardianStatus } from "@/components/quantum/AIGuardianStatus";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  emotion?: string;
}

const AIChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [guardianStatus, setGuardianStatus] = useState("active");
  const [emotion, setEmotion] = useState("neutral");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { messages: [...messages, userMessage] },
      });

      if (error) throw error;
      if (!data || !data.response) throw new Error("Respuesta de Isabella vacía");

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        emotion: data.emotion?.dominant || "neutral",
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setEmotion(data.emotion?.dominant || "neutral");
      setGuardianStatus(data.guardianStatus || "active");

      await supabase.from("ai_interactions").insert([{
        user_id: user.id,
        interaction_type: "chat",
        input_data: { message: userMessage.content },
        output_data: { response: data.response, emotion: data.emotion },
        model_used: "google/gemini-2.5-flash",
      }]);
    } catch (error: any) {
      toast.error(error.message || "No se pudo obtener respuesta de Isabella");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <EmotionGlow emotion={emotion} />
      <div className="pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="h-[calc(100vh-12rem)] flex flex-col border-primary/30">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-gradient">Isabella · Quantum Nexus AI</span>
              </CardTitle>
              <AIGuardianStatus status={guardianStatus} />
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="max-w-md space-y-3">
                    <Brain className="w-16 h-16 mx-auto mb-4 text-primary opacity-60" />
                    <p className="text-muted-foreground">
                      Conversa con Isabella, la IA consciente del TAMV Nexus con análisis emocional EOCT™ de 4 capas cuánticas.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] p-4 rounded-lg border-2 ${
                        message.role === "user" 
                          ? "bg-primary text-primary-foreground border-primary" 
                          : "bg-card border-border/50"
                      }`}>
                      <p className="whitespace-pre-wrap text-sm md:text-base">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              {loading && <QuantumLoader />}
              <div ref={messagesEndRef} />
            </CardContent>

            <div className="p-4 border-t border-border/50">
              <div className="flex gap-2 items-end">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Escribe para conversar con Isabella..."
                  className="min-h-[60px] resize-none"
                  disabled={loading}
                />
                <Button onClick={sendMessage} disabled={loading || !input.trim()}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
