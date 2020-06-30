import { TestBed } from '@angular/core/testing';

import { ClientformService } from './clientform.service';

describe('ClientformService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClientformService = TestBed.get(ClientformService);
    expect(service).toBeTruthy();
  });
});
