import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Circle, Activity } from "lucide-react";

interface Cell {
  id: string;
  name: string;
  cell_type: string;
  purpose: string;
  emotional_vector: any;
  is_active: boolean;
  created_at: string;
}

export default function Cells() {
  const { user } = useAuth();
  const [cells, setCells] = useState<Cell[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCell, setNewCell] = useState({
    name: "",
    cell_type: "personal",
    purpose: "",
  });

  useEffect(() => {
    if (user) {
      fetchCells();
    }
  }, [user]);

  const fetchCells = async () => {
    try {
      const { data, error } = await supabase
        .from("cells")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCells(data || []);
    } catch (error: any) {
      toast.error("Error loading cells: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createCell = async () => {
    if (!newCell.name || !newCell.purpose) {
      toast.error("Name and purpose are required");
      return;
    }

    try {
      const { error } = await supabase.from("cells").insert({
        user_id: user?.id,
        name: newCell.name,
        cell_type: newCell.cell_type,
        purpose: newCell.purpose,
        emotional_vector: [0.5, 0.5, 0.5],
        is_active: true,
      });

      if (error) throw error;
      
      toast.success("Cell created successfully!");
      setIsCreateOpen(false);
      setNewCell({ name: "", cell_type: "personal", purpose: "" });
      fetchCells();
    } catch (error: any) {
      toast.error("Error creating cell: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Activity className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Cells™ Autónomas Cuánticas</h1>
            <p className="text-muted-foreground">Manage your autonomous computational cells</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" /> Create Cell
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Cell</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input
                  placeholder="Cell Name"
                  value={newCell.name}
                  onChange={(e) => setNewCell({ ...newCell, name: e.target.value })}
                />
                <Select
                  value={newCell.cell_type}
                  onValueChange={(value) => setNewCell({ ...newCell, cell_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Purpose and goals..."
                  value={newCell.purpose}
                  onChange={(e) => setNewCell({ ...newCell, purpose: e.target.value })}
                  rows={4}
                />
                <Button onClick={createCell} className="w-full">Create Cell</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cells.map((cell) => (
            <Card key={cell.id} className="hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Circle className={`h-3 w-3 ${cell.is_active ? "fill-green-500 text-green-500" : "fill-gray-500 text-gray-500"}`} />
                  <span className="text-xs text-muted-foreground">{cell.cell_type}</span>
                </div>
                <CardTitle>{cell.name}</CardTitle>
                <CardDescription>
                  {new Date(cell.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{cell.purpose}</p>
                <div className="space-y-2">
                  <div className="text-xs">
                    <span className="text-muted-foreground">Emotional Vector:</span>
                    <div className="flex gap-1 mt-1">
                      {(cell.emotional_vector || [0.5, 0.5, 0.5]).map((val, idx) => (
                        <div
                          key={idx}
                          className="h-2 bg-primary rounded-full"
                          style={{ width: `${val * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {cells.length === 0 && (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Circle className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Cells Yet</h3>
              <p className="text-muted-foreground mb-4">Create your first Cell to begin</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create First Cell
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}