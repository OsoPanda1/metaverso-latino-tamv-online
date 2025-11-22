import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Radio, Users, Clock, Gift } from "lucide-react";

interface LiveStream {
  id: string;
  title: string;
  description: string;
  status: string;
  viewer_count: number;
  max_viewers: number;
  total_earnings: number;
  scheduled_start: string;
  started_at: string;
}

export default function Lives() {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreams();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel("live_streams_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_streams",
        },
        () => {
          fetchStreams();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStreams = async () => {
    try {
      const { data, error } = await supabase
        .from("live_streams")
        .select("*")
        .in("status", ["live", "scheduled"])
        .order("started_at", { ascending: false, nullsFirst: false });

      if (error) throw error;
      setStreams(data || []);
    } catch (error: any) {
      toast.error("Error loading streams: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500 text-white";
      case "scheduled":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">TAMV Live™</h1>
          <p className="text-muted-foreground">Live streaming with XR support and monetization</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {streams.map((stream) => (
            <Card key={stream.id} className="hover:border-primary transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Radio className={`h-5 w-5 ${stream.status === "live" ? "text-red-500 animate-pulse" : "text-muted-foreground"}`} />
                  <Badge className={getStatusColor(stream.status)}>
                    {stream.status.toUpperCase()}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2">{stream.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {stream.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {stream.description}
                  </p>
                )}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{stream.viewer_count} viewing</span>
                  </div>
                  {stream.status === "scheduled" && stream.scheduled_start && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(stream.scheduled_start).toLocaleString()}</span>
                    </div>
                  )}
                  {stream.total_earnings > 0 && (
                    <div className="flex items-center gap-2 text-sm text-primary font-semibold">
                      <Gift className="h-4 w-4" />
                      <span>{stream.total_earnings.toFixed(2)} TC earned</span>
                    </div>
                  )}
                </div>
                <Button className="w-full" disabled={stream.status !== "live"}>
                  {stream.status === "live" ? "Watch Now" : "Scheduled"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {streams.length === 0 && !loading && (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Radio className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Live Streams</h3>
              <p className="text-muted-foreground">Check back later for live content</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}