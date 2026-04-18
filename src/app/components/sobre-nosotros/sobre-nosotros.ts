import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  templateUrl: './sobre-nosotros.html',
})
export class SobreNosotros {}
