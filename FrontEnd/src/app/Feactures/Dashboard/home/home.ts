import { Component } from '@angular/core';
import { Navegacion } from '../../../Shared/navegacion/navegacion';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Navegacion, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  
}
