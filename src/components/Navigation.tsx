import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Menu, X, Brain, Home, Sparkles, Network, User, LogOut, 
  ShoppingBag, Image, Users, Wallet, Shield, BookOpen, 
  GraduationCap, Vote, Ticket, Layers, GitFork, Music, 
  Video, Gamepad2, Code, LayoutDashboard
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { path: "/", label: "Inicio", icon: Home },
  { path: "/ai-chat", label: "Isabella", icon: Brain },
  { path: "/dreamspaces", label: "DreamSpaces", icon: Gamepad2 },
  { path: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { path: "/gallery", label: "Galería", icon: Image },
  { path: "/university", label: "Universidad", icon: GraduationCap },
];

const moreItems = [
  { path: "/groups", label: "Grupos", icon: Users },
  { path: "/lives", label: "Lives", icon: Video },
  { path: "/music", label: "Música", icon: Music },
  { path: "/cells", label: "Cells", icon: Layers },
  { path: "/forks", label: "Forks", icon: GitFork },
  { path: "/dao", label: "DAO", icon: Vote },
  { path: "/lottery", label: "Lotería", icon: Ticket },
  { path: "/credits", label: "Créditos", icon: Wallet },
  { path: "/codex", label: "CODEX", icon: BookOpen },
  { path: "/guardians", label: "Guardianes", icon: Shield },
  { path: "/devhub", label: "DevHub", icon: Code },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/30 group-hover:glow-cyan transition-all">
              <Network className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-xl text-gradient hidden sm:block">TAMV</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant={isActive(item.path) ? "default" : "ghost"} 
                  size="sm"
                  className={isActive(item.path) ? "glow-cyan" : "hover:bg-primary/10"}
                >
                  <item.icon className="w-4 h-4 mr-1" />
                  {item.label}
                </Button>
              </Link>
            ))}

            {/* More dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Más
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border-border/50">
                {moreItems.map((item) => (
                  <DropdownMenuItem 
                    key={item.path} 
                    onClick={() => navigate(item.path)}
                    className="cursor-pointer"
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User section */}
          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-primary/30 hover:border-primary glow-cyan">
                    <User className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Mi Cuenta</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border-border/50">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="w-4 h-4 mr-2" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/inventory")}>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Inventario
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/id-nvida")}>
                    <Shield className="w-4 h-4 mr-2" />
                    ID-NVIDA
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate("/auth")} className="glow-cyan">
                <User className="w-4 h-4 mr-1" />
                Ingresar
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border/50 animate-in slide-in-from-top">
            <div className="grid grid-cols-2 gap-2">
              {[...navItems, ...moreItems].map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                  <Button 
                    variant={isActive(item.path) ? "default" : "ghost"} 
                    size="sm"
                    className="w-full justify-start"
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
