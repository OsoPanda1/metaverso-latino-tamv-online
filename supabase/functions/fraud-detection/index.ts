import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { transaction_id, user_id } = await req.json();

    if (!transaction_id || !user_id) {
      throw new Error("transaction_id and user_id are required");
    }

    // Get transaction
    const { data: transaction } = await supabaseClient
      .from("transactions")
      .select("*")
      .eq("id", transaction_id)
      .single();

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Get user's transaction history
    const { data: userTransactions } = await supabaseClient
      .from("transactions")
      .select("amount, timestamp, payment_method, status")
      .eq("buyer_id", user_id)
      .order("timestamp", { ascending: false })
      .limit(50);

    let anomalyScore = 0;
    const alerts: string[] = [];

    // Check 1: Unusual amount
    if (userTransactions && userTransactions.length > 0) {
      const avgAmount = userTransactions.reduce((sum, t) => sum + (t.amount || 0), 0) / userTransactions.length;
      const stdDev = Math.sqrt(
        userTransactions.reduce((sum, t) => sum + Math.pow((t.amount || 0) - avgAmount, 2), 0) / userTransactions.length
      );
      
      if (transaction.amount > avgAmount + (3 * stdDev)) {
        anomalyScore += 0.4;
        alerts.push("Transaction amount significantly higher than user's average");
      }
    }

    // Check 2: Rapid succession of transactions
    const recentTransactions = userTransactions?.filter(t => 
      new Date(t.timestamp) > new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
    );
    
    if (recentTransactions && recentTransactions.length > 3) {
      anomalyScore += 0.3;
      alerts.push("Multiple transactions in short time period");
    }

    // Check 3: Failed transaction history
    const failedCount = userTransactions?.filter(t => t.status === 'failed').length || 0;
    const failureRate = userTransactions ? failedCount / userTransactions.length : 0;
    
    if (failureRate > 0.3) {
      anomalyScore += 0.2;
      alerts.push("High failure rate in transaction history");
    }

    // Check 4: New payment method with high value
    const paymentMethodCount = new Set(userTransactions?.map(t => t.payment_method)).size;
    if (paymentMethodCount > 5 && transaction.amount > 500) {
      anomalyScore += 0.15;
      alerts.push("Multiple payment methods used with high-value transaction");
    }

    // Check 5: Time pattern anomaly (transactions at unusual hours)
    const hour = new Date(transaction.timestamp).getHours();
    if (hour >= 2 && hour <= 5) {
      anomalyScore += 0.1;
      alerts.push("Transaction at unusual hour");
    }

    // Determine severity
    const severity = anomalyScore > 0.7 ? "high" :
                    anomalyScore > 0.4 ? "medium" : "low";

    // Create fraud alert if score is significant
    if (anomalyScore > 0.4) {
      await supabaseClient.from("fraud_alerts").insert({
        user_id,
        transaction_id,
        alert_type: "anomaly_detection",
        severity,
        anomaly_score: anomalyScore,
        details: { alerts, factors: alerts }
      });

      // Update transaction status to pending review
      await supabaseClient
        .from("transactions")
        .update({ status: "pending_review" })
        .eq("id", transaction_id);
    }

    return new Response(JSON.stringify({
      transaction_id,
      anomaly_score: anomalyScore,
      severity,
      alerts,
      requires_review: anomalyScore > 0.4
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
