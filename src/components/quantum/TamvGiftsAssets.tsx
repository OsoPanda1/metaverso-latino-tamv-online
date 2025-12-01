import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Gift {
  id: string;
  name: string;
  price: number;
  icon: string;
}

interface TamvGiftsAssetsProps {
  onSelect?: (gift: Gift) => void;
}

export const TamvGiftsAssets = ({ onSelect }: TamvGiftsAssetsProps) => {
  const gifts: Gift[] = [
    { id: "1", name: "Rosa", price: 1, icon: "🌹" },
    { id: "2", name: "Corazón", price: 5, icon: "❤️" },
    { id: "3", name: "Corona", price: 10, icon: "👑" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {gifts.map((gift) => (
        <Card key={gift.id} className="cursor-pointer hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="text-4xl text-center">{gift.icon}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center font-semibold">{gift.name}</p>
            <p className="text-center text-sm text-muted-foreground">${gift.price}</p>
            <Button
              size="sm"
              className="w-full mt-2"
              onClick={() => onSelect?.(gift)}
            >
              Enviar
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
