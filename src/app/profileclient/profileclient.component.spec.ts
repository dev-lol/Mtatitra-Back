import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileclientComponent } from './profileclient.component';

describe('ProfileclientComponent', () => {
  let component: ProfileclientComponent;
  let fixture: ComponentFixture<ProfileclientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileclientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
