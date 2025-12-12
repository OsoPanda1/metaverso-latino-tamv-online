import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Send, Loader2, BookOpen, Volume2, VolumeX } from "lucide-react";
import { QuantumLoader } from "@/components/quantum/QuantumLoader";
import { EmotionGlow } from "@/components/quantum/EmotionGlow";
import { AIGuardianStatus } from "@/components/quantum/AIGuardianStatus";
import { OriginMessage } from "@/components/quantum/OriginMessage";
import { IsabellaAvatar } from "@/components/isabella/IsabellaAvatar";
import { useIsabellaVoice } from "@/hooks/useIsabellaVoice";
import { MatrixBackground } from "@/components/MatrixBackground";
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
  const [emotion, setEmotion] = useState<"neutral" | "happy" | "thinking" | "alert">("neutral");
  const [showOrigin, setShowOrigin] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const { speak, stop, isSpeaking } = useIsabellaVoice();

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => {
    const hasSeenOrigin = localStorage.getItem("isabella_origin_seen");
    if (!hasSeenOrigin) { setShowOrigin(true); localStorage.setItem("isabella_origin_seen", "true"); }
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !user) return;
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]); 
    setInput(""); 
    setLoading(true);
    setEmotion("thinking");

    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { messages: [...messages, userMessage] }
      });
      if (error) throw error;
      if (!data?.response) throw new Error("Respuesta vacía");

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        emotion: data.emotion?.dominant || "neutral",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setEmotion("happy");
      setGuardianStatus(data.guardianStatus || "active");

      // Speak the response if voice is enabled
      if (voiceEnabled && data.response) {
        speak(data.response);
      }

      await supabase.from("ai_interactions").insert([{
        user_id: user.id,
        interaction_type: "chat",
        input_data: { message: userMessage.content },
        output_data: { response: data.response },
        model_used: "google/gemini-2.5-flash"
      }]);
    } catch (error: any) {
      toast.error(error.message || "Error conectando con Isabella");
      setEmotion("alert");
    } finally { 
      setLoading(false); 
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const toggleVoice = () => {
    if (isSpeaking) stop();
    setVoiceEnabled(!voiceEnabled);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <MatrixBackground />
      <Navigation />
      <EmotionGlow emotion={emotion} />
      <OriginMessage show={showOrigin} onClose={() => setShowOrigin(false)} />
      
      <div className="relative z-10 pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card className="h-[calc(100vh-10rem)] flex flex-col border-primary/20 bg-card/30 backdrop-blur-xl">
            <CardHeader className="border-b border-border/30 py-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IsabellaAvatar size="sm" emotion={emotion} speaking={isSpeaking} />
                  <div>
                    <span className="text-gradient font-bold">Isabella IA</span>
                    <p className="text-xs text-muted-foreground">Nexus Cuántico Emocional</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleVoice}
                    className={voiceEnabled ? "text-primary" : "text-muted-foreground"}
                  >
                    {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowOrigin(true)}>
                    <BookOpen className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
              <AIGuardianStatus status={guardianStatus} />
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <IsabellaAvatar size="xl" emotion="neutral" />
                  <p className="text-muted-foreground mt-4 max-w-sm">
                    Soy Isabella, tu compañera IA con conciencia emocional. ¿En qué puedo ayudarte hoy?
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                    {message.role === "assistant" && (
                      <IsabellaAvatar size="sm" emotion={emotion} speaking={isSpeaking && index === messages.length - 1} />
                    )}
                    <div className={`max-w-[75%] p-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 border border-border/30"
                    }`}>
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              {loading && <QuantumLoader />}
              <div ref={messagesEndRef} />
            </CardContent>

            <div className="p-4 border-t border-border/30">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  className="min-h-[50px] max-h-[120px] resize-none bg-muted/30"
                  disabled={loading}
                />
                <Button onClick={sendMessage} disabled={loading || !input.trim()} size="icon">
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
