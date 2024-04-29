export interface Course {
    id?: string; // Optional because it's not part of the document fields but added manually
    title: string;
    description: string;
    instructor?: string;
    instructorId? : string;
    enrolledStudents?: string[];
    grade?: any
    isActive : boolean
    // Add other fields as needed
  }
  