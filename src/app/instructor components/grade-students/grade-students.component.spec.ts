import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeStudentsComponent } from './grade-students.component';

describe('GradeStudentsComponent', () => {
  let component: GradeStudentsComponent;
  let fixture: ComponentFixture<GradeStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GradeStudentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GradeStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
