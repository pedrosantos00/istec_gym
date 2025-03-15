import { TestBed } from '@angular/core/testing';

import { GymClassService } from './gym-class.service';

describe('GymClassService', () => {
  let service: GymClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GymClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
