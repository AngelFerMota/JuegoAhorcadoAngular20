import { Component, Input, signal, computed, input } from '@angular/core';

@Component({
  selector: 'app-palabra-display',
  standalone: true,
  imports: [],
  templateUrl: './palabra-display.html',
  styleUrl: './palabra-display.css'
})
export class PalabraDisplay {
  // Input reactivo directamente
  palabra = input<string>('');

  // Computed que deriva del input
  readonly displayWord = computed(() => this.palabra());
}