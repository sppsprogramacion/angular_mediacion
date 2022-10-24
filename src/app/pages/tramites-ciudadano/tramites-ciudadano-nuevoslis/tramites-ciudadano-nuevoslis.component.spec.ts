import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitesCiudadanoNuevoslisComponent } from './tramites-ciudadano-nuevoslis.component';

describe('TramitesCiudadanoNuevoslisComponent', () => {
  let component: TramitesCiudadanoNuevoslisComponent;
  let fixture: ComponentFixture<TramitesCiudadanoNuevoslisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TramitesCiudadanoNuevoslisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitesCiudadanoNuevoslisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
