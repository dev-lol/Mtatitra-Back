import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailconfirmationComponent } from './mailconfirmation.component';

describe('MailconfirmationComponent', () => {
  let component: MailconfirmationComponent;
  let fixture: ComponentFixture<MailconfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailconfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailconfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
