import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useIsabellaVoice = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(async (text: string) => {
    if (!text || isLoading) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("isabella-voice", {
        body: { text },
      });

      if (error) throw error;
      if (!data?.audioContent) throw new Error("No audio received");

      // Create audio from base64
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
        { type: "audio/mpeg" }
      );
      const audioUrl = URL.createObjectURL(audioBlob);

      // Stop any existing audio
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      // Play new audio
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onplay = () => setIsSpeaking(true);
      audioRef.current.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      audioRef.current.onerror = () => {
        setIsSpeaking(false);
        toast.error("Error reproduciendo audio");
      };

      await audioRef.current.play();
    } catch (error: any) {
      console.error("Isabella voice error:", error);
      toast.error("No se pudo generar la voz");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stop, isSpeaking, isLoading };
};
