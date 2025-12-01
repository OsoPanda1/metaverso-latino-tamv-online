interface TamvPhotoGalleryProps {
  images: { url: string }[];
  effect?: "parallax" | "grid";
}

export const TamvPhotoGallery = ({ images, effect = "grid" }: TamvPhotoGalleryProps) => {
  if (images.length === 0) return null;

  return (
    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
      {images.map((img, i) => (
        <img
          key={i}
          src={img.url}
          alt={`Foto ${i + 1}`}
          className="rounded-lg border border-border/50 neon-box-shadow hover:scale-105 transition-transform"
        />
      ))}
    </div>
  );
};
