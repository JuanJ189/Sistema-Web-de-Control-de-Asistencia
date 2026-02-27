import { Component, ViewChild } from '@angular/core';
import { EmployeesSummary } from '../../../Shared/Models/EmployeesSummary';
import { SevicesEmpleados } from '../../../Core/Services/Empleados/sevices-empleados';
import { Employee } from '../../../Shared/Models/Empleado';
import { CommonModule } from '@angular/common';
import { CrearEmpleado } from '../../../Shared/crear-empleado/crear-empleado';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-empleados',
  imports: [CommonModule, CrearEmpleado, FormsModule],
  templateUrl: './empleados.html',
  styleUrl: './empleados.css',
})
export class Empleados {
  // Aquí puedes definir las propiedades para almacenar los datos de empleados
  employeesSummary: EmployeesSummary = {
    empleadosTotales: 0,
    empleadosActivos: 0,
    nominaDiaria: 0
  };

  @ViewChild(CrearEmpleado) modalCrear!: CrearEmpleado;

  employees: Employee[] = [];

  textoBusqueda: string = '';

  constructor(private dashboardService: SevicesEmpleados) { }
  ngOnInit(): void {
    this.dashboardService.getEmployeesSummary().subscribe({
      next: (data) => this.employeesSummary = data,
      error: (err) => console.error('Error al obtener employees summary:', err)
    });

    this.cargarEmpleados();

  }

  abrirModal() {
    this.modalCrear.abrirModal(); // ← llama al método del hijo
  }

  editarEmpleado(empleado: Employee) {
    this.modalCrear.abrirModalEdicion(empleado);
  }

  cargarEmpleados() {
    this.dashboardService.getEmployees().subscribe({
      next: (data) => this.employees = data,
      error: (err) => console.error('Error al obtener empleados:', err)
    });
  }

  getInitials(nombreCompleto: string): string {
    return nombreCompleto
      .split(' ')
      .slice(0, 2)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }

  toggleEmpleado(empleado: Employee) {
    this.dashboardService.toggleEmpleado(empleado.id).subscribe({
      next: () => this.cargarEmpleados(),
      error: (err) => console.error('Error al cambiar estado del empleado:', err)
    });
  }

  get empleadosFiltrados(): Employee[] {
    if (!this.textoBusqueda.trim()) return this.employees;
    const texto = this.textoBusqueda.toLowerCase();
    return this.employees.filter(emp =>
      emp.nombreCompleto.toLowerCase().includes(texto) ||
      emp.cargo.toLowerCase().includes(texto) ||
      emp.dni.toLowerCase().includes(texto)
    );
  }

}
