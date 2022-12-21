import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitesNuevoslisComponent } from './tramites-nuevoslis.component';

describe('TramitesNuevoslisComponent', () => {
  let component: TramitesNuevoslisComponent;
  let fixture: ComponentFixture<TramitesNuevoslisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TramitesNuevoslisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitesNuevoslisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
