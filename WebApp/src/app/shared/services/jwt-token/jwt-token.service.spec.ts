/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { JWTTokenService } from './jwt-token.service';

describe('Service: LocalStorage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JWTTokenService]
    });
  });

  it('should ...', inject([JWTTokenService], (service: JWTTokenService) => {
    expect(service).toBeTruthy();
  }));
});
