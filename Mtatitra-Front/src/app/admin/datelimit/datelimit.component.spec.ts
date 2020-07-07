import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatelimitComponent } from './datelimit.component';

describe('DatelimitComponent', () => {
  let component: DatelimitComponent;
  let fixture: ComponentFixture<DatelimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatelimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatelimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
