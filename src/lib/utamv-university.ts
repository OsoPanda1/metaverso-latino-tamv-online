 /**
  * UTAMV - Universidad TAMV
  * Sistema de educación digital con certificaciones blockchain
  * 
  * Proyecto TAMV DreamWorld v2.0
  * Autor: Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)
  */
 
 export interface UTAMVCourse {
   id: string;
   title: string;
   description: string;
   instructor: string;
   category: CourseCategory;
   level: CourseLevel;
   duration: number; // minutes
   price: number;
   currency: 'credits' | 'usd';
   thumbnail: string;
   lessons: UTAMVLesson[];
   enrollments: number;
   rating: number;
   certificationType: CertificationType;
   xrEnabled: boolean;
   prerequisites?: string[];
   skills: string[];
   language: string;
   createdAt: Date;
   updatedAt: Date;
 }
 
 export type CourseCategory = 
   | 'technology'
   | 'ai_ml'
   | 'blockchain'
   | 'xr_development'
   | 'digital_arts'
   | 'music_production'
   | 'business'
   | 'health_wellness'
   | 'languages'
   | 'personal_development'
   | 'tamv_ecosystem';
 
 export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
 
 export type CertificationType = 
   | 'none' 
   | 'completion' 
   | 'verified'
   | 'blockchain_nft'
   | 'professional'
   | 'academic';
 
 export interface UTAMVLesson {
   id: string;
   courseId: string;
   title: string;
   description: string;
   order: number;
   duration: number; // minutes
   type: LessonType;
   content: LessonContent;
   quiz?: LessonQuiz;
   xrExperience?: XRExperienceConfig;
   isPreview: boolean;
   completionCriteria: CompletionCriteria;
 }
 
 export type LessonType = 
   | 'video'
   | 'interactive'
   | 'xr_simulation'
   | 'live_session'
   | 'reading'
   | 'project'
   | 'assessment';
 
 export interface LessonContent {
   videoUrl?: string;
   markdownContent?: string;
   interactiveElements?: InteractiveElement[];
   resources?: LessonResource[];
   aiTutorEnabled: boolean;
 }
 
 export interface InteractiveElement {
   id: string;
   type: 'code_editor' | 'simulation' | 'quiz_inline' | '3d_viewer' | 'whiteboard';
   config: Record<string, unknown>;
 }
 
 export interface LessonResource {
   id: string;
   name: string;
   type: 'pdf' | 'code' | 'dataset' | 'model_3d' | 'audio';
   url: string;
   size: number;
 }
 
 export interface LessonQuiz {
   id: string;
   questions: QuizQuestion[];
   passingScore: number;
   maxAttempts: number;
   timeLimit?: number; // minutes
 }
 
 export interface QuizQuestion {
   id: string;
   text: string;
   type: 'multiple_choice' | 'multiple_select' | 'true_false' | 'short_answer' | 'code';
   options?: string[];
   correctAnswer: string | string[];
   explanation?: string;
   points: number;
 }
 
 export interface XRExperienceConfig {
   sceneId: string;
   objectives: string[];
   interactionPoints: { x: number; y: number; z: number; action: string }[];
   vrRequired: boolean;
   arSupported: boolean;
 }
 
 export interface CompletionCriteria {
   watchPercentage?: number;
   quizScore?: number;
   projectSubmission?: boolean;
   xrObjectivesCompleted?: number;
 }
 
 export interface UTAMVEnrollment {
   id: string;
   userId: string;
   courseId: string;
   enrolledAt: Date;
   progress: number; // 0-100
   completedLessons: string[];
   quizScores: Record<string, number>;
   lastAccessedAt: Date;
   certificateId?: string;
   status: 'active' | 'completed' | 'paused' | 'expired';
 }
 
 export interface UTAMVCertificate {
   id: string;
   userId: string;
   courseId: string;
   courseName: string;
   instructorName: string;
   issuedAt: Date;
   expiresAt?: Date;
   type: CertificationType;
   blockchainHash?: string;
   nftTokenId?: string;
   verificationUrl: string;
   skills: string[];
   grade?: string;
 }
 
 // Catálogo de cursos por defecto
 export const DEFAULT_UTAMV_CATALOG: Partial<UTAMVCourse>[] = [
   {
     id: 'utamv-001',
     title: 'Introducción al Ecosistema TAMV',
     description: 'Aprende los fundamentos de TAMV: Isabella AI, DreamSpaces, economía digital y más.',
     instructor: 'Isabella Villaseñor AI',
     category: 'tamv_ecosystem',
     level: 'beginner',
     duration: 120,
     price: 0,
     currency: 'credits',
     enrollments: 15000,
     rating: 4.9,
     certificationType: 'completion',
     xrEnabled: true,
     skills: ['TAMV Basics', 'Isabella AI', 'Digital Economy'],
     language: 'es'
   },
   {
     id: 'utamv-002',
     title: 'Desarrollo de DreamSpaces XR',
     description: 'Crea tus propios mundos inmersivos con WebXR, Three.js y el motor TAMV 4D.',
     instructor: 'Edwin Castillo',
     category: 'xr_development',
     level: 'intermediate',
     duration: 480,
     price: 99,
     currency: 'credits',
     enrollments: 5200,
     rating: 4.8,
     certificationType: 'blockchain_nft',
     xrEnabled: true,
     skills: ['WebXR', 'Three.js', 'TAMV 4D Engine', '3D Design'],
     language: 'es'
   },
   {
     id: 'utamv-003',
     title: 'Isabella AI: Desarrollo de Agentes Éticos',
     description: 'Aprende a desarrollar agentes de IA con el framework IsabellaGuardian.',
     instructor: 'Isabella Villaseñor AI',
     category: 'ai_ml',
     level: 'advanced',
     duration: 720,
     price: 299,
     currency: 'credits',
     enrollments: 3100,
     rating: 4.9,
     certificationType: 'professional',
     xrEnabled: false,
     skills: ['AI Development', 'Ethical AI', 'EOCT', 'KEC Framework'],
     language: 'es'
   },
   {
     id: 'utamv-004',
     title: 'Blockchain MSR y Economía Digital',
     description: 'Domina la blockchain MSR, smart contracts éticos y tokenomics TAMV.',
     instructor: 'Anubis Villaseñor',
     category: 'blockchain',
     level: 'intermediate',
     duration: 360,
     price: 149,
     currency: 'credits',
     enrollments: 4500,
     rating: 4.7,
     certificationType: 'verified',
     xrEnabled: false,
     skills: ['Blockchain', 'Smart Contracts', 'MSR Chain', 'Tokenomics'],
     language: 'es'
   }
 ];
 
 // Motor de UTAMV
 export class UTAMVEngine {
   private courses: Map<string, UTAMVCourse> = new Map();
   private enrollments: Map<string, UTAMVEnrollment> = new Map();
   private certificates: Map<string, UTAMVCertificate> = new Map();
   
   constructor() {
     this.loadDefaultCatalog();
   }
   
   private loadDefaultCatalog(): void {
     DEFAULT_UTAMV_CATALOG.forEach(course => {
       const fullCourse: UTAMVCourse = {
         ...course,
         thumbnail: `/courses/${course.id}.jpg`,
         lessons: [],
         prerequisites: [],
         createdAt: new Date(),
         updatedAt: new Date()
       } as UTAMVCourse;
       this.courses.set(course.id!, fullCourse);
     });
   }
   
   getCourses(): UTAMVCourse[] {
     return Array.from(this.courses.values());
   }
   
   getCourseById(id: string): UTAMVCourse | undefined {
     return this.courses.get(id);
   }
   
   getCoursesByCategory(category: CourseCategory): UTAMVCourse[] {
     return Array.from(this.courses.values()).filter(c => c.category === category);
   }
   
   async enrollUser(userId: string, courseId: string): Promise<UTAMVEnrollment> {
     const course = this.courses.get(courseId);
     if (!course) throw new Error('Course not found');
     
     const enrollment: UTAMVEnrollment = {
       id: `enroll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
       userId,
       courseId,
       enrolledAt: new Date(),
       progress: 0,
       completedLessons: [],
       quizScores: {},
       lastAccessedAt: new Date(),
       status: 'active'
     };
     
     this.enrollments.set(enrollment.id, enrollment);
     course.enrollments++;
     
     return enrollment;
   }
   
   getEnrollmentsByUser(userId: string): UTAMVEnrollment[] {
     return Array.from(this.enrollments.values()).filter(e => e.userId === userId);
   }
   
   async issueCertificate(
     enrollmentId: string,
     grade?: string
   ): Promise<UTAMVCertificate> {
     const enrollment = this.enrollments.get(enrollmentId);
     if (!enrollment) throw new Error('Enrollment not found');
     if (enrollment.progress < 100) throw new Error('Course not completed');
     
     const course = this.courses.get(enrollment.courseId);
     if (!course) throw new Error('Course not found');
     
     const certificate: UTAMVCertificate = {
       id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
       userId: enrollment.userId,
       courseId: enrollment.courseId,
       courseName: course.title,
       instructorName: course.instructor,
       issuedAt: new Date(),
       type: course.certificationType,
       verificationUrl: `https://tamv.online/verify/${enrollment.id}`,
       skills: course.skills,
       grade
     };
     
     if (course.certificationType === 'blockchain_nft') {
       certificate.blockchainHash = `msr-cert-${Date.now().toString(16)}`;
       certificate.nftTokenId = `nft-${Date.now()}`;
     }
     
     this.certificates.set(certificate.id, certificate);
     enrollment.certificateId = certificate.id;
     enrollment.status = 'completed';
     
     return certificate;
   }
   
   getCertificatesByUser(userId: string): UTAMVCertificate[] {
     return Array.from(this.certificates.values()).filter(c => c.userId === userId);
   }
   
   getStats(): {
     totalCourses: number;
     totalEnrollments: number;
     totalCertificates: number;
     popularCategories: { category: string; count: number }[];
   } {
     const categoryCounts = new Map<string, number>();
     this.courses.forEach(course => {
       const count = categoryCounts.get(course.category) || 0;
       categoryCounts.set(course.category, count + 1);
     });
     
     return {
       totalCourses: this.courses.size,
       totalEnrollments: this.enrollments.size,
       totalCertificates: this.certificates.size,
       popularCategories: Array.from(categoryCounts.entries())
         .map(([category, count]) => ({ category, count }))
         .sort((a, b) => b.count - a.count)
     };
   }
 }
 
 export const utamvEngine = new UTAMVEngine();