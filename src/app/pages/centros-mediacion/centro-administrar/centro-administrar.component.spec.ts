import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentroAdministrarComponent } from './centro-administrar.component';

describe('CentroAdministrarComponent', () => {
  let component: CentroAdministrarComponent;
  let fixture: ComponentFixture<CentroAdministrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CentroAdministrarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CentroAdministrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
