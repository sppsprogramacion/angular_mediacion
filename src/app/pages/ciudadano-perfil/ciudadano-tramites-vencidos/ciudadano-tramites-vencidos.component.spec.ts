import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiudadanoTramitesVencidosComponent } from './ciudadano-tramites-vencidos.component';

describe('CiudadanoTramitesVencidosComponent', () => {
  let component: CiudadanoTramitesVencidosComponent;
  let fixture: ComponentFixture<CiudadanoTramitesVencidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CiudadanoTramitesVencidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CiudadanoTramitesVencidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
