import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitesUsuarioFinalizadosComponent } from './tramites-usuario-finalizados.component';

describe('TramitesUsuarioFinalizadosComponent', () => {
  let component: TramitesUsuarioFinalizadosComponent;
  let fixture: ComponentFixture<TramitesUsuarioFinalizadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TramitesUsuarioFinalizadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitesUsuarioFinalizadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
