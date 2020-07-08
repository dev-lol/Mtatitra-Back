import { TestBed } from '@angular/core/testing';

import { TarifService } from './tarif.service';

describe('TarifService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TarifService = TestBed.get(TarifService);
    expect(service).toBeTruthy();
  });
});
