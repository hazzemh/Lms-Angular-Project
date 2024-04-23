import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseMaterialsComponent } from './course-materials.component';

describe('CourseMaterialsComponent', () => {
  let component: CourseMaterialsComponent;
  let fixture: ComponentFixture<CourseMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourseMaterialsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourseMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
