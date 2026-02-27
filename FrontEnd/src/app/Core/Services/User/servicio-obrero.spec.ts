import { TestBed } from '@angular/core/testing';

import { ServicioObrero } from './servicio-obrero';

describe('ServicioObrero', () => {
  let service: ServicioObrero;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioObrero);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
