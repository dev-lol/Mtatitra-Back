import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDateComponent } from './detail-date.component';

describe('DetailDateComponent', () => {
  let component: DetailDateComponent;
  let fixture: ComponentFixture<DetailDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
