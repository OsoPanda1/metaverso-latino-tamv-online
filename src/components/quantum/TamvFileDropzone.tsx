import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface TamvFileDropzoneProps {
  onDrop: (files: File[]) => void;
  glow?: boolean;
  icon?: React.ReactNode;
  ariaLabel?: string;
  loading?: boolean;
}

export const TamvFileDropzone = ({ onDrop, glow, icon, ariaLabel, loading }: TamvFileDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) onDrop(files);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept="*/*"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className={glow ? "neon-glow" : ""}
        aria-label={ariaLabel}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : icon}
      </Button>
    </>
  );
};
