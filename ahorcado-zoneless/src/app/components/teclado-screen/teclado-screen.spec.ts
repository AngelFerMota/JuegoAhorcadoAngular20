import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TecladoScreen } from './teclado-screen';

describe('TecladoScreen', () => {
  let component: TecladoScreen;
  let fixture: ComponentFixture<TecladoScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TecladoScreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TecladoScreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
