import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TamvTipInputProps {
  onSend?: (amount: number) => void;
  streamId?: string;
}

export const TamvTipInput = ({ onSend }: TamvTipInputProps) => {
  const [amount, setAmount] = useState("");

  const handleSend = () => {
    const num = parseFloat(amount);
    if (num > 0) {
      onSend?.(num);
      setAmount("");
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        type="number"
        placeholder="Propina..."
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="0"
        step="0.01"
      />
      <Button onClick={handleSend} disabled={!amount}>
        Enviar
      </Button>
    </div>
  );
};
