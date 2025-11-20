import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Network, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface NexusEntity {
  id: string;
  name: string;
  entity_type: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

const Nexus = () => {
  const { user } = useAuth();
  const [entities, setEntities] = useState<NexusEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    entity_type: 'avatar',
    description: '',
  });

  const fetchEntities = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('nexus_entities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load entities');
      console.error(error);
    } else {
      setEntities(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntities();

    // Set up realtime subscription
    const channel = supabase
      .channel('nexus_entities_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nexus_entities',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchEntities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleCreate = async () => {
    if (!user || !formData.name) return;

    const { error } = await supabase.from('nexus_entities').insert({
      user_id: user.id,
      name: formData.name,
      entity_type: formData.entity_type,
      description: formData.description || null,
    });

    if (error) {
      toast.error('Failed to create entity');
      console.error(error);
    } else {
      toast.success('Entity created successfully');
      setDialogOpen(false);
      setFormData({ name: '', entity_type: 'avatar', description: '' });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('nexus_entities').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete entity');
    } else {
      toast.success('Entity deleted');
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2">Nexus Entities</h1>
              <p className="text-muted-foreground">Manage your digital entities</p>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="glow-cyan">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Entity
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Entity</DialogTitle>
                  <DialogDescription>
                    Add a new entity to your digital nexus
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="My Avatar"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.entity_type}
                      onValueChange={(value) => setFormData({ ...formData, entity_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="avatar">Avatar</SelectItem>
                        <SelectItem value="space">Space</SelectItem>
                        <SelectItem value="asset">Asset</SelectItem>
                        <SelectItem value="bot">Bot</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your entity..."
                    />
                  </div>
                  <Button onClick={handleCreate} className="w-full glow-cyan">
                    Create Entity
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : entities.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="text-center py-12">
                <Network className="w-16 h-16 mx-auto mb-4 text-primary opacity-50" />
                <p className="text-muted-foreground mb-4">No entities yet</p>
                <Button onClick={() => setDialogOpen(true)} className="glow-cyan">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Entity
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entities.map((entity) => (
                <Card
                  key={entity.id}
                  className="border-border/50 hover:border-primary/50 transition-all glow-cyan group"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{entity.name}</CardTitle>
                        <CardDescription className="capitalize">
                          {entity.entity_type}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(entity.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {entity.description || 'No description'}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          entity.is_active ? 'bg-green-500' : 'bg-gray-500'
                        }`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {entity.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nexus;
