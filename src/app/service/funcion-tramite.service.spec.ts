import { TestBed } from '@angular/core/testing';

import { FuncionTramiteService } from './funcion-tramite.service';

describe('FuncionTramiteService', () => {
  let service: FuncionTramiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuncionTramiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
