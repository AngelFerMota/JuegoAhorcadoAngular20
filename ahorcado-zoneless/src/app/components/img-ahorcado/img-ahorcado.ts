import { Component, Input, signal, computed, input } from '@angular/core';

@Component({
  selector: 'app-img-ahorcado',
  standalone: true,
  imports: [],
  templateUrl: './img-ahorcado.html',
  styleUrl: './img-ahorcado.css'
})

export class ImgAhorcado {
  // Input reactivo directo
  fallos = input.required<number>();

  // Computed derivado del input
  readonly imagenSrc = computed(() => {
    const errores = this.fallos();
    if (errores >= 0 && errores <= 6) {
      return `ahorcado${errores}.png`;
    }
    return 'ahorcado-error.png';
  });
}
