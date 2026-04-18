import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Servicios } from '../../services/servicios';
import { Servicio } from '../../interfaces/servicio';
import { PrecioMxnPipe } from '../../pipes/precio-mxn-pipe';

type PanelDetalle = 'incluye' | 'visita' | 'ideal';

@Component({
  selector: 'app-detalle-servicio',
  standalone: true,
  imports: [NgClass, PrecioMxnPipe],
  templateUrl: './detalle-servicio.html',
  styleUrl: './detalle-servicio.css'
})
export class DetalleServicio implements OnInit {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private serviciosService = inject(Servicios);

  servicio = signal<Servicio | undefined>(undefined);
  panelActivo = signal<PanelDetalle>('incluye');

  resumen = computed(() => {
    const descripcion = this.servicio()?.descripcion?.trim();
    if (!descripcion) {
      return 'Una experiencia diseñada para ayudarte a desconectar, recuperar equilibrio y disfrutar un momento de bienestar.';
    }

    const [primerBloque] = descripcion.split(/(?<=[.!?])\s+/);
    return primerBloque || descripcion;
  });

  detalleActivo = computed(() => this.obtenerPanelContenido(this.panelActivo()));

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.serviciosService.getServicioById(id).subscribe((data) => {
        this.servicio.set(data);
      });
    });
  }

  seleccionarPanel(panel: PanelDetalle) {
    this.panelActivo.set(panel);
  }

  irAgendar() {
    this.router.navigate(['/agendar'], {
      queryParams: { idServicio: this.servicio()?.id, nombre: this.servicio()?.nombre }
    });
  }

  obtenerImagenFondo(): string {
    const imagen = this.servicio()?.imagen_url?.trim();
    return imagen ? `url('${imagen}')` : '';
  }

  obtenerEtiquetaDuracion(): string {
    const minutos = this.servicio()?.duracion_min ?? 0;

    if (minutos <= 45) {
      return 'Ritual express';
    }

    if (minutos <= 75) {
      return 'Sesión equilibrada';
    }

    return 'Experiencia profunda';
  }

  obtenerBeneficios(): string[] {
    const descripcion = this.servicio()?.descripcion?.trim();
    const nombre = this.servicio()?.nombre || 'tu experiencia';

    if (descripcion) {
      const segmentos = descripcion
        .split(/[.!?]/)
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 3);

      if (segmentos.length) {
        return segmentos;
      }
    }

    return [
      `Atención personalizada durante todo el proceso de ${nombre.toLowerCase()}.`,
      'Un espacio pensado para que te relajes desde el primer minuto.',
      'Cierre con recomendaciones para prolongar el bienestar después de la sesión.'
    ];
  }

  obtenerMomentos(): Array<{ titulo: string; detalle: string; tiempo: string }> {
    const duracion = this.servicio()?.duracion_min ?? 60;
    const bienvenida = Math.max(10, Math.round(duracion * 0.15));
    const experiencia = Math.max(25, Math.round(duracion * 0.65));
    const cierre = Math.max(10, duracion - bienvenida - experiencia);

    return [
      {
        titulo: 'Bienvenida',
        detalle: 'Recepción, contexto rápido de tu visita y preparación del espacio.',
        tiempo: `${bienvenida} min`
      },
      {
        titulo: 'Experiencia',
        detalle: 'El servicio principal se desarrolla con ritmo continuo y atención personalizada.',
        tiempo: `${experiencia} min`
      },
      {
        titulo: 'Cierre',
        detalle: 'Salida suave, recomendaciones y seguimiento para que aproveches mejor tu sesión.',
        tiempo: `${cierre} min`
      }
    ];
  }

  obtenerIndicadores(): Array<{ etiqueta: string; valor: string }> {
    const servicio = this.servicio();

    return [
      {
        etiqueta: 'Duración',
        valor: `${servicio?.duracion_min ?? 0} min`
      },
      {
        etiqueta: 'Modalidad',
        valor: 'Atención personalizada'
      },
      {
        etiqueta: 'Reserva',
        valor: 'Confirmación rápida'
      }
    ];
  }

  private obtenerPanelContenido(panel: PanelDetalle): { titulo: string; descripcion: string; puntos: string[] } {
    const nombre = this.servicio()?.nombre || 'este servicio';
    const beneficios = this.obtenerBeneficios();

    switch (panel) {
      case 'visita':
        return {
          titulo: 'Cómo será tu visita',
          descripcion: 'La experiencia está organizada para que entiendas el ritmo de la sesión antes de reservar.',
          puntos: [
            'Llegas, te recibimos y ajustamos detalles básicos de comodidad.',
            `La sesión de ${nombre.toLowerCase()} se desarrolla sin interrupciones ni pasos confusos.`,
            'Al final recibes recomendaciones breves para aprovechar mejor el resultado.'
          ]
        };
      case 'ideal':
        return {
          titulo: 'Ideal para ti si buscas',
          descripcion: 'Este bloque te ayuda a decidir rápido si este servicio sí encaja con lo que necesitas hoy.',
          puntos: [
            'Desconectar tensión acumulada y darte un espacio real de pausa.',
            'Una opción premium pero fácil de entender y reservar.',
            beneficios[0] || 'Una experiencia enfocada en bienestar y comodidad.'
          ]
        };
      default:
        return {
          titulo: 'Lo que incluye',
          descripcion: 'Resumen claro de lo que obtienes al reservar, sin texto de sobra.',
          puntos: beneficios
        };
    }
  }
}
