import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailZoneComponent } from './detail-zone.component';

describe('DetailZoneComponent', () => {
  let component: DetailZoneComponent;
  let fixture: ComponentFixture<DetailZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
