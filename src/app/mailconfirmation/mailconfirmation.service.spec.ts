import { TestBed } from '@angular/core/testing';

import { MailconfirmationService } from './mailconfirmation.service';

describe('MailconfirmationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MailconfirmationService = TestBed.get(MailconfirmationService);
    expect(service).toBeTruthy();
  });
});
