export interface LetraEstado {
  letra: string;
  estado: 'disponible' | 'acertada' | 'erronea';
  disabled?: boolean;
}

export interface EstadoJuego {
  palabra: string;
  letrasAcertadas: Set<string>;
  letrasErroneas: Set<string>;
  juegoTerminado: boolean;
  ganado: boolean;
  intentosRestantes: number;
}
