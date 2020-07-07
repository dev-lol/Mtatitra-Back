import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTarifComponent } from './detail-tarif.component';

describe('DetailTarifComponent', () => {
  let component: DetailTarifComponent;
  let fixture: ComponentFixture<DetailTarifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailTarifComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTarifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
