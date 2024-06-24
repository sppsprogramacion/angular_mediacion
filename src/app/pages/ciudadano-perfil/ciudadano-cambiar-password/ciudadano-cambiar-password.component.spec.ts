import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiudadanoCambiarPasswordComponent } from './ciudadano-cambiar-password.component';

describe('CiudadanoCambiarPasswordComponent', () => {
  let component: CiudadanoCambiarPasswordComponent;
  let fixture: ComponentFixture<CiudadanoCambiarPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CiudadanoCambiarPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CiudadanoCambiarPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
