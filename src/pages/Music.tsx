import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Music as MusicIcon, Play, Pause, Download, Heart } from "lucide-react";

interface Track {
  id: string;
  title: string;
  description: string;
  artist_id: string;
  audio_url: string;
  cover_image_url: string;
  duration_seconds: number;
  genre: string;
  price_credits: number;
  play_count: number;
  is_public: boolean;
}

export default function Music() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const { data, error } = await supabase
        .from("music_tracks")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTracks(data || []);
    } catch (error: any) {
      toast.error("Error loading tracks: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = (trackId: string) => {
    setPlaying(playing === trackId ? null : trackId);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">TAMV Music™</h1>
          <p className="text-muted-foreground">Discover and share music with emotional classification</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <Card key={track.id} className="hover:border-primary transition-all hover:shadow-lg overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                {track.cover_image_url ? (
                  <img
                    src={track.cover_image_url}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MusicIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <Button
                  size="icon"
                  className="absolute bottom-4 right-4 rounded-full"
                  onClick={() => togglePlay(track.id)}
                >
                  {playing === track.id ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  {track.genre && <Badge variant="outline">{track.genre}</Badge>}
                  <span className="text-sm text-muted-foreground">{track.play_count} plays</span>
                </div>
                <CardTitle className="line-clamp-1">{track.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {track.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {track.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {track.price_credits === 0 ? "FREE" : `${track.price_credits} TC`}
                  </span>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tracks.length === 0 && !loading && (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <MusicIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Tracks Available Yet</h3>
              <p className="text-muted-foreground">Check back soon for new music</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}