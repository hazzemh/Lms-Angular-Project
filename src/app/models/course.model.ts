export interface Course {
    id?: string; 
    title: string;
    description: string;
    instructor?: string;
    instructorId? : string;
    enrolledStudents?: string[];
    grade?: any
    isActive : boolean
  }
  