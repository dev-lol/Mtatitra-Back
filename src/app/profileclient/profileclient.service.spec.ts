import { TestBed } from '@angular/core/testing';

import { ProfileclientService } from './profileclient.service';

describe('ProfileclientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfileclientService = TestBed.get(ProfileclientService);
    expect(service).toBeTruthy();
  });
});
