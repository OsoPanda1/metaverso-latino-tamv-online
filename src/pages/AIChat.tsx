import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, Send, Loader2, Mic, Image as ImageIcon, FileAudio, File } from "lucide-react";
import { QuantumLoader, EmotionGlow, AIGuardianStatus, FilePreview, AudioPlayer } from "@/components/quantum/assets";
import { toast } from "sonner";
import useVoice from "@/hooks/useVoice"; // custom voice hook
import useFileUpload from "@/hooks/useFileUpload"; // custom file upload

interface Message {
  role: "user" | "assistant";
  content: string;
  type?: "text" | "audio" | "image" | "file";
  mediaUrl?: string;
  emotion?: string;
  auditId?: string;
}

const AIChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice (speech-to-text & TTS)
  const { recording, startRecording, stopRecording, transcript, playTTS, audioUrl } = useVoice();
  // File/image/audio upload
  const { files, addFile, removeFile, previewFiles } = useFileUpload();

  // Guardianes/estado IA
  const [guardianStatus, setGuardianStatus] = useState("active");
  const [emotion, setEmotion] = useState("neutral");

  // Scroll automático
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Procesa y envía mensaje multimodal
  const sendMessage = async (msgOverride?: Message) => {
    if ((!input.trim() && !files.length && !audioUrl && !msgOverride) || !user) return;

    let userMessage: Message;
    if (msgOverride) {
      userMessage = msgOverride;
    } else if (audioUrl) {
      userMessage = { role: "user", content: transcript || "[Audio]", type: "audio", mediaUrl: audioUrl, auditId: "audio-" + Date.now() };
    } else if (files.length) {
      userMessage = {
        role: "user",
        content: "[Archivo adjunto]",
        type: files[0].type.startsWith("image") ? "image" :
              files[0].type.startsWith("audio") ? "audio" : "file",
        mediaUrl: previewFiles[0],
        auditId: "file-" + Date.now()
      };
    } else {
      userMessage = { role: "user", content: input, type: "text", auditId: "text-" + Date.now() };
    }

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Incluye metadata multimodal
      const { data, error } = await supabase.functions.invoke("ai-chat-multimodal", {
        body: { messages: [...messages, userMessage], files, audioUrl, emotion, guardians: guardianStatus },
      });
      if (error) throw error;
      if (!data || !data.response) throw new Error("Respuesta de Isabella vacía");

      // Response multimodal: puede incluir TTS/audio, documento, imagen, emoción
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        type: data.type || "text",
        mediaUrl: data.mediaUrl,
        emotion: data.emotion,
        auditId: "ai-" + Date.now()
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setEmotion(data.emotion || "neutral");
      setGuardianStatus(data.guardianStatus || "active");

      await supabase.from("ai_interactions").insert({
        user_id: user.id,
        interaction_type: "chat",
        input_data: { message: userMessage, files },
        output_data: { response: data.response, emotion: data.emotion, media: data.mediaUrl },
        model_used: "isabella-villaseor-quantum",
      });
    } catch (error: any) {
      toast.error(error.message || "No se pudo obtener respuesta de Isabella");
    } finally {
      setLoading(false);
    }
  };

  // Teclado: texto
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // Procesa voz input
  useEffect(() => {
    if (transcript && transcript.length && !recording) {
      sendMessage({ role: "user", content: transcript, type: "audio", mediaUrl: audioUrl, auditId: "audio-" + Date.now() });
    }
    // eslint-disable-next-line
  }, [recording]);

  // Adjuntar archivos (img/audio/file)
  const handleAttachFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFile(e.target.files);
  };

  return (
    <div className="min-h-screen quantum-bg xr-hologram">
      <Navigation />
      <EmotionGlow emotion={emotion} />
      <div className="pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-4xl animate-fade-in">
          <Card className="h-[calc(100vh-12rem)] flex flex-col border-primary/30 glow-cyan">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary animate-pulse-glow" />
                <span className="text-gradient">Isabella · Quantum Nexus AI</span>
              </CardTitle>
              <AIGuardianStatus status={guardianStatus} />
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="max-w-md space-y-3">
                    <Brain className="w-16 h-16 mx-auto mb-4 text-primary opacity-60 animate-pulse-glow" />
                    <p className="text-muted-foreground">
                      Habla, escribe, adjunta o graba para desplegar la magnificencia multisensorial del Nexus Isabella.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] p-4 rounded-lg animate-fade-in border-2 border-quantum/20 backdrop-blur ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border/50"
                      }`}>
                      <p className="whitespace-pre-wrap text-sm md:text-base">{message.content}</p>
                      {message.mediaUrl && (
                        <>
                          {message.type === "image" && <img src={message.mediaUrl} alt="Adjunto" className="mt-3 rounded shadow" />}
                          {message.type === "audio" && <AudioPlayer src={message.mediaUrl} />}
                          {message.type === "file" && <FilePreview file={message.mediaUrl} />}
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
              {loading && <QuantumLoader visible />}
              <div ref={messagesEndRef} />
            </CardContent>

            <div className="p-4 border-t border-border/50">
              <div className="flex gap-2 items-end">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe, habla o adjunta para conversar con Isabella..."
                  className="min-h-[60px] resize-none"
                  disabled={loading}
                />
                <Button onClick={startRecording} disabled={loading || recording} className="mic-btn-glow hologram-motion">
                  <Mic className="w-5 h-5" />
                </Button>
                <input type="file" accept="image/*,audio/*,application/pdf" multiple onChange={handleAttachFile} style={{ display: "none" }} id="file-attach"/>
                <Button as="label" htmlFor="file-attach" className="attach-btn-glow hologram-motion">
                  <ImageIcon className="w-5 h-5" />
                  <FileAudio className="w-5 h-5" />
                  <File className="w-5 h-5" />
                </Button>
                <Button onClick={sendMessage} disabled={loading || (!input.trim() && !files.length && !audioUrl)} className="glow-cyan hover-scale">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {previewFiles.map((url, idx) => (
                  <FilePreview key={idx} file={url} onRemove={() => removeFile(idx)} />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
