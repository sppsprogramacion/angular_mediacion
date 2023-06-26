import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiudadanoDatospersonalesComponent } from './ciudadano-datospersonales.component';

describe('CiudadanoDatospersonalesComponent', () => {
  let component: CiudadanoDatospersonalesComponent;
  let fixture: ComponentFixture<CiudadanoDatospersonalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CiudadanoDatospersonalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CiudadanoDatospersonalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
