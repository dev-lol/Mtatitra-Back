import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRapportComponent } from './form-rapport.component';

describe('FormRapportComponent', () => {
    let component: FormRapportComponent;
    let fixture: ComponentFixture<FormRapportComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FormRapportComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormRapportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
