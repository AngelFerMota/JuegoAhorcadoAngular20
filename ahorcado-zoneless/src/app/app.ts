import { Component, inject, OnInit, computed, effect, afterNextRender, untracked } from '@angular/core';
import { ImgAhorcado } from './components/img-ahorcado/img-ahorcado';
import { PalabraDisplay } from './components/palabra-display/palabra-display';
import { JuegoService } from './services/juego.service';
import { TecladoScreen } from './components/teclado-screen/teclado-screen';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ImgAhorcado, PalabraDisplay, TecladoScreen],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly juegoService = inject(JuegoService);

  readonly estado = this.juegoService.estado;               // signal
  readonly palabraVisible = this.juegoService.palabraVisible; // signal
  readonly fallos = this.juegoService.fallos;               // signal

  readonly estadisticas = computed(() => {
    const { letrasAcertadas, letrasErroneas, palabra } = this.estado();
    const usadas = letrasAcertadas.size + letrasErroneas.size;

    const progreso =
      palabra.length > 0 ? (letrasAcertadas.size / palabra.length) * 100 : 0;

    const eficiencia =
      usadas > 0 ? (letrasAcertadas.size / usadas) * 100 : 0;

    // Opcional: clamping por si acaso
    const clamp = (v: number) => Math.max(0, Math.min(100, v));

    return {
      letrasUsadas: usadas,
      progreso: clamp(progreso),
      eficiencia: clamp(eficiencia),
    };
  });

  constructor() {
    // Inicia el juego tras el primer render
    afterNextRender(() => this.juegoService.iniciarJuego());

    // Efecto: se dispara cuando cambia 'estado'
    effect(() => {
      const { juegoTerminado, ganado } = this.estado();
      if (juegoTerminado) {
        // Evita reactivar el efecto por cambios en 'estadisticas'
        const stats = untracked(this.estadisticas);
      }
    });
  }

  procesarLetra(letra: string): void {
    this.juegoService.procesarLetra(letra);
  }

  nuevoJuego(): void {
    this.juegoService.iniciarJuego();
  }
}