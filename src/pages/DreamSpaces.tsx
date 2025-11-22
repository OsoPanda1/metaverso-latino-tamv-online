import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Users, Globe, Lock, Music, Palette, GraduationCap, ShoppingBag } from "lucide-react";

interface DreamSpace {
  id: string;
  name: string;
  description: string;
  space_type: string;
  is_public: boolean;
  max_capacity: number;
  price_credits: number;
  created_at: string;
  user_id: string;
}

const spaceTypeIcons: Record<string, any> = {
  concert: Music,
  gallery: Palette,
  educational: GraduationCap,
  commercial: ShoppingBag,
  social: Users,
};

export default function DreamSpaces() {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState<DreamSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSpace, setNewSpace] = useState({
    name: "",
    description: "",
    space_type: "social",
    is_public: true,
    max_capacity: 50,
    price_credits: 0,
  });

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      const { data, error } = await supabase
        .from("dreamspaces")
        .select("*")
        .or(`is_public.eq.true,user_id.eq.${user?.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSpaces(data || []);
    } catch (error: any) {
      toast.error("Error loading DreamSpaces: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createSpace = async () => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    if (!newSpace.name) {
      toast.error("Name is required");
      return;
    }

    try {
      const { error } = await supabase.from("dreamspaces").insert({
        user_id: user.id,
        ...newSpace,
        emotional_atmosphere: { mood: "neutral", intensity: 0.5 },
      });

      if (error) throw error;
      
      toast.success("DreamSpace created successfully!");
      setIsCreateOpen(false);
      setNewSpace({
        name: "",
        description: "",
        space_type: "social",
        is_public: true,
        max_capacity: 50,
        price_credits: 0,
      });
      fetchSpaces();
    } catch (error: any) {
      toast.error("Error creating DreamSpace: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">DreamSpaces™ XR</h1>
            <p className="text-muted-foreground">Multisensorial XR environments</p>
          </div>
          {user && (
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="mr-2 h-4 w-4" /> Create DreamSpace
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New DreamSpace</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input
                    placeholder="DreamSpace Name"
                    value={newSpace.name}
                    onChange={(e) => setNewSpace({ ...newSpace, name: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description..."
                    value={newSpace.description}
                    onChange={(e) => setNewSpace({ ...newSpace, description: e.target.value })}
                    rows={3}
                  />
                  <Select
                    value={newSpace.space_type}
                    onValueChange={(value) => setNewSpace({ ...newSpace, space_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="concert">Concert</SelectItem>
                      <SelectItem value="gallery">Gallery</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSpace.is_public}
                        onChange={(e) => setNewSpace({ ...newSpace, is_public: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Public Space</span>
                    </label>
                  </div>
                  <Input
                    type="number"
                    placeholder="Max Capacity"
                    value={newSpace.max_capacity}
                    onChange={(e) => setNewSpace({ ...newSpace, max_capacity: parseInt(e.target.value) })}
                  />
                  <Button onClick={createSpace} className="w-full">Create DreamSpace</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => {
            const Icon = spaceTypeIcons[space.space_type] || Users;
            return (
              <Card key={space.id} className="hover:border-primary transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="h-6 w-6 text-primary" />
                    <div className="flex gap-2">
                      {space.is_public ? (
                        <Badge variant="outline"><Globe className="h-3 w-3 mr-1" />Public</Badge>
                      ) : (
                        <Badge variant="outline"><Lock className="h-3 w-3 mr-1" />Private</Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle>{space.name}</CardTitle>
                  <CardDescription>{space.space_type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{space.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span><Users className="h-3 w-3 inline mr-1" />{space.max_capacity} max</span>
                    {space.price_credits > 0 && (
                      <span className="font-semibold">{space.price_credits} TC</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {spaces.length === 0 && (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Globe className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No DreamSpaces Yet</h3>
              <p className="text-muted-foreground mb-4">Create your first XR environment</p>
              {user && (
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create First DreamSpace
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}