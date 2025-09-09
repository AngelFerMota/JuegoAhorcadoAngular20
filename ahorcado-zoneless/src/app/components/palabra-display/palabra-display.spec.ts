import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalabraDisplay } from './palabra-display';

describe('PalabraDisplay', () => {
  let component: PalabraDisplay;
  let fixture: ComponentFixture<PalabraDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PalabraDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PalabraDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
