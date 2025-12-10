import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield, ShieldCheck, ShieldX, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface FederationBadgeProps {
  entityType: string;
  entityId: string;
  hash: string;
  className?: string;
  showDetails?: boolean;
}

interface FederationData {
  verified: boolean;
  local_at?: string;
  continental_at?: string;
  local_signer?: string;
  continental_signer?: string;
}

export default function FederationBadge({
  entityType,
  entityId,
  hash,
  className,
  showDetails = false
}: FederationBadgeProps) {
  const [data, setData] = useState<FederationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFederation = async () => {
      try {
        // Check local registry
        const { data: localData } = await supabase
          .from("federation_registry_local")
          .select("*")
          .eq("entity_type", entityType)
          .eq("entity_id", entityId)
          .eq("hash", hash)
          .limit(1);

        // Check continental registry
        const { data: contData } = await supabase
          .from("federation_registry_continental")
          .select("*")
          .eq("entity_type", entityType)
          .eq("entity_id", entityId)
          .eq("hash", hash)
          .limit(1);

        const verified = !!(localData?.[0] && contData?.[0]);

        setData({
          verified,
          local_at: localData?.[0]?.created_at,
          continental_at: contData?.[0]?.created_at,
          local_signer: localData?.[0]?.signer,
          continental_signer: contData?.[0]?.signer
        });
      } catch (err) {
        console.error("Federation check error:", err);
        setData({ verified: false });
      } finally {
        setLoading(false);
      }
    };

    if (entityType && entityId && hash) {
      checkFederation();
    }
  }, [entityType, entityId, hash]);

  if (loading) {
    return (
      <span className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-full bg-muted animate-pulse",
        className
      )}>
        <Shield className="w-3 h-3" />
        Verificando...
      </span>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className={cn("inline-flex flex-col gap-1", className)}>
      <span className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-all",
        data.verified
          ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30"
          : "bg-destructive/20 text-destructive border border-destructive/30"
      )}>
        {data.verified ? (
          <ShieldCheck className="w-3.5 h-3.5" />
        ) : (
          <ShieldX className="w-3.5 h-3.5" />
        )}
        {data.verified ? "Doble Federado" : "Sin Federación"}
        <span className="opacity-60 font-mono">{hash.slice(0, 8)}...</span>
      </span>

      {showDetails && data.verified && (
        <div className="text-[10px] text-muted-foreground space-y-0.5 pl-1">
          <div className="flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            <span>Local: {data.local_at ? new Date(data.local_at).toLocaleString() : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            <span>Continental: {data.continental_at ? new Date(data.continental_at).toLocaleString() : 'N/A'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
