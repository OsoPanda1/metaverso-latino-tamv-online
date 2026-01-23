import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { MatrixBackground } from "@/components/MatrixBackground";
import { toast } from "sonner";

// Omniverse Components
import OmniverseHero from "@/components/omniverse/OmniverseHero";
import FederatedLayersDisplay from "@/components/omniverse/FederatedLayersDisplay";
import SecurityLayersGrid from "@/components/omniverse/SecurityLayersGrid";
import GuardiansCluster from "@/components/omniverse/GuardiansCluster";
import IsabellaCorePanel from "@/components/omniverse/IsabellaCorePanel";
import BlockchainMSRPanel from "@/components/omniverse/BlockchainMSRPanel";

import { initializeOmniverse } from "@/lib/omniverse-architecture";

export default function DreamSpaces() {
  const { user } = useAuth();

  useEffect(() => {
    initializeOmniverse();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <MatrixBackground />
      <Navigation />
      
      <main className="relative z-10 pt-20 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Hero Section */}
          <OmniverseHero />
          
          {/* Isabella AI Core */}
          <IsabellaCorePanel />
          
          {/* 7 Federated Layers */}
          <FederatedLayersDisplay />
          
          {/* Guardians & Radars */}
          <GuardiansCluster />
          
          {/* 22 Security Layers */}
          <SecurityLayersGrid />
          
          {/* MSR Blockchain & EOCT */}
          <BlockchainMSRPanel />
        </div>
      </main>
    </div>
  );
}
