import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitesVencidosComponent } from './tramites-vencidos.component';

describe('TramitesVencidosComponent', () => {
  let component: TramitesVencidosComponent;
  let fixture: ComponentFixture<TramitesVencidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TramitesVencidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitesVencidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
