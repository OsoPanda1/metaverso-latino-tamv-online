import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  Brain,
  Book,
  Network,
  User,
  ShoppingBag,
  Palette,
  Users,
  Radio,
  Sparkles,
  GraduationCap,
  Shield,
  Home,
  LogOut,
} from "lucide-react";

/**
 * Navegación unificada con acceso a todos los módulos TAMV
 */
export const UnifiedNavigation = () => {
  const { user, signOut } = useAuth();

  const navItems = [
    { path: "/", icon: Home, label: "Inicio" },
    { path: "/ai-chat", icon: Brain, label: "Isabella IA" },
    { path: "/codex", icon: Book, label: "CODEX" },
    { path: "/nexus", icon: Network, label: "Nexus" },
    { path: "/profile", icon: User, label: "Perfil" },
    { path: "/store", icon: ShoppingBag, label: "Store" },
    { path: "/gallery", icon: Palette, label: "Galería" },
    { path: "/groups", icon: Users, label: "Grupos" },
    { path: "/lives", icon: Radio, label: "Lives" },
    { path: "/dreamspaces", icon: Sparkles, label: "DreamSpaces" },
    { path: "/university", icon: GraduationCap, label: "Universidad" },
    { path: "/guardians", icon: Shield, label: "Guardianes" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-black text-gradient-glow">TAMV</div>
            <Badge className="neon-glow">NextGen</Badge>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.slice(0, 8).map((item) => (
              <Link key={item.path} to={item.path}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user && (
              <>
                <span className="text-sm text-muted-foreground hidden md:block">
                  {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={() => signOut()} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Salir
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
