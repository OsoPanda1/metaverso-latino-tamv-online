interface HoloHexGridSVGProps {
  className?: string;
  glowColor?: string;
  nLayers?: number;
  morph?: boolean;
  animate?: boolean;
}

export const HoloHexGridSVG = ({ className, glowColor = "currentColor" }: HoloHexGridSVGProps) => {
  return (
    <svg className={className || "fixed inset-0 w-full h-full opacity-10 pointer-events-none"} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
          <polygon points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.3,43.7 12.3,29.2" fill="none" stroke={glowColor} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexagons)" className="text-primary" />
    </svg>
  );
};
