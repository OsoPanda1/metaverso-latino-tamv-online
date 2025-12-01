import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface TamvAudioRecorderProps {
  onRecord: (blob: Blob) => Promise<void>;
  loading?: boolean;
  glow?: boolean;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

export const TamvAudioRecorder = ({ onRecord, loading, glow, icon, ariaLabel }: TamvAudioRecorderProps) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await onRecord(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <Button
      type="button"
      variant={recording ? "destructive" : "outline"}
      size="icon"
      onClick={recording ? stopRecording : startRecording}
      disabled={loading}
      className={glow ? "neon-glow" : ""}
      aria-label={ariaLabel}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : icon}
    </Button>
  );
};
