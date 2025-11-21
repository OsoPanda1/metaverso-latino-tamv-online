import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Package, Lock, Unlock, Trash2, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InventoryItem {
  id: string;
  asset_id: string;
  quantity: number;
  acquired_at: string;
  is_locked: boolean;
  metadata: any;
  digital_assets: {
    name: string;
    asset_type: string;
    file_url: string | null;
    metadata: any;
  };
}

const Inventory = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [listingPrice, setListingPrice] = useState("");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    if (user) {
      fetchInventory();
      
      const channel = supabase
        .channel('inventory-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'digital_inventory',
          filter: `user_id=eq.${user.id}`
        }, () => {
          fetchInventory();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchInventory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("digital_inventory")
        .select(`
          *,
          digital_assets (
            name,
            asset_type,
            file_url,
            metadata
          )
        `)
        .eq("user_id", user.id)
        .order("acquired_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      console.error("Error fetching inventory:", error);
      toast.error("Error al cargar inventario");
    } finally {
      setLoading(false);
    }
  };

  const toggleLock = async (itemId: string, currentLockState: boolean) => {
    try {
      const { error } = await supabase
        .from("digital_inventory")
        .update({ is_locked: !currentLockState })
        .eq("id", itemId);

      if (error) throw error;
      toast.success(currentLockState ? "Item desbloqueado" : "Item bloqueado");
      fetchInventory();
    } catch (error: any) {
      toast.error("Error al cambiar estado de bloqueo");
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("digital_inventory")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      toast.success("Item eliminado del inventario");
      fetchInventory();
    } catch (error: any) {
      toast.error("Error al eliminar item");
    }
  };

  const createListing = async () => {
    if (!selectedItem || !listingPrice) return;

    try {
      const { error } = await supabase
        .from("marketplace_listings")
        .insert({
          seller_id: user!.id,
          asset_id: selectedItem.asset_id,
          price: parseFloat(listingPrice),
          currency: "NEXUS_TOKEN",
          status: "active"
        });

      if (error) throw error;
      toast.success("Listing creado exitosamente");
      setListingPrice("");
      setSelectedItem(null);
    } catch (error: any) {
      toast.error("Error al crear listing");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-6xl animate-fade-in">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-2">Inventario Digital</h1>
            <p className="text-muted-foreground">Gestiona tus activos digitales del Nexus</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <Card className="text-center py-12 glow-border">
              <CardContent>
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Tu inventario está vacío</p>
                <p className="text-sm text-muted-foreground mt-2">Adquiere activos en el marketplace</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <Card key={item.id} className="glow-border hover-scale">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-gradient">{item.digital_assets.name}</span>
                      {item.is_locked && <Lock className="w-4 h-4 text-yellow-500" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {item.digital_assets.file_url && (
                      <img 
                        src={item.digital_assets.file_url} 
                        alt={item.digital_assets.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                    
                    <div className="text-sm space-y-1">
                      <p><span className="text-muted-foreground">Tipo:</span> {item.digital_assets.asset_type}</p>
                      <p><span className="text-muted-foreground">Cantidad:</span> {item.quantity}</p>
                      <p><span className="text-muted-foreground">Adquirido:</span> {new Date(item.acquired_at).toLocaleDateString()}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toggleLock(item.id, item.is_locked)}
                        className="flex-1"
                      >
                        {item.is_locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedItem(item)}
                            disabled={item.is_locked}
                            className="flex-1"
                          >
                            <DollarSign className="w-4 h-4 mr-1" />
                            Vender
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Crear Listing</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Precio (NEXUS_TOKEN)</Label>
                              <Input 
                                type="number"
                                value={listingPrice}
                                onChange={(e) => setListingPrice(e.target.value)}
                                placeholder="100.00"
                              />
                            </div>
                            <Button onClick={createListing} className="w-full">
                              Crear Listing
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => deleteItem(item.id)}
                        disabled={item.is_locked}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

export default Inventory;