import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from '../../Core/Services/account';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private services = inject(Account);
  private router = inject(Router);

  loginForm = this.fb.group({
    dni: [''],
    password: ['']
  });

  onSubmit() {
    this.services.Login(this.loginForm.value).subscribe({
      next: (response) => {
         
        console.log(response);
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
        console.error('Login error:', error);
      }
    });
  }

}
