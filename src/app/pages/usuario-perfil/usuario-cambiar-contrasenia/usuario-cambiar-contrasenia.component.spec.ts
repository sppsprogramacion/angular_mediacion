import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioCambiarContraseniaComponent } from './usuario-cambiar-contrasenia.component';

describe('UsuarioCambiarContraseniaComponent', () => {
  let component: UsuarioCambiarContraseniaComponent;
  let fixture: ComponentFixture<UsuarioCambiarContraseniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuarioCambiarContraseniaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioCambiarContraseniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
