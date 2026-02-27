import { TestBed } from '@angular/core/testing';

import { EnpointsDashboard } from './enpoints-dashboard';

describe('EnpointsDashboard', () => {
  let service: EnpointsDashboard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnpointsDashboard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
