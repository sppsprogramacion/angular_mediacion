import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitesUsuarioAdministrarComponent } from './tramites-usuario-administrar.component';

describe('TramitesUsuarioAdministrarComponent', () => {
  let component: TramitesUsuarioAdministrarComponent;
  let fixture: ComponentFixture<TramitesUsuarioAdministrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TramitesUsuarioAdministrarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitesUsuarioAdministrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
