import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiudadanoTramitesFinalizadosComponent } from './ciudadano-tramites-finalizados.component';

describe('CiudadanoTramitesFinalizadosComponent', () => {
  let component: CiudadanoTramitesFinalizadosComponent;
  let fixture: ComponentFixture<CiudadanoTramitesFinalizadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CiudadanoTramitesFinalizadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CiudadanoTramitesFinalizadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
