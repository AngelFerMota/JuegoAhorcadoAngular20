import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgAhorcado } from './img-ahorcado';

describe('ImgAhorcado', () => {
  let component: ImgAhorcado;
  let fixture: ComponentFixture<ImgAhorcado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImgAhorcado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImgAhorcado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
