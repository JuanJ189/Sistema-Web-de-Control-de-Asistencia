import { Component } from '@angular/core';
import { DashboardSummary } from '../../../Shared/Models/dashboardsumary';
import { EnpointsDashboard } from '../../../Core/Services/DashBoardEnpoints/enpoints-dashboard';
import { MaterialStates } from '../../../Shared/Models/material-states';
import { CommonModule } from '@angular/common';
import { CriticalStock } from '../../../Shared/Models/critical-stock';

@Component({
  selector: 'app-panel',
  imports: [CommonModule],
  templateUrl: './panel.html',
  styleUrl: './panel.css',
})
export class Panel {
  // Propiedades para el summary
  sumary: DashboardSummary = {
    asistenciaHoy: 0,
    totalEmpleados: 0,
    penalizaciones: 0
  };
  asistenciaPercent: number = 0;
  // Propiedad para los estados de materiales

  materiales: MaterialStates[] = [];

  // Propiedad para el stock crítico
  criticalStock: CriticalStock[] = [];

  // Propiedades para el SVG circle
  readonly circleRadius = 34;
  readonly circumference = 2 * Math.PI * this.circleRadius; // ≈ 213.6

  constructor(private dashboardService: EnpointsDashboard) { }

  ngOnInit(): void {
    this.dashboardService.getDashboardSummary().subscribe({
      next: (data) => {
        this.sumary = data;
        this.asistenciaPercent = Math.round((data.asistenciaHoy / data.totalEmpleados) * 100);
      },
      error: (err) => {
        console.error('Error al obtener el summary:', err);
      }
    });

    this.dashboardService.getMaterialStates().subscribe({
      next: (data) => this.materiales = data,
      error: (err) => console.error('Error al obtener materiales:', err)
    });

    this.dashboardService.getCriticalStock().subscribe({
      next: (data) => this.criticalStock = data,
      error: (err) => console.error('Error al obtener stock crítico:', err)
    });

  }

  // Calcula el stroke-dashoffset según el porcentaje
  get strokeDashoffset(): number {
    return this.circumference - (this.asistenciaPercent / 100) * this.circumference;
  }
  // Método para obtener las clases CSS según el estado del material
  getEstadoClasses(estado: string): { dot: string, text: string } {
    switch (estado) {
      case 'CRÍTICO':
        return {
          dot: 'size-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]',
          text: 'text-xs font-bold text-red-500'
        };
      case 'ADVERTENCIA':
        return {
          dot: 'size-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]',
          text: 'text-xs font-bold text-yellow-600'
        };
      case 'SALUDABLE':
      default:
        return {
          dot: 'size-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]',
          text: 'text-xs font-bold text-green-600'
        };
    }
  }
  // Método para obtener las clases CSS según el estado del stock crítico
  getStockEstadoClasses(estado: string): { bg: string, text: string } {
    switch (estado) {
      case 'Bajo Stock':
        return { bg: 'bg-red-100', text: 'text-red-700' };
      case 'Advertencia':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
      default:
        return { bg: 'bg-red-100', text: 'text-red-700' };
    }
  }
}
