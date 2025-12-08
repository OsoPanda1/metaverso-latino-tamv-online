import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { GlobeBackground } from "@/components/home/GlobeBackground";
import { VideoHero } from "@/components/home/VideoHero";
import { DreamSpacesGrid } from "@/components/home/DreamSpacesGrid";
import { FourColumnsSection } from "@/components/home/FourColumnsSection";
import { OniricBridgesSection } from "@/components/home/OniricBridgesSection";
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
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      <GlobeBackground />

      {/* Floating Toolbars */}
      <FloatingToolbar position="left" items={leftToolbarItems} accentColor="primary" />
      <FloatingToolbar position="right" items={rightToolbarItems} accentColor="secondary" />
      <FloatingToolbar position="bottom" items={bottomToolbarItems} accentColor="accent" />

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-20 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl space-y-16">
          {/* Video Hero */}
          <VideoHero 
            title="TAMV ONLINE"
            subtitle="El Metaverso Latinoamericano - Civilización Digital Cuántica"
          />

          {/* DreamSpaces - 2 rows of 5 videos */}
          <DreamSpacesGrid />

          {/* 4 Columns: Groups, Channels, Lives, Trends */}
          <FourColumnsSection />

          {/* Puentes Oníricos: Concerts, Gallery, Music */}
          <OniricBridgesSection />
        </div>
      </main>
    </div>
  );
};

export default Index;
