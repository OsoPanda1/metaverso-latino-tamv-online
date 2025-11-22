import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, LayoutDashboard, Sparkles, MessageCircle, Network, Store, Image, Users, Package, ShoppingCart, Shield, Lock, AlertTriangle, BookHeart, GraduationCap, Vote, Trophy, Circle, GitFork, Globe, Coins, Music as MusicIcon, Radio } from "lucide-react";

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Sparkles className="w-6 h-6 text-primary animate-pulse-glow" />
          <span className="text-xl font-bold text-gradient story-link">TAMV Nexus</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="text-foreground hover:text-primary hover-scale"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate("/ai-chat")}
                className="text-foreground hover:text-primary hover-scale"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Isabella
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-primary/50 hover-scale">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Nexus
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/nexus")}>
                    <Network className="w-4 h-4 mr-2" />
                    Entities
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/inventory")}>
                    <Package className="w-4 h-4 mr-2" />
                    Inventory
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/marketplace")}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Marketplace
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/store")}>
                    <Store className="w-4 h-4 mr-2" />
                    Digital Store
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/gallery")}>
                    <Image className="w-4 h-4 mr-2" />
                    Art Gallery
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/social")}>
                    <Users className="w-4 h-4 mr-2" />
                    Social Hub
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/cells")}>
                    <Circle className="w-4 h-4 mr-2" />
                    Cells™
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/forks")}>
                    <GitFork className="w-4 h-4 mr-2" />
                    Forks™
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dreamspaces")}>
                    <Globe className="w-4 h-4 mr-2" />
                    DreamSpaces™
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/university")}>
                    <GraduationCap className="w-4 h-4 mr-2" />
                    University
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dao")}>
                    <Vote className="w-4 h-4 mr-2" />
                    DAO
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/lottery")}>
                    <Trophy className="w-4 h-4 mr-2" />
                    Lottery
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/credits")}>
                    <Coins className="w-4 h-4 mr-2" />
                    Credits
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/music")}>
                    <MusicIcon className="w-4 h-4 mr-2" />
                    Music
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/lives")}>
                    <Radio className="w-4 h-4 mr-2" />
                    Lives
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full border-primary/50 hover-scale">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/id-nvida")}>
                    <Shield className="w-4 h-4 mr-2" />
                    ID-NVIDA™
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/privacy")}>
                    <Lock className="w-4 h-4 mr-2" />
                    Privacy Panel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/guardians")}>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Guardians
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/emotional-diary")}>
                    <BookHeart className="w-4 h-4 mr-2" />
                    Emotional Diary
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={() => navigate("/auth")} className="glow-cyan hover-scale">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
