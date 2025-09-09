# Juego del Ahorcado en Angular

Este proyecto es una implementación moderna del clásico juego del ahorcado desarrollado con Angular 20, aprovechando las últimas características del framework como las Signals para un manejo de estado reactivo y eficiente.

## Arquitectura y Diseño Técnico

### Tecnologías Utilizadas

- **Angular 20.2**: Framework principal con soporte completo para características modernas
- **Signals API**: Para manejo reactivo del estado de la aplicación
- **Standalone Components**: Componentes autónomos sin necesidad de módulos
- **CSS Moderno**: Gradientes, animaciones y efectos visuales avanzados

### Estructura del Proyecto

El proyecto sigue una arquitectura basada en componentes con una clara separación de responsabilidades:

```
src/
├── app/
│   ├── components/
│   │   ├── img-ahorcado/        # Componente para la imagen del ahorcado
│   │   ├── palabra-display/     # Componente para mostrar la palabra oculta
│   │   └── teclado-screen/      # Componente para el teclado virtual
│   ├── models/
│   │   └── estado-juego.model.ts # Interfaces y tipos del juego
│   ├── services/
│   │   └── juego.service.ts     # Servicio principal de la lógica del juego
│   ├── app.ts                   # Componente principal
│   ├── app.html                 # Plantilla del componente principal
│   └── app.css                  # Estilos del componente principal
```

### Patrón de Diseño y Manejo de Estado

El proyecto implementa un patrón de arquitectura unidireccional con las siguientes características:

1. **Estado Centralizado**: Todo el estado del juego se mantiene en `JuegoService` usando Signals.
2. **Flujo de Datos Unidireccional**: Los componentes reciben datos mediante inputs y emiten eventos mediante outputs.
3. **Reactividad**: Los cambios en el estado se propagan automáticamente a los componentes mediante señales reactivas.

### Implementación Técnica de Señales (Signals)

La aplicación utiliza el nuevo sistema de señales de Angular para manejar el estado:

```typescript
// Definición del estado
private readonly estadoSignal = signal<EstadoJuego>({...});

// Exposición de señales de solo lectura
readonly estado = this.estadoSignal.asReadonly();
readonly fallos = computed(() => this.estado().letrasErroneas.size);
readonly palabraVisible = computed(() => {...});

// Actualización de estado
this.estadoSignal.update(current => ({...current, ...newState}));
```

## Componentes Principales

### JuegoService

El cerebro de la aplicación que:
- Mantiene el estado global del juego
- Implementa la lógica principal para procesar letras
- Proporciona señales computadas para vistas derivadas

**Implementación detallada:**

```typescript
@Injectable({
  providedIn: 'root'
})
export class JuegoService {
  // Array de palabras disponibles para el juego
  private readonly PALABRAS = [
    'ANGULAR', 'TYPESCRIPT', 'JAVASCRIPT', 'COMPONENTE', 'DIRECTIVA',
    'SERVICIO', 'INYECCION', 'OBSERVABLE', 'REACTIVIDAD', 'TEMPLATE',
    'INTERFACE', 'DECORADOR', 'MODULO', 'DEPENDENCIA', 'SEÑAL'
  ];
  
  // Máximo número de intentos antes de perder
  private readonly MAX_INTENTOS = 6;
  
  // Estado principal del juego como signal
  private readonly estadoSignal = signal<EstadoJuego>({...});
  
  // Señales de solo lectura para la UI
  readonly estado = this.estadoSignal.asReadonly();
  readonly fallos = computed(() => this.estado().letrasErroneas.size);
  readonly palabraVisible = computed(() => {
    // Genera la representación de la palabra con guiones bajos para letras no adivinadas
  });

  // Métodos principales
  iniciarJuego(): void {
    // Selecciona palabra aleatoria y reinicia el estado
  }
  
  procesarLetra(letra: string): void {
    // Comprueba si la letra está en la palabra
    // Actualiza letrasAcertadas o letrasErroneas
    // Determina si el juego ha terminado
  }
}
```

**Aspectos técnicos clave:**

1. **Inmutabilidad del estado:** Al actualizar el estado, se crean nuevas instancias de los Sets de letras acertadas y erróneas para garantizar la detección de cambios:
   ```typescript
   const letrasAcertadas = new Set(estado.letrasAcertadas);
   ```

2. **Actualización atómica:** Todas las actualizaciones del estado se realizan en una sola operación:
   ```typescript
   this.estadoSignal.update(current => ({
     ...current,
     letrasAcertadas,
     letrasErroneas,
     intentosRestantes,
     juegoTerminado,
     ganado
   }));
   ```

3. **Señales computadas:** Se derivan propiedades como el número de fallos y la palabra visible a partir del estado base:
   ```typescript
   readonly fallos = computed(() => this.estado().letrasErroneas.size);
   ```

### Componentes de UI

#### Componente Principal (App)

Orquesta los componentes hijo y se comunica con el servicio.

**Implementación detallada:**

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ImgAhorcado, PalabraDisplay, TecladoScreen],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly juegoService = inject(JuegoService);

  // Referencias directas a señales del servicio
  readonly estado = this.juegoService.estado;
  readonly palabraVisible = this.juegoService.palabraVisible;
  readonly fallos = this.juegoService.fallos;

  // Estadísticas derivadas computadas
  readonly estadisticas = computed(() => {
    // Calcula eficiencia, progreso, etc.
  });

  constructor() {
    // Efectos para manejar cambios en el estado
    effect(() => {
      // Muestra estadísticas cuando termina el juego
    });
  }

  ngOnInit(): void {
    this.juegoService.iniciarJuego();
  }

  // Métodos delegados al servicio
  procesarLetra(letra: string): void {
    this.juegoService.procesarLetra(letra);
  }

  nuevoJuego(): void {
    this.juegoService.iniciarJuego();
  }
}
```

**Aspectos técnicos clave:**

1. **Composición de componentes:** Actúa como orquestador entre los componentes hijos y el servicio, sin mantener estado propio.

2. **Inyección de dependencias:** Utiliza el patrón de inyección de dependencias con `inject()` para obtener el servicio.

3. **Derivación de datos:** Calcula estadísticas derivadas sin almacenar estado duplicado.

4. **Reactividad automática:** Las vistas se actualizan automáticamente al cambiar las señales del servicio.

#### ImgAhorcado

Implementa `OnChanges` para reaccionar a cambios en la propiedad `fallos`:

**Implementación detallada:**

```typescript
@Component({
  selector: 'app-img-ahorcado',
  standalone: true,
  imports: [],
  templateUrl: './img-ahorcado.html',
  styleUrl: './img-ahorcado.css'
})
export class ImgAhorcado implements OnChanges {
  @Input() fallos: number = 0;
  
  // Signal interno para seguir el valor de fallos
  private readonly fallosSignal = signal<number>(0);
  
  // Ruta de la imagen calculada de forma reactiva
  readonly imagenSrc = computed(() => {
    const errores = this.fallosSignal();
    if (errores >= 0 && errores <= 6) {
      return `/ahorcado${errores}.png`;
    }
    return '/ahorcado-error.png';
  });
  
  constructor() {
    this.actualizarFallos();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.actualizarFallos();
  }
  
  private actualizarFallos(): void {
    this.fallosSignal.set(this.fallos);
  }
}
```

**Aspectos técnicos clave:**

1. **Patrón de sincronización Input-Signal:** Implementa OnChanges para sincronizar la propiedad de entrada con un signal interno.

2. **Computación reactiva de la ruta de imagen:** La ruta de la imagen se calcula automáticamente basada en el número de fallos.

3. **Validación de límites:** Verifica que el número de fallos esté dentro del rango válido (0-6).

4. **Componente puro:** No mantiene ningún estado que no esté directamente relacionado con su responsabilidad.

#### TecladoScreen

Componente complejo que gestiona el teclado virtual:

**Implementación detallada:**

```typescript
@Component({
  selector: 'app-teclado-screen',
  standalone: true,
  imports: [],
  templateUrl: './teclado-screen.html',
  styleUrl: './teclado-screen.css'
})
export class TecladoScreen implements OnChanges {
  @Input() letrasAcertadas: Set<string> = new Set();
  @Input() letrasErroneas: Set<string> = new Set();
  @Input() juegoTerminado: boolean = false;
  @Output() letraSeleccionada = new EventEmitter<string>();
  
  // Signals internos para seguir el estado
  private readonly letrasAcertadasSignal = signal<Set<string>>(new Set());
  private readonly letrasErroneasSignal = signal<Set<string>>(new Set());
  private readonly juegoTerminadoSignal = signal<boolean>(false);

  // Disposición del teclado en filas
  private readonly letras = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  // Estado de las teclas calculado reactivamente
  readonly filas = computed(() => {
    // Mapea cada letra con su estado actual (disponible, acertada, errónea)
  });
  
  constructor() {
    this.actualizarEstadoTeclado();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.actualizarEstadoTeclado();
  }
  
  private actualizarEstadoTeclado(): void {
    // Actualiza los signals internos cuando cambian los inputs
  }

  onLetraClick(letra: string): void {
    // Maneja el evento de clic en una tecla
    // Emite el evento solo si la tecla está disponible y el juego no ha terminado
  }

  private getEstadoLetra(letra: string, acertadas: Set<string>, erroneas: Set<string>): 'disponible' | 'acertada' | 'erronea' {
    // Determina el estado visual de una letra
  }
}
```

**Aspectos técnicos clave:**

1. **Gestión avanzada de estado con múltiples signals:** Mantiene tres signals internos sincronizados con propiedades de entrada.

2. **Estructura de datos bidimensional:** Organiza el teclado en filas para facilitar la visualización.

3. **Estado derivado:** Calcula el estado visual de cada tecla basado en los conjuntos de letras acertadas y erróneas.

4. **Interacción condicionada:** Permite la interacción solo con teclas disponibles y cuando el juego está en curso.

5. **Barrera de inmutabilidad:** Crea nuevos objetos Set al actualizar los signals para asegurar la detección de cambios.

#### PalabraDisplay

Muestra la palabra parcialmente revelada:

**Implementación detallada:**

```typescript
@Component({
  selector: 'app-palabra-display',
  standalone: true,
  imports: [],
  templateUrl: './palabra-display.html',
  styleUrl: './palabra-display.css'
})
export class PalabraDisplay {
  @Input() palabra: string = '';
  
  get displayWord(): string {
    if (!this.palabra) return '';
    return this.palabra;
  }
}
```

**Aspectos técnicos clave:**

1. **Componente simple:** Implementación minimalista que solo recibe y muestra la palabra.

2. **Getter para transformación:** Utiliza un getter para realizar cualquier transformación necesaria antes de mostrar la palabra.

3. **Validación defensiva:** Comprueba que la palabra no esté vacía antes de intentar mostrarla.

### Modelos de Datos

El sistema utiliza interfaces TypeScript bien definidas para modelar el estado del juego:

```typescript
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
```

**Aspectos técnicos clave:**

1. **Tipos literales:** Uso de tipos literales para estados limitados (`'disponible' | 'acertada' | 'erronea'`).

2. **Propiedades opcionales:** Uso de propiedades opcionales (`disabled?`) para características condicionales.

3. **Estructuras de datos adecuadas:** Uso de `Set<string>` para colecciones de letras únicas, optimizando las operaciones de búsqueda.

## Patrones de Optimización

1. **Memoización con Signals**: Los valores computados se recalculan solo cuando sus dependencias cambian.

2. **Inmutabilidad del Estado**: Todas las actualizaciones del estado se realizan creando nuevos objetos.

3. **Minimización del Estado**: Solo se almacena el estado esencial, derivando el resto a través de funciones computadas.

4. **Detección de Cambios Eficiente**: Se utiliza OnPush para los componentes que solo dependen de inputs y eventos.

## Desafíos Técnicos Resueltos

### Manejo de Sets con Signals

El proyecto resuelve un problema común con las estructuras de datos Set y Map en Angular:
- Se crean nuevas instancias en cada actualización para garantizar la detección de cambios
- Se implementa correctamente OnChanges para detectar cambios en colecciones

### Sincronización de Propiedades y Signals

Se implementó un patrón donde:
1. Los componentes reciben propiedades mediante `@Input()`
2. Estas propiedades se sincronizan con signals internos
3. La UI se renderiza a partir de los signals, asegurando reactividad

## Prácticas de Código 

- **Código tipado**: Uso completo del sistema de tipos de TypeScript
- **Nombres semánticos**: Variables y funciones con nombres descriptivos
- **Inmutabilidad**: Uso de estructuras inmutables para el estado
- **Manejo de efectos secundarios**: Aislados en servicios específicos
- **DRY (Don't Repeat Yourself)**: Lógica compartida extraída a funciones

## Cómo Ejecutar

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ng serve

# Compilar para producción
ng build --prod
```

## Mejoras Futuras Potenciales

1. **Persistencia del estado**: Guardar puntuaciones y estadísticas en localStorage
2. **Implementación de PWA**: Convertir en una Progressive Web App
3. **Tests unitarios**: Implementar pruebas exhaustivas con Jest o Karma
4. **Internacionalización**: Soporte para múltiples idiomas
5. **Modo multijugador**: Implementar una versión multijugador en tiempo real

## Conclusiones Técnicas

Este proyecto demuestra una implementación moderna de Angular que aprovecha las últimas características del framework para crear una aplicación reactiva, mantenible y bien estructurada. El uso de signals representa una evolución significativa respecto a los observables tradicionales, proporcionando un modelo de programación más eficiente.
