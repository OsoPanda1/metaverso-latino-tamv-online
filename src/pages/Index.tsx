import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { MatrixBackground } from "@/components/MatrixBackground";
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
        <MatrixBackground />

        {/* 4 Floating Retractable Toolbars */}
        <FloatingToolbar position="left" items={leftToolbarItems} accentColor="primary" />
        <FloatingToolbar position="right" items={rightToolbarItems} accentColor="secondary" />
        <FloatingToolbar position="top" items={topToolbarItems} accentColor="accent" />
        <FloatingToolbar position="bottom" items={bottomToolbarItems} accentColor="destructive" />

        {/* Main Content */}
        <main className="relative z-10 pt-24 pb-20 px-4 md:px-8">
          <div className="container mx-auto max-w-7xl space-y-16">
            {/* Video Hero Principal */}
            <VideoHero 
              title="TAMV ONLINE"
              subtitle="El Metaverso Latinoamericano - Civilización Digital Cuántica con Isabella IA NextGen™"
            />

            {/* DreamSpaces - 2 filas de 5 videos */}
            <DreamSpacesGrid />

            {/* 4 Columnas: Grupos, Canales, Lives, Tendencias & Hashtags */}
            <FourColumnsSection />

            {/* Puentes Oníricos: Conciertos, Galería, Música */}
            <OniricBridgesSection />
          </div>
        </main>

        {/* Footer gradient */}
        <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-0" />
      </div>
  );
};

export default Index;