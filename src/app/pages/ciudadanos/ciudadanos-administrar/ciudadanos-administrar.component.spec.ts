import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiudadanosAdministrarComponent } from './ciudadanos-administrar.component';

describe('CiudadanosAdministrarComponent', () => {
  let component: CiudadanosAdministrarComponent;
  let fixture: ComponentFixture<CiudadanosAdministrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CiudadanosAdministrarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CiudadanosAdministrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
