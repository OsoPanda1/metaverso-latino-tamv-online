import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { BookHeart, Mic, Plus, TrendingUp, Smile, Frown, Meh } from "lucide-react";
import { Navigation } from "@/components/Navigation";

interface DiaryEntry {
  id: string;
  entry_type: string;
  content: string | null;
  sentiment: string | null;
  sentiment_score: number | null;
  emotions: any;
  tags: string[];
  created_at: string;
}

const EmotionalDiary = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newEntry, setNewEntry] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("emotional_diary")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      toast.error("Error al cargar entradas");
    } finally {
      setLoading(false);
    }
  };

  const analyzeSentiment = (text: string) => {
    // Análisis simple de sentimiento basado en palabras clave
    const positiveWords = ["feliz", "alegre", "contento", "emocionado", "inspirado", "motivado", "bien"];
    const negativeWords = ["triste", "enojado", "frustrado", "ansioso", "preocupado", "mal"];
    
    const lowerText = text.toLowerCase();
    let score = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) score += 0.2;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) score -= 0.2;
    });
    
    score = Math.max(-1, Math.min(1, score));
    
    const sentiment = score > 0.2 ? "positive" : score < -0.2 ? "negative" : "neutral";
    
    return { sentiment, score };
  };

  const extractEmotions = (text: string) => {
    const emotionMap: { [key: string]: string[] } = {
      happy: ["feliz", "alegre", "contento", "emocionado"],
      sad: ["triste", "melancólico", "deprimido"],
      anxious: ["ansioso", "nervioso", "preocupado", "estresado"],
      creative: ["creativo", "inspirado", "imaginativo"],
      nostalgic: ["nostálgico", "recuerdo", "extraño"],
    };
    
    const lowerText = text.toLowerCase();
    const detectedEmotions: string[] = [];
    
    Object.entries(emotionMap).forEach(([emotion, keywords]) => {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        detectedEmotions.push(emotion);
      }
    });
    
    return detectedEmotions;
  };

  const createEntry = async () => {
    if (!newEntry.trim()) {
      toast.error("Escribe algo antes de guardar");
      return;
    }

    try {
      const { sentiment, score } = analyzeSentiment(newEntry);
      const emotions = extractEmotions(newEntry);
      
      const { error } = await supabase.from("emotional_diary").insert({
        user_id: user?.id,
        entry_type: "text",
        content: newEntry,
        sentiment,
        sentiment_score: score,
        emotions,
      });

      if (error) throw error;

      toast.success("Entrada guardada");
      setIsCreateOpen(false);
      setNewEntry("");
      fetchEntries();
    } catch (error: any) {
      toast.error("Error al guardar entrada");
    }
  };

  const getSentimentIcon = (sentiment: string | null) => {
    switch (sentiment) {
      case "positive": return <Smile className="h-5 w-5 text-green-500" />;
      case "negative": return <Frown className="h-5 w-5 text-red-500" />;
      case "neutral": return <Meh className="h-5 w-5 text-gray-500" />;
      default: return <Meh className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment: string | null) => {
    switch (sentiment) {
      case "positive": return "bg-green-500/10 text-green-500";
      case "negative": return "bg-red-500/10 text-red-500";
      case "neutral": return "bg-gray-500/10 text-gray-500";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis: { [key: string]: string } = {
      happy: "😊",
      sad: "😢",
      anxious: "😰",
      creative: "🎨",
      nostalgic: "🌅",
    };
    return emojis[emotion] || "💭";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const positiveEntries = entries.filter(e => e.sentiment === "positive").length;
  const negativeEntries = entries.filter(e => e.sentiment === "negative").length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Diario Emocional
            </h1>
            <p className="text-muted-foreground mt-2">
              Tu espacio seguro para expresarte · Análisis de sentimientos · Tendencias emocionales
            </p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva Entrada
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Entrada</DialogTitle>
                <DialogDescription>
                  Escribe o graba cómo te sientes hoy
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 pt-4">
                <Textarea
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  placeholder="¿Cómo te sientes hoy? Comparte tus pensamientos y emociones..."
                  className="min-h-[200px] resize-none"
                />

                <div className="flex gap-2">
                  <Button onClick={createEntry} className="flex-1">
                    <BookHeart className="h-4 w-4 mr-2" />
                    Guardar Entrada
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsRecording(!isRecording)}
                    className="flex-1"
                  >
                    <Mic className={`h-4 w-4 mr-2 ${isRecording ? "text-red-500" : ""}`} />
                    {isRecording ? "Grabando..." : "Grabar Voz"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Total Entradas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{entries.length}</div>
              <p className="text-sm text-muted-foreground">Registros emocionales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smile className="h-5 w-5 text-green-500" />
                Positivas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{positiveEntries}</div>
              <p className="text-sm text-muted-foreground">
                {entries.length > 0 ? `${((positiveEntries / entries.length) * 100).toFixed(0)}%` : "0%"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Frown className="h-5 w-5 text-red-500" />
                Negativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{negativeEntries}</div>
              <p className="text-sm text-muted-foreground">
                {entries.length > 0 ? `${((negativeEntries / entries.length) * 100).toFixed(0)}%` : "0%"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getSentimentIcon(entry.sentiment)}
                    <div>
                      <CardTitle className="text-sm font-normal text-muted-foreground">
                        {new Date(entry.created_at).toLocaleString("es-ES", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })}
                      </CardTitle>
                    </div>
                  </div>
                  <Badge className={getSentimentColor(entry.sentiment)}>
                    {entry.sentiment || "neutral"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-foreground whitespace-pre-wrap">{entry.content}</p>
                
                {entry.emotions && entry.emotions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.emotions.map((emotion, idx) => (
                      <Badge key={idx} variant="secondary">
                        {getEmotionEmoji(emotion)} {emotion}
                      </Badge>
                    ))}
                  </div>
                )}

                {entry.sentiment_score !== null && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Intensidad:</span>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          entry.sentiment_score > 0 ? "bg-green-500" : "bg-red-500"
                        }`}
                        style={{ width: `${Math.abs(entry.sentiment_score) * 100}%` }}
                      />
                    </div>
                    <span>{(Math.abs(entry.sentiment_score) * 100).toFixed(0)}%</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {entries.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookHeart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tu diario está vacío</h3>
              <p className="text-muted-foreground mb-4">
                Comienza a registrar tus emociones y pensamientos
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Entrada
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmotionalDiary;
