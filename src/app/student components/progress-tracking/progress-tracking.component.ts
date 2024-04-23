import { Component, OnInit } from '@angular/core';
import { ProgressService } from '../services/progress service/progress.service';

@Component({
  selector: 'app-progress-tracking',
  templateUrl: './progress-tracking.component.html',
  styleUrl: './progress-tracking.component.css'
})
export class ProgressTrackingComponent implements OnInit {
  progress: any;

  constructor(private progressService: ProgressService) {}

  ngOnInit(): void {
    this.progressService.getProgressForStudent('studentId').subscribe(progress => {
      this.progress = progress;
    });
  }
}
