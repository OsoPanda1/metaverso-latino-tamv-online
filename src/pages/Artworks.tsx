import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { MatrixBackground } from '@/components/MatrixBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Heart, Eye, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface Artwork {
  id: string;
  title: string;
  description: string;
  image_url: string;
  price: number;
  currency: string;
  views_count: number;
  likes_count: number;
  tags: string[];
  artist: {
    bio: string;
    reputation_score: number;
  };
}

export default function Artworks() {
  const { user } = useAuth();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    fetchArtworks();
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  const fetchArtworks = async () => {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*, artist:artists(bio, reputation_score)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setArtworks(data || []);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      toast.error('Failed to load artworks');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ml-recommendations');
      if (error) throw error;
      setRecommendations(data.recommendations.map((r: any) => r.artwork_id));
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleLike = async (artworkId: string) => {
    if (!user) {
      toast.error('Please login to like artworks');
      return;
    }

    try {
      await supabase.from('user_interactions').insert({
        user_id: user.id,
        artwork_id: artworkId,
        interaction_type: 'like'
      });

      // Get current likes count and increment
      const { data: artwork } = await supabase
        .from('artworks')
        .select('likes_count')
        .eq('id', artworkId)
        .single();

      if (artwork) {
        await supabase.from('artworks')
          .update({ likes_count: (artwork.likes_count || 0) + 1 })
          .eq('id', artworkId);
      }

      toast.success('Artwork liked!');
      fetchArtworks();
    } catch (error) {
      console.error('Error liking artwork:', error);
    }
  };

  const isRecommended = (artworkId: string) => recommendations.includes(artworkId);

  return (
    <>
      <MatrixBackground />
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Arte Digital TAMV</h1>
          <p className="text-muted-foreground">Explora obras certificadas con NFT y tecnología blockchain</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="animate-pulse">
                <div className="h-64 bg-muted" />
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map(artwork => (
              <Card key={artwork.id} className="group hover:shadow-xl transition-all duration-300 border-primary/20">
                {isRecommended(artwork.id) && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-primary">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Recomendado
                    </Badge>
                  </div>
                )}
                
                <div className="relative overflow-hidden h-64">
                  <img 
                    src={artwork.image_url || '/placeholder.svg'} 
                    alt={artwork.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {artwork.title}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleLike(artwork.id)}
                      className="hover:text-primary"
                    >
                      <Heart className="w-5 h-5" />
                    </Button>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{artwork.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {artwork.tags?.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" /> {artwork.views_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" /> {artwork.likes_count}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        ${artwork.price} <span className="text-sm text-muted-foreground">{artwork.currency}</span>
                      </div>
                    </div>
                    <Button className="bg-gradient-primary">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Comprar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
