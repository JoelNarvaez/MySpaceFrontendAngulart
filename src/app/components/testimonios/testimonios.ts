import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-testimonios',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  templateUrl: './testimonios.html',
})
export class Testimonios implements OnInit, OnDestroy {
  indice = signal(0);
  private intervalo: any;

  testimonios = [
    {
      nombre: 'Ana García',
      texto:
        'Una experiencia increíble. El masaje relajante fue exactamente lo que necesitaba después de semanas de estrés. El ambiente es hermoso y el trato muy profesional.',
    },
    {
      nombre: 'Carlos López',
      texto:
        'Ambiente tranquilo, música suave y terapeuta muy atenta. Sin duda el mejor lugar para desconectarse de todo. Ya agendé mi segunda cita.',
    },
    {
      nombre: 'María Rodríguez',
      texto:
        'Los productos que usan son de primera calidad. Mi piel quedó increíblemente suave y me fui completamente renovada. Totalmente recomendado.',
    },
  ];

  ngOnInit() {
    this.intervalo = setInterval(() => {
      this.indice.update(i => (i + 1) % this.testimonios.length);
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }

  setIndice(i: number) {
    this.indice.set(i);
  }
}
