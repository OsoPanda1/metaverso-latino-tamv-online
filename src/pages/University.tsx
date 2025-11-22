import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, GraduationCap, Award, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import universityImg from "@/assets/university-campus.jpg";

interface Course {
  id: string;
  name: string;
  description: string | null;
  entity_type: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  properties: any;
}

const University = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchCourses();
      fetchEnrollments();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("nexus_entities")
        .select("*")
        .eq("entity_type", "course")
        .eq("is_active", true);

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      toast.error("Error al cargar cursos");
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from("entity_relationships")
        .select("target_entity_id")
        .eq("source_entity_id", user?.id)
        .eq("relationship_type", "enrolled");

      if (error) throw error;
      setEnrolledCourses((data || []).map(r => r.target_entity_id));
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      toast.error("Debes iniciar sesión para inscribirte");
      return;
    }

    try {
      const { error } = await supabase.from("entity_relationships").insert({
        source_entity_id: user.id,
        target_entity_id: courseId,
        relationship_type: "enrolled",
        metadata: { enrolled_at: new Date().toISOString() }
      });

      if (error) throw error;
      toast.success("¡Inscrito exitosamente al curso!");
      fetchEnrollments();
    } catch (error: any) {
      toast.error("Error al inscribirse al curso");
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div 
        className="relative h-[400px] bg-cover bg-center"
        style={{ backgroundImage: `url(${universityImg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-gradient mb-4 animate-fade-in">
            Universidad TAMV
          </h1>
          <p className="text-xl text-foreground/90 max-w-2xl animate-fade-in">
            Educación certificada, profesionalización y cursos exclusivos para el ecosistema digital
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-2xl font-bold">{courses.length}</h3>
              <p className="text-muted-foreground">Cursos Activos</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <GraduationCap className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-2xl font-bold">{enrolledCourses.length}</h3>
              <p className="text-muted-foreground">Tus Inscripciones</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Award className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-2xl font-bold">100%</h3>
              <p className="text-muted-foreground">Certificados</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-2xl font-bold">10K+</h3>
              <p className="text-muted-foreground">Estudiantes</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Cursos Disponibles</h2>
          <p className="text-muted-foreground">Educación de calidad para el futuro digital</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : courses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay cursos disponibles</h3>
              <p className="text-muted-foreground">Pronto agregaremos nuevos cursos</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span>{course.name}</span>
                    <Badge variant={enrolledCourses.includes(course.id) ? "default" : "outline"}>
                      {course.properties?.level || "Básico"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-muted-foreground" />
                      <span>{course.properties?.instructor || "Instructor TAMV"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{course.properties?.duration || "8 semanas"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{course.properties?.enrolled || 0} estudiantes</span>
                    </div>
                  </div>

                  {enrolledCourses.includes(course.id) ? (
                    <Button className="w-full" variant="secondary">
                      Inscrito ✓
                    </Button>
                  ) : (
                    <Button 
                      className="w-full glow-cyan hover-scale"
                      onClick={() => handleEnroll(course.id)}
                    >
                      Inscribirse Ahora
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default University;
