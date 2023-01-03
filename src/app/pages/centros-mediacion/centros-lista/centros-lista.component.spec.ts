import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentrosListaComponent } from './centros-lista.component';

describe('CentrosListaComponent', () => {
  let component: CentrosListaComponent;
  let fixture: ComponentFixture<CentrosListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CentrosListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CentrosListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
