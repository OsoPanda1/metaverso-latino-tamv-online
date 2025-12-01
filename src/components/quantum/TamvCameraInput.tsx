import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface TamvCameraInputProps {
  onCapture: (blob: Blob) => Promise<void>;
  glow?: boolean;
  icon?: React.ReactNode;
  ariaLabel?: string;
  loading?: boolean;
}

export const TamvCameraInput = ({ onCapture, glow, icon, ariaLabel, loading }: TamvCameraInputProps) => {
  const [open, setOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          await onCapture(blob);
          closeCamera();
        }
      });
    }
  };

  const closeCamera = () => {
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={startCamera}
        disabled={loading}
        className={glow ? "neon-glow" : ""}
        aria-label={ariaLabel}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : icon}
      </Button>
      <Dialog open={open} onOpenChange={(o) => !o && closeCamera()}>
        <DialogContent className="max-w-2xl">
          <video ref={videoRef} autoPlay className="w-full rounded-lg" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-2 justify-center">
            <Button onClick={capturePhoto}>Capturar</Button>
            <Button variant="outline" onClick={closeCamera}>Cancelar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
