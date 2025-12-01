import { ReactNode } from "react";

interface TamvXRBackgroundProps {
  effect?: "matrixrain" | "parallax" | "holohex";
  children: ReactNode;
}

export const TamvXRBackground = ({ effect = "matrixrain", children }: TamvXRBackgroundProps) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {effect === "matrixrain" && (
        <div className="fixed inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent)]" />
      )}
      {children}
    </div>
  );
};
