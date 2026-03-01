import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SevicesEmpleados } from '../../Core/Services/Empleados/sevices-empleados';

@Component({
  selector: 'app-crear-empleado',
  imports: [FormsModule, CommonModule],
  templateUrl: './crear-empleado.html',
  styleUrl: './crear-empleado.css',
})
export class CrearEmpleado {

  @Output() empleadoCreado = new EventEmitter<void>();

  constructor(private dashboardService: SevicesEmpleados) { }

  mostrarModal: boolean = false;
  modoEdicion: boolean = false;
  empleadoEditandoId: number | null = null;

  nuevoEmpleado = {
    nombreCompleto: '',
    dni: '',
    password: '',
    rol: '',
    cargo: '',
    salarioDiario: 0
  };

  abrirModal() {
    this.modoEdicion = false;
    this.mostrarModal = true;
  }

  abrirModalEdicion(empleado: any) {
    this.modoEdicion = true;
    this.empleadoEditandoId = empleado.id;
    this.nuevoEmpleado = {
      nombreCompleto: empleado.nombreCompleto,
      dni: empleado.dni,
      password: '',
      rol: empleado.rol,
      cargo: empleado.cargo,
      salarioDiario: empleado.salarioDiario
    };
    this.mostrarModal = true;
  }


  cerrarModal() {
    this.mostrarModal = false;
    this.modoEdicion = false;
    this.empleadoEditandoId = null;
    this.nuevoEmpleado = {
      nombreCompleto: '',
      dni: '',
      password: '',
      rol: '',
      cargo: '',
      salarioDiario: 0
    };
  }

  errorMessage: string = '';

  guardarEmpleado() {
    if (!this.nuevoEmpleado.nombreCompleto.trim()) {
      this.errorMessage = 'El nombre completo es obligatorio.';
      return;
    }
    if (!this.nuevoEmpleado.dni.trim()) {
      this.errorMessage = 'El DNI es obligatorio.';
      return;
    }
    if (!this.nuevoEmpleado.rol) {
      this.errorMessage = 'Debe seleccionar un rol.';
      return;
    }
    if (!this.nuevoEmpleado.password.trim()) {
      this.errorMessage = 'La contraseña es obligatoria.';
      return;
    }
    if (this.nuevoEmpleado.password.length < 8) {
      this.errorMessage = 'La contraseña debe tener mínimo 8 caracteres.';
      return;
    }
    if (!this.nuevoEmpleado.cargo.trim()) {
      this.errorMessage = 'El cargo es obligatorio.';
      return;
    }
    if (this.nuevoEmpleado.salarioDiario <= 0) {
      this.errorMessage = 'El salario diario debe ser mayor a 0.';
      return;
    }

    this.errorMessage = '';

    if (this.modoEdicion && this.empleadoEditandoId) {
      this.dashboardService.editarEmpleado(this.empleadoEditandoId, this.nuevoEmpleado).subscribe({
        next: () => { this.cerrarModal(); this.empleadoCreado.emit(); },
        error: (err: any) => console.error('Error al editar empleado:', err)
      });
    } else {
      this.dashboardService.crearEmpleado(this.nuevoEmpleado).subscribe({
        next: () => { this.cerrarModal(); this.empleadoCreado.emit(); },
        error: (err: any) => console.error('Error al crear empleado:', err)
      });
    }
  }

  soloNumeros(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  soloNumerosPositivos(event: KeyboardEvent): boolean {
    // bloquea el signo menos
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
      return false;
    }
    return true;
  }

  validarSalario() {
    if (this.nuevoEmpleado.salarioDiario < 1) {
      this.nuevoEmpleado.salarioDiario = 1;
    }
  }
}