import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);

  guardando = false;

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{3}\s?\d{3}\s?\d{4}$/)]]
  });

  get nombre() {
    return this.form.get('nombre');
  }

  get email() {
    return this.form.get('email');
  }

  get telefono() {
    return this.form.get('telefono');
  }

  ngOnInit() {
    const usuario = this.authService.usuario();
    if (!usuario) return;

    this.form.patchValue({
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: this.formatearTelefono(usuario.telefono || '')
    });
  }

  onTelefonoInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.form.patchValue({ telefono: this.formatearTelefono(input.value) }, { emitEvent: false });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Perfil incompleto',
        text: 'Revisa tus datos antes de guardar.',
        confirmButtonColor: '#1E3A5F'
      });
      return;
    }

    this.guardando = true;
    const { nombre, email, telefono } = this.form.getRawValue();

    this.authService
      .actualizarPerfil({
        nombre: nombre!,
        email: email!,
        telefono: this.normalizarTelefono(telefono || '')
      })
      .subscribe({
        next: () => {
          this.guardando = false;
          Swal.fire({
            icon: 'success',
            title: 'Perfil actualizado',
            text: 'Tus datos se guardaron correctamente.',
            confirmButtonColor: '#1E3A5F'
          });
        },
        error: (err) => {
          this.guardando = false;
          const mensaje =
            err.status === 404
              ? 'El backend aún no tiene habilitada la actualización de perfil.'
              : 'No se pudieron actualizar tus datos. Intenta de nuevo.';

          Swal.fire({
            icon: 'error',
            title: 'No fue posible guardar',
            text: mensaje,
            confirmButtonColor: '#1E3A5F'
          });
        }
      });
  }

  private normalizarTelefono(telefono: string): string {
    return telefono.replace(/\D/g, '').slice(0, 10);
  }

  private formatearTelefono(telefono: string): string {
    const digitos = this.normalizarTelefono(telefono);
    const bloques = [digitos.slice(0, 3), digitos.slice(3, 6), digitos.slice(6, 10)].filter(Boolean);
    return bloques.join(' ');
  }
}
