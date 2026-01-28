import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { MatrixBackground } from "@/components/MatrixBackground";
import { IsabellaHeroBanner } from "@/components/home/IsabellaHeroBanner";
import { DreamSpacesGrid } from "@/components/home/DreamSpacesGrid";
import { FourColumnsSection } from "@/components/home/FourColumnsSection";
import { OniricBridgesSection } from "@/components/home/OniricBridgesSection";
import { OmniverseDashboard } from "@/components/home/OmniverseDashboard";
import { ImmortalCoreSecurityDashboard } from "@/components/security/ImmortalCoreSecurityDashboard";
import { DreamSpacesVisualizer } from "@/components/dreamworld/DreamSpacesVisualizer";
import { 
  FloatingToolbar, 
  leftToolbarItems, 
  rightToolbarItems, 
  topToolbarItems, 
  bottomToolbarItems 
} from "@/components/home/FloatingToolbar";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <Navigation />
      <MatrixBackground />

      {/* 4 Floating Toolbars */}
      <FloatingToolbar position="left" items={leftToolbarItems} accentColor="primary" />
      <FloatingToolbar position="right" items={rightToolbarItems} accentColor="secondary" />
      <FloatingToolbar position="top" items={topToolbarItems} accentColor="accent" />
      <FloatingToolbar position="bottom" items={bottomToolbarItems} accentColor="destructive" />

      {/* Main Content */}
      <main className="relative z-10 pt-20 pb-16 px-3 md:px-6">
        <div className="max-w-[1800px] mx-auto space-y-12">
          {/* Isabella Hero Banner - Transcendental 7th Gen */}
          <IsabellaHeroBanner />

          {/* Omniverse Dashboard - 7 Federated Layers */}
          <OmniverseDashboard />

          {/* Immortal Core Security - 30 Layers */}
          <ImmortalCoreSecurityDashboard />

          {/* DreamWorld - 8 DreamSpaces */}
          <DreamSpacesVisualizer />

          {/* DreamSpaces Grid */}
          <DreamSpacesGrid />

          {/* 4 Columns: Groups, Channels, Lives, Trends */}
          <FourColumnsSection />

          {/* Oniric Bridges: Concerts, Gallery, Music */}
          <OniricBridgesSection />
        </div>
      </main>

      {/* Footer gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-0" />
    </div>
  );
};

export default Index;
