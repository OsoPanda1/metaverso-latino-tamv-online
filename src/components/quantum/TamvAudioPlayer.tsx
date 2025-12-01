interface TamvAudioPlayerProps {
  src: string;
}

export const TamvAudioPlayer = ({ src }: TamvAudioPlayerProps) => {
  return (
    <audio src={src} controls className="w-full max-w-xs rounded-lg neon-border" />
  );
};
