export interface Course {
    id?: string; // Optional because it's not part of the document fields but added manually
    title: string;
    description: string;
    instructor: string;
    enrolledStudents: string[];
    grade?: any
    // Add other fields as needed
  }
  