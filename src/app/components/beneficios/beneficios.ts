import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-beneficios',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './beneficios.html',
})
export class Beneficios {}
