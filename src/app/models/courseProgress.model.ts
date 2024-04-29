
export interface CourseProgress {
    id: string;
    progress: number;
    completed: boolean;
    grade: string | undefined;
    title: string;
    description?: string; 
    instructor?: string; 
  }