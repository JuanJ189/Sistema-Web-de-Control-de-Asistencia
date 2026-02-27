import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../Enviroments/Environment';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { ServicioObrero } from '../../../Core/Services/User/servicio-obrero';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit, OnDestroy {

  user = sessionStorage.getItem('user');
  nombre = this.user ? JSON.parse(this.user).nombre : '';
  userId!: number;
  estadoAsistencia: any = null;

  // ===== MAPA =====

  @ViewChild(GoogleMap) map!: GoogleMap;

  center!: google.maps.LatLngLiteral;
  markerPosition!: google.maps.LatLngLiteral;
  zoom = 17;
  watchId?: number;

  ultimaUbicacion!: google.maps.LatLngLiteral;

  mensajeRespuesta: string = '';
  tipoMensaje: 'success' | 'error' | null = null;
  disabled: any;
  // ✅ mapOptions aquí como propiedad de la clase, NO dentro de un método
  mapOptions: google.maps.MapOptions = {
    mapId: '79b5d5023e425c0258a2aefa'
  };

  // fecha 
  hoy = new Date();

  opciones: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  };

  fechaFormateada: string;
  

  constructor(private asistenciaService: ServicioObrero, private router: Router) {
    let formatted = this.hoy.toLocaleDateString('es-ES', this.opciones);
    // Capitalizar primera letra
    this.fechaFormateada = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  ngOnInit() {
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      alert('Usuario no encontrado');
      return;
    }
    const usuario = JSON.parse(userData);
    this.userId = usuario.userId;
    if (!usuario.userId) {
      console.error("ID inválido:", usuario);
      return;
    }

    this.startTracking();
    this.verificarAsistencia(usuario.userId);

  }

  startTracking() {
    if (navigator.geolocation) {

      this.watchId = navigator.geolocation.watchPosition(
        (position) => {

          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          this.center = coords;
          this.markerPosition = coords;
          this.ultimaUbicacion = coords;

          // 🔥 Forzar que el mapa se centre
          if (this.map) {
            this.map.panTo(coords);
          }

        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
        },
        {
          enableHighAccuracy: true
        }
      );
    }
  }

  ngOnDestroy() {
    if (this.watchId !== undefined) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  enviarAsistencia() {
    if (!this.ultimaUbicacion) {
      alert('Esperando ubicación GPS...');
      return;
    }

    const body = {
      usuarioId: this.userId,
      latitud: this.ultimaUbicacion.lat,
      longitud: this.ultimaUbicacion.lng
    };
    console.log('Enviando datos de asistencia:', body);

    this.asistenciaService.enviarUbicacion(body).subscribe({

      next: (response) => {
        this.mensajeRespuesta = response;
        this.tipoMensaje = 'success';
        this.verificarAsistencia(this.userId);
      },
      error: (error) => {
        this.mensajeRespuesta = error.error; // el mensaje que manda el backend
        this.tipoMensaje = 'error';
      }
    });
  }

  verificarAsistencia(usuarioId: number) {

    this.asistenciaService.verificarAsistencia(usuarioId).subscribe({
      next: (response) => {
        console.log('Estado de asistencia:', response);

        if (response.yaMarco === true) {
          this.estadoAsistencia = response;
        }

      },
      error: (error) => {
        console.error('Error al verificar asistencia:', error);
      }
    });

  }

  cerrarSesion() {
    this.router.navigateByUrl('/').then(() => {
      sessionStorage.clear();
    });
  }
}

