import { User } from '../models/userDetails.model';
import { Observable } from "rxjs";
import { Assignment } from "./assignment.model";
import { Submission } from "./submission.model";

export interface EnrichedSubmission {
    submission: Submission;
    user: User;
    assignment: Assignment;
  }