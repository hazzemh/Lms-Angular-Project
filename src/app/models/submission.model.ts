export interface Submission {
    id: string;
    assignmentId: string;
    studentId: string;
    feedback?: string;
    fileUrl: string;
    grade?: string;
    submissionDate: Date;
  }