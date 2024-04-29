import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedCoursesComponent } from './archived-courses.component';

describe('ArchivedCoursesComponent', () => {
  let component: ArchivedCoursesComponent;
  let fixture: ComponentFixture<ArchivedCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArchivedCoursesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
