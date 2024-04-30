import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorGradeSubmissionsComponent } from './instructor-grade-submissions.component';

describe('InstructorGradeSubmissionsComponent', () => {
  let component: InstructorGradeSubmissionsComponent;
  let fixture: ComponentFixture<InstructorGradeSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstructorGradeSubmissionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstructorGradeSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
