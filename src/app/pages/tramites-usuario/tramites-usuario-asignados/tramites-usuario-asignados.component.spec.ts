import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitesUsuarioAsignadosComponent } from './tramites-usuario-asignados.component';

describe('TramitesUsuarioAsignadosComponent', () => {
  let component: TramitesUsuarioAsignadosComponent;
  let fixture: ComponentFixture<TramitesUsuarioAsignadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TramitesUsuarioAsignadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitesUsuarioAsignadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
