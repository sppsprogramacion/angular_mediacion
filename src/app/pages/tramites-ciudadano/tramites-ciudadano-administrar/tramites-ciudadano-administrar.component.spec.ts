import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitesCiudadanoAdministrarComponent } from './tramites-ciudadano-administrar.component';

describe('TramitesCiudadanoAdministrarComponent', () => {
  let component: TramitesCiudadanoAdministrarComponent;
  let fixture: ComponentFixture<TramitesCiudadanoAdministrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TramitesCiudadanoAdministrarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitesCiudadanoAdministrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
