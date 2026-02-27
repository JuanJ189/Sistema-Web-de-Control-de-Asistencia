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

  guardarEmpleado() {
    if (this.modoEdicion && this.empleadoEditandoId) {
      this.dashboardService.editarEmpleado(this.empleadoEditandoId, this.nuevoEmpleado).subscribe({
        next: () => {
          this.cerrarModal();
          this.empleadoCreado.emit();
        },
        error: (err: any) => console.error('Error al editar empleado:', err)
      });
    } else {
      this.dashboardService.crearEmpleado(this.nuevoEmpleado).subscribe({
        next: () => {
          this.cerrarModal();
          this.empleadoCreado.emit();
        },
        error: (err: any) => console.error('Error al crear empleado:', err)
      });
    }
  }
}