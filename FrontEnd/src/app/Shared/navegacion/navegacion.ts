
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navegacion',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navegacion.html',
  styleUrl: './navegacion.css',
})
export class Navegacion {
  user = sessionStorage.getItem('user');
  nombre = this.user ? JSON.parse(this.user).nombre : '';

  constructor(private router: Router){}

  cerrarSesion() {
    this.router.navigateByUrl('/').then(() => {
      sessionStorage.clear();
    });
  }

}