import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEnrollmentComponent } from './admin-enrollment.component';

describe('AdminEnrollmentComponent', () => {
  let component: AdminEnrollmentComponent;
  let fixture: ComponentFixture<AdminEnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminEnrollmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
