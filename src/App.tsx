import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AIChat from "./pages/AIChat";
import Codex from "./pages/Codex";
import Nexus from "./pages/Nexus";
import Profile from "./pages/Profile";
import Store from "./pages/Store";
import Gallery from "./pages/Gallery";
import SocialHub from "./pages/SocialHub";
import Artworks from "./pages/Artworks";
import SystemMetrics from "./pages/SystemMetrics";
import Inventory from "./pages/Inventory";
import Marketplace from "./pages/Marketplace";
import IdNvida from "./pages/IdNvida";
import Privacy from "./pages/Privacy";
import Guardians from "./pages/Guardians";
import EmotionalDiary from "./pages/EmotionalDiary";
import University from "./pages/University";
import DAO from "./pages/DAO";
import Lottery from "./pages/Lottery";
import Cells from "./pages/Cells";
import Forks from "./pages/Forks";
import DreamSpaces from "./pages/DreamSpaces";
import Credits from "./pages/Credits";
import Music from "./pages/Music";
import Lives from "./pages/Lives";
import Groups from "./pages/Groups";
import DevHub from "./pages/DevHub";
import Federation from "./pages/Federation";
import Courses from "./pages/Courses";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-chat"
              element={
                <ProtectedRoute>
                  <AIChat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/isabella"
              element={
                <ProtectedRoute>
                  <AIChat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/codex"
              element={
                <ProtectedRoute>
                  <Codex />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nexus"
              element={
                <ProtectedRoute>
                  <Nexus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store"
              element={
                <ProtectedRoute>
                  <Store />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gallery"
              element={
                <ProtectedRoute>
                  <Gallery />
                </ProtectedRoute>
              }
            />
            <Route
              path="/social"
              element={
                <ProtectedRoute>
                  <SocialHub />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <Inventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketplace"
              element={
                <ProtectedRoute>
                  <Marketplace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/id-nvida"
              element={
                <ProtectedRoute>
                  <IdNvida />
                </ProtectedRoute>
              }
            />
            <Route
              path="/privacy"
              element={
                <ProtectedRoute>
                  <Privacy />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guardians"
              element={
                <ProtectedRoute>
                  <Guardians />
                </ProtectedRoute>
              }
            />
            <Route
              path="/emotional-diary"
              element={
                <ProtectedRoute>
                  <EmotionalDiary />
                </ProtectedRoute>
              }
            />
            <Route path="/university" element={<ProtectedRoute><University /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><University /></ProtectedRoute>} />
            <Route path="/dao" element={<ProtectedRoute><DAO /></ProtectedRoute>} />
            <Route path="/lottery" element={<ProtectedRoute><Lottery /></ProtectedRoute>} />
            <Route path="/cells" element={<ProtectedRoute><Cells /></ProtectedRoute>} />
            <Route path="/forks" element={<ProtectedRoute><Forks /></ProtectedRoute>} />
            <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
            <Route path="/devhub" element={<DevHub />} />
            <Route path="/dreamspaces" element={<ProtectedRoute><DreamSpaces /></ProtectedRoute>} />
            <Route path="/credits" element={<ProtectedRoute><Credits /></ProtectedRoute>} />
              <Route path="/music" element={<ProtectedRoute><Music /></ProtectedRoute>} />
              <Route path="/lives" element={<ProtectedRoute><Lives /></ProtectedRoute>} />
              <Route path="/artworks" element={<Artworks />} />
              <Route path="/metrics" element={<ProtectedRoute><SystemMetrics /></ProtectedRoute>} />
              <Route path="/federation" element={<ProtectedRoute><Federation /></ProtectedRoute>} />
              <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
