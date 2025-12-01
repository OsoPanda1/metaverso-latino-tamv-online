import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface TamvWishlistProps {
  items?: string[];
  shimmer?: boolean;
  onAdd?: (item: any) => void;
}

export const TamvWishlist = ({ items = [] }: TamvWishlistProps) => {
  if (items.length === 0) return null;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold">Lista de deseos</h3>
        </div>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-muted-foreground">• {item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
