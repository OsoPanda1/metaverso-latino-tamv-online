import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Coins, TrendingUp, TrendingDown, Wallet, ArrowRight } from "lucide-react";

interface WalletData {
  id: string;
  credits_balance: number;
  total_earned: number;
  total_spent: number;
  membership_level: string;
}

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
}

export default function Credits() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseAmount, setPurchaseAmount] = useState("");

  useEffect(() => {
    if (user) {
      fetchWalletData();
      fetchTransactions();
    }
  }, [user]);

  const fetchWalletData = async () => {
    try {
      let { data, error } = await supabase
        .from("tamv_wallets")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error && error.code === "PGRST116") {
        // Create wallet if it doesn't exist
        const { data: newWallet, error: createError } = await supabase
          .from("tamv_wallets")
          .insert({ user_id: user?.id })
          .select()
          .single();

        if (createError) throw createError;
        data = newWallet;
      } else if (error) {
        throw error;
      }

      setWallet(data);
    } catch (error: any) {
      toast.error("Error loading wallet: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!wallet) return;

    try {
      const { data, error } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("wallet_id", wallet.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      toast.error("Error loading transactions: " + error.message);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "purchase":
      case "earn":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "spend":
      case "withdrawal":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <ArrowRight className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Coins className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">TAMV Credits™</h1>
          <p className="text-muted-foreground">Internal economic system · $0.20 sale / $0.15 buyback</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {wallet?.credits_balance.toFixed(2)} TC
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Total Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">
                {wallet?.total_earned.toFixed(2)} TC
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-500">
                {wallet?.total_spent.toFixed(2)} TC
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Purchase Credits</CardTitle>
            <CardDescription>Buy TAMV Credits at $0.20 USD per credit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="Amount in USD"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
              />
              <Button onClick={() => toast.info("Payment integration coming soon")}>
                Purchase
              </Button>
            </div>
            {purchaseAmount && (
              <p className="text-sm text-muted-foreground mt-2">
                You will receive {(parseFloat(purchaseAmount) / 0.20).toFixed(2)} TAMV Credits
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest credit activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(tx.transaction_type)}
                    <div>
                      <p className="font-medium">{tx.description || tx.transaction_type}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      tx.transaction_type === "purchase" || tx.transaction_type === "earn"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}>
                      {tx.transaction_type === "purchase" || tx.transaction_type === "earn" ? "+" : "-"}
                      {Math.abs(tx.amount).toFixed(2)} TC
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Balance: {tx.balance_after.toFixed(2)} TC
                    </p>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No transactions yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}