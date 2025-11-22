import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { GraduationCap, Clock, Users, Award } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  price_credits: number;
  duration_hours: number;
  enrollment_count: number;
  rating_average: number;
  is_published: boolean;
  instructor_id: string;
}

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      toast.error("Error loading courses: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user) {
      toast.error("You must be logged in to enroll");
      return;
    }

    try {
      const { error } = await supabase.from("course_enrollments").insert({
        course_id: courseId,
        user_id: user.id,
      });

      if (error) throw error;
      toast.success("Enrolled successfully!");
    } catch (error: any) {
      if (error.message.includes("duplicate key")) {
        toast.info("You are already enrolled in this course");
      } else {
        toast.error("Error enrolling: " + error.message);
      }
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-500/10 text-green-500";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-500";
      case "advanced":
        return "bg-red-500/10 text-red-500";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Universidad TAMV™</h1>
          <p className="text-muted-foreground">Free education, certified studies, professional development</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:border-primary transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <Badge className={getDifficultyColor(course.difficulty_level)}>
                    {course.difficulty_level}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration_hours} hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{course.enrollment_count} enrolled</span>
                  </div>
                  {course.rating_average && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="h-4 w-4" />
                      <span>{course.rating_average.toFixed(1)} rating</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {course.price_credits === 0 ? "FREE" : `${course.price_credits} TC`}
                  </span>
                  <Button onClick={() => enrollInCourse(course.id)} size="sm">
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {courses.length === 0 && !loading && (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <GraduationCap className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Courses Available Yet</h3>
              <p className="text-muted-foreground">Check back soon for new courses</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}