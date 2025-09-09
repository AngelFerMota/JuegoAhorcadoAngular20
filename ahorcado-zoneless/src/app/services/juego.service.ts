import { Injectable, signal, computed } from '@angular/core';
import { EstadoJuego } from '../models/estado-juego.model';

@Injectable({
  providedIn: 'root'
})
export class JuegoService {
  private readonly PALABRAS = [
    'ANGULAR', 'TYPESCRIPT', 'JAVASCRIPT', 'COMPONENTE', 'DIRECTIVA',
    'SERVICIO', 'OBSERVABLE', 'REACTIVIDAD', 'INTERFACE', 'DECORADOR', 
    'MODULO', 'DEPENDENCIA', 'SEÑAL'
  ];
  
  private readonly MAX_INTENTOS = 6;
  
  private readonly estadoSignal = signal<EstadoJuego>({
    palabra: '',
    letrasAcertadas: new Set<string>(),
    letrasErroneas: new Set<string>(),
    juegoTerminado: false,
    ganado: false,
    intentosRestantes: this.MAX_INTENTOS
  });
  
  readonly estado = this.estadoSignal.asReadonly();
  
  readonly fallos = computed(() => {
    const estado = this.estado();
    return estado.letrasErroneas.size;
  });
  
  readonly palabraVisible = computed(() => {
    const estado = this.estado();
    return Array.from(estado.palabra).map(letra => 
      estado.letrasAcertadas.has(letra) ? letra : '_'
    ).join(' ');
  });

  iniciarJuego(): void {
    const palabraAleatoria = this.PALABRAS[Math.floor(Math.random() * this.PALABRAS.length)];
    
    this.estadoSignal.set({
      palabra: palabraAleatoria,
      letrasAcertadas: new Set<string>(),
      letrasErroneas: new Set<string>(),
      juegoTerminado: false,
      ganado: false,
      intentosRestantes: this.MAX_INTENTOS
    });
  }
  
  procesarLetra(letra: string): void {
    letra = letra.toUpperCase();
    const estado = this.estadoSignal();
    
    // Si el juego ya terminó o la letra ya fue usada, no hacemos nada
    if (estado.juegoTerminado || 
        estado.letrasAcertadas.has(letra) || 
        estado.letrasErroneas.has(letra)) {
      return;
    }
    
    const letrasAcertadas = new Set(estado.letrasAcertadas);
    const letrasErroneas = new Set(estado.letrasErroneas);
    let intentosRestantes = estado.intentosRestantes;
    let juegoTerminado = false;
    let ganado = false;
    
    // Verificamos si la letra está en la palabra
    if (estado.palabra.includes(letra)) {
      letrasAcertadas.add(letra);
      
      // Verificamos si ganó (todas las letras de la palabra están en letrasAcertadas)
      const todasEncontradas = Array.from(estado.palabra).every(l => letrasAcertadas.has(l));
      if (todasEncontradas) {
        juegoTerminado = true;
        ganado = true;
      }
    } else {
      letrasErroneas.add(letra);
      intentosRestantes--;
      
      // Verificamos si perdió (agotó intentos)
      if (intentosRestantes <= 0) {
        juegoTerminado = true;
      }
    }
    
    // Actualizamos el estado
    this.estadoSignal.update(current => ({
      ...current,
      letrasAcertadas,
      letrasErroneas,
      intentosRestantes,
      juegoTerminado,
      ganado
    }));
  }
}
