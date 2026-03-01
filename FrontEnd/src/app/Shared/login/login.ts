import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from '../../Core/Services/account';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})


export class Login {
  errorMessage: string = '';
  private fb = inject(FormBuilder);
  private services = inject(Account);
  private router = inject(Router);

  loginForm = this.fb.group({
    dni: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    password: ['', Validators.required]
  });

  onSubmit() {
    this.services.Login(this.loginForm.value).subscribe({
      next: (response) => {
        sessionStorage.setItem('token', response.token);

        sessionStorage.setItem('user', JSON.stringify({
          nombre: response.nombreCompleto,
          role: response.role,
          userId: response.userId
        }));


        if (response.role === 'ADMIN') {
          this.router.navigate(['home']);
        } else if (response.role === 'OBRERO') {
          this.router.navigate(['Inicio']);
        }

      },
      error: (error) => {
        if (error.status === 403 || error.status === 401) {
          this.errorMessage = 'Credenciales no válidas. Verifique su DNI y contraseña.';
        } else {
          this.errorMessage = 'Error al iniciar sesión. Intente de nuevo.';
        }
      }
    });
  }

  soloNumeros(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  }
}
