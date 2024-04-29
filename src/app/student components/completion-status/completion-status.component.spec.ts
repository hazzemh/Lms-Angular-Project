import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletionStatusComponent } from './completion-status.component';

describe('CompletionStatusComponent', () => {
  let component: CompletionStatusComponent;
  let fixture: ComponentFixture<CompletionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompletionStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompletionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
