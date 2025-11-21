import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Listing {
  id: string;
  seller_id: string;
  price: number;
  currency: string;
  status: string;
  created_at: string;
  digital_assets: {
    id: string;
    name: string;
    asset_type: string;
    file_url: string | null;
    metadata: any;
  };
}

const Marketplace = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
    
    const channel = supabase
      .channel('marketplace-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'marketplace_listings'
      }, () => {
        fetchListings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from("marketplace_listings")
        .select(`
          *,
          digital_assets (
            id,
            name,
            asset_type,
            file_url,
            metadata
          )
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error: any) {
      console.error("Error fetching listings:", error);
      toast.error("Error al cargar marketplace");
    } finally {
      setLoading(false);
    }
  };

  const purchaseAsset = async (listing: Listing) => {
    if (!user) {
      toast.error("Debes iniciar sesión para comprar");
      return;
    }

    if (listing.seller_id === user.id) {
      toast.error("No puedes comprar tu propio listing");
      return;
    }

    try {
      // Add to inventory
      const { error: inventoryError } = await supabase
        .from("digital_inventory")
        .insert({
          user_id: user.id,
          asset_id: listing.digital_assets.id,
          quantity: 1,
          metadata: { purchase_price: listing.price, purchase_date: new Date().toISOString() }
        });

      if (inventoryError) throw inventoryError;

      // Mark listing as sold
      const { error: listingError } = await supabase
        .from("marketplace_listings")
        .update({ status: "sold" })
        .eq("id", listing.id);

      if (listingError) throw listingError;

      // Log transaction
      await supabase.from("transactional_metadata").insert({
        user_id: user.id,
        transaction_type: "marketplace_purchase",
        payload: {
          listing_id: listing.id,
          asset_id: listing.digital_assets.id,
          price: listing.price,
          seller_id: listing.seller_id
        }
      });

      toast.success("¡Compra exitosa! Revisa tu inventario");
      fetchListings();
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast.error("Error al realizar compra");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-6xl animate-fade-in">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-2 flex items-center gap-3">
              <ShoppingCart className="w-10 h-10" />
              Marketplace Nexus
            </h1>
            <p className="text-muted-foreground">Descubre y adquiere activos digitales únicos</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : listings.length === 0 ? (
            <Card className="text-center py-12 glow-border">
              <CardContent>
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No hay listings activos</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Card key={listing.id} className="glow-border hover-scale overflow-hidden">
                  {listing.digital_assets.file_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={listing.digital_assets.file_url} 
                        alt={listing.digital_assets.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-background/80">
                          {listing.digital_assets.asset_type}
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="text-gradient">{listing.digital_assets.name}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        {listing.price} <span className="text-sm">{listing.currency}</span>
                      </span>
                    </div>

                    <Button 
                      onClick={() => purchaseAsset(listing)}
                      className="w-full glow-cyan hover-scale"
                      disabled={listing.seller_id === user?.id}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {listing.seller_id === user?.id ? "Tu Listing" : "Comprar Ahora"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Publicado {new Date(listing.created_at).toLocaleDateString()}
                    </p>
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

export default Marketplace;