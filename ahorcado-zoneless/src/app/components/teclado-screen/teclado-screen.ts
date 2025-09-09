import { Component, computed, Input, Output, EventEmitter, signal, input, output } from '@angular/core';
import { LetraEstado } from '../../models/estado-juego.model';

@Component({
  selector: 'app-teclado-screen',
  standalone: true,
  imports: [],
  templateUrl: './teclado-screen.html',
  styleUrl: './teclado-screen.css'
})
export class TecladoScreen {
  // Inputs reactivos (en vez de @Input setters)
  letrasAcertadas = input<Set<string>>(new Set());
  letrasErroneas = input<Set<string>>(new Set());
  juegoTerminado = input<boolean>(false);

  // Output reactivo (en vez de EventEmitter)
  letraSeleccionada = output<string>();
 
  private readonly letras = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["Z", "X", "C", "V", "B", "N", "M"]
  ];

  readonly filas = computed(() => {
    const acertadas = this.letrasAcertadas();
    const erroneas = this.letrasErroneas();
    const terminado = this.juegoTerminado();
    
    return this.letras.map(fila =>
      fila.map(letra => ({
        letra,
        estado: this.getEstadoLetra(letra, acertadas, erroneas),
        disabled: terminado || acertadas.has(letra) || erroneas.has(letra)
      }))
    );
  });
  
  onLetraClick(letra: string): void {
    if (!this.juegoTerminado() &&
        this.getEstadoLetra(letra, this.letrasAcertadas(), this.letrasErroneas()) === "disponible") {
      this.letraSeleccionada.emit(letra);
    }
  }

  private getEstadoLetra(
    letra: string, 
    acertadas: Set<string>, 
    erroneas: Set<string>
  ): "disponible" | "acertada" | "erronea" {
    if (acertadas.has(letra)) return "acertada";
    if (erroneas.has(letra)) return "erronea";
    return "disponible";
  }
}

