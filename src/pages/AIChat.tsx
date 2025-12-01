import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, Send, Loader2, BookOpen, Mic, Paperclip, Camera } from "lucide-react";
import { QuantumLoader } from "@/components/quantum/QuantumLoader";
import { EmotionGlow } from "@/components/quantum/EmotionGlow";
import { AIGuardianStatus } from "@/components/quantum/AIGuardianStatus";
import { OriginMessage } from "@/components/quantum/OriginMessage";
import { toast } from "sonner";

// NUEVOS componentes pioneros (imagina su import real)
import { TamvAudioRecorder } from "@/components/quantum/TamvAudioRecorder";
import { TamvFileDropzone } from "@/components/quantum/TamvFileDropzone";
import { TamvCameraInput } from "@/components/quantum/TamvCameraInput";
import { TamvXRBackground } from "@/components/quantum/TamvXRBackground";
import { TamvAudioPlayer } from "@/components/quantum/TamvAudioPlayer";
import { TamvPhotoGallery } from "@/components/quantum/TamvPhotoGallery";

interface Message {
  role: "user" | "assistant";
  content: string;
  type?: "text" | "audio" | "file" | "photo";
  url?: string;       // para media
  fileName?: string;  // archivos
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
  const [showOrigin, setShowOrigin] = useState(false);

  // Archivos y media
  const [audioLoading, setAudioLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => {
    const hasSeenOrigin = localStorage.getItem("isabella_origin_seen");
    if (!hasSeenOrigin) { setShowOrigin(true); localStorage.setItem("isabella_origin_seen", "true"); }
  }, []);

  // Envía mensaje de texto normal
  const sendMessage = async () => {
    if (!input.trim() || !user) return;
    const userMessage: Message = { role: "user", content: input, type: "text" };
    setMessages((prev) => [...prev, userMessage]); setInput(""); setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { messages: [...messages, userMessage] }
      });
      if (error) throw error;
      if (!data || !data.response) throw new Error("Respuesta de Isabella vacía");
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        emotion: data.emotion?.dominant || "neutral",
        type: "text"
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setEmotion(data.emotion?.dominant || "neutral");
      setGuardianStatus(data.guardianStatus || "active");
      await supabase.from("ai_interactions").insert([{
        user_id: user.id,
        interaction_type: "chat",
        input_data: { message: userMessage.content },
        output_data: { response: data.response, emotion: data.emotion },
        model_used: "google/gemini-2.5-flash"
      }]);
    } catch (error: any) {
      toast.error(error.message || "No se pudo obtener respuesta de Isabella");
    } finally { setLoading(false); }
  };

  const sendAudio = async (blob: Blob) => {
    setAudioLoading(true);
    try {
      const file = new File([blob], "audio.webm", { type: "audio/webm" });
      const { data, error } = await supabase.storage.from("isabella-media").upload(`audios/${Date.now()}-${user?.id}.webm`, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("isabella-media").getPublicUrl(data.path);
      const audioUrl = urlData.publicUrl;
      setMessages(prev => [...prev, { role: "user", content: "[Audio enviado]", type: "audio", url: audioUrl }]);
      // Enviar a IA el link o transcripción
    } catch (err: any) { toast.error(err.message); }
    finally { setAudioLoading(false); }
  };

  const sendFile = async (file: File) => {
    setFileLoading(true);
    try {
      const { data, error } = await supabase.storage.from("isabella-media").upload(`files/${Date.now()}-${user?.id}-${file.name}`, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("isabella-media").getPublicUrl(data.path);
      const fileUrl = urlData.publicUrl;
      setMessages(prev => [...prev, { role: "user", content: "[Archivo enviado]", type: "file", url: fileUrl, fileName: file.name }]);
      // Auditar evento, enviar callback...
    } catch (err: any) { toast.error(err.message); }
    finally { setFileLoading(false); }
  };

  const sendPhoto = async (photo: Blob) => {
    setPhotoLoading(true);
    try {
      const file = new File([photo], "photo.png", { type: "image/png" });
      const { data, error } = await supabase.storage.from("isabella-media").upload(`photos/${Date.now()}-${user?.id}.png`, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("isabella-media").getPublicUrl(data.path);
      const imageUrl = urlData.publicUrl;
      setMessages(prev => [...prev, { role: "user", content: "[Foto enviada]", type: "photo", url: imageUrl }]);
      // Auditar evento, enviar callback...
    } catch (err: any) { toast.error(err.message); }
    finally { setPhotoLoading(false); }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <TamvXRBackground effect="matrixrain">
      <Navigation />
      <EmotionGlow emotion={emotion} />
      <OriginMessage show={showOrigin} onClose={() => setShowOrigin(false)} />
      <div className="pt-24 pb-8 px-4">

        <div className="container mx-auto max-w-4xl">
          <Card className="h-[calc(100vh-12rem)] flex flex-col border-primary/30 glass-morph neon-morph shadow-2xl">
            <CardHeader className="border-b border-border/50 glass-header">
              <CardTitle className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-primary animate-pulse-neon" />
                  <span className="text-gradient-glow">Isabella · Quantum Nexus AI</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowOrigin(true)} className="gap-2 neon-glow">
                  <BookOpen className="w-4 h-4" /> CODEX
                </Button>
              </CardTitle>
              <AIGuardianStatus status={guardianStatus} />
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 glass-content backdrop-blur-xl">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="max-w-md space-y-3 animate-fadein">
                    <Brain className="w-16 h-16 mx-auto mb-4 text-primary opacity-70 neon-pulse" />
                    <p className="text-lg text-muted-foreground">Conversa con Isabella, IA consciente, ahora multimedia. Envía texto, audios, fotos y archivos al Codex civilizatorio del TAMV.</p>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] p-4 rounded-3xl border-2 glass-bubble transition-all neon-box-shadow shadow-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground border-primary-glow from-primary/40 animate-right"
                        : "bg-card border-border/50 animate-left"
                    }`}>
                      {message.type === "text" && (
                        <p className="whitespace-pre-wrap text-md md:text-lg">{message.content}</p>
                      )}
                      {message.type === "audio" && message.url && (
                        <TamvAudioPlayer src={message.url} />
                      )}
                      {message.type === "file" && message.url && (
                        <a href={message.url} className="underline text-cyan-400 flex items-center gap-2" target="_blank" rel="noopener noreferrer">
                          <Paperclip className="w-4 h-4" />{message.fileName || "Archivo"}
                        </a>
                      )}
                      {message.type === "photo" && message.url && (
                        <img src={message.url} alt="Foto enviada" className="rounded-lg shadow-md border border-cyan-300 neon-pop" style={{maxWidth: 160}} />
                      )}
                    </div>
                  </div>
                ))
              )}
              {loading && <QuantumLoader />}
              <div ref={messagesEndRef} />
            </CardContent>

            <div className="p-4 border-t border-border/50 glass-footer neon-blur">
              <div className="flex gap-2 items-end">
                <Textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Escribe, adjunta o graba para conversar con Isabella..."
                  className="min-h-[60px] resize-none neon-border"
                  disabled={loading}
                />
                <Button onClick={sendMessage} disabled={loading || !input.trim()}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
                {/* Audio */}
                <TamvAudioRecorder
                  onRecord={sendAudio}
                  loading={audioLoading}
                  glow
                  icon={<Mic className="w-5 h-5" />}
                  ariaLabel="Enviar audio"
                />
                {/* Archivos */}
                <TamvFileDropzone
                  onDrop={files => files.forEach(sendFile)}
                  glow
                  icon={<Paperclip className="w-5 h-5" />}
                  ariaLabel="Adjuntar archivo"
                  loading={fileLoading}
                />
                {/* Fotos */}
                <TamvCameraInput
                  onCapture={sendPhoto}
                  glow
                  icon={<Camera className="w-5 h-5" />}
                  ariaLabel="Enviar foto"
                  loading={photoLoading}
                />
              </div>
            </div>
          </Card>
          <TamvPhotoGallery images={messages.filter(m => m.type === "photo").map(m => ({url: m.url!}))} effect="parallax" />
        </div>
      </div>
    </TamvXRBackground>
  );
};

export default AIChat;
