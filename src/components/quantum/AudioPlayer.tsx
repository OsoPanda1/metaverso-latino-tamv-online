interface AudioPlayerProps {
  src: string;
}

export const AudioPlayer = ({ src }: AudioPlayerProps) => {
  return (
    <div className="mt-2">
      <audio controls src={src} className="w-full" />
    </div>
  );
};
