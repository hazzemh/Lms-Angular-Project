
export interface Submission {
    id: string;
    instructorId?:string;
    assignmentId: string;
    courseId : string;
    studentId: string;
    feedback?: string;
    fileUrl: string;
    grade?: string;
    submissionDate: Date;
  }