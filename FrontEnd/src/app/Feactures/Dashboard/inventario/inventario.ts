import { Component, OnInit, ViewChild } from '@angular/core';
import { InventorySummary } from '../../../Shared/Models/InventarioSummary';
import { InventarioServices } from '../../../Core/Services/Inventario/inventario-services';
import { Inventory } from '../../../Shared/Models/InventorioProduc';
import { CommonModule } from '@angular/common';
import { CrearInventario } from '../../../Shared/crear-inventario/crear-inventario';
import { FormsModule } from '@angular/forms';
import { InventoryHistory } from '../../../Shared/Models/InventatioHistory';

@Component({
  selector: 'app-inventario',
  imports: [CommonModule, CrearInventario, FormsModule],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class Inventario implements OnInit {

  @ViewChild(CrearInventario) modalInventario!: CrearInventario;

  inventorySummary: InventorySummary = {
    totalArticulos: 0,
    stockBajo: 0,
    stockCritico: 0
  };

  transaccion = {
    materialId: 0,
    tipo: 'ENTRADA',
    cantidad: 0,
    nota: ''
  };

  // lista de inventario para mostrar en la tabla
  inventory: Inventory[] = [];
  history: InventoryHistory[] = [];


  constructor(private service: InventarioServices) { }

  ngOnInit(): void {

    this.cargarSummary();
    this.cargarInventario();
    this.cargarHistory();
  }

  cargarHistory() {
    this.service.getInventoryHistory().subscribe({
      next: (data) => this.history = data,
      error: (err) => console.error('Error al obtener historial:', err)
    });
  }

  cargarSummary() {
    this.service.getInventorySummary().subscribe({
      next: (data) => this.inventorySummary = data,
      error: (err) => console.error('Error al obtener summary:', err)
    });
  }

  cargarInventario() {
    this.service.getInventory().subscribe({
      next: (data) => this.inventory = data,
      error: (err) => console.error('Error al obtener inventario:', err)
    });
  }

  abrirModal() {
    console.log('modalInventario:', this.modalInventario);
    this.modalInventario.abrirModal();
  }

  actualizarProducto(item: Inventory) {
    console.log('modalInventario:', this.modalInventario);
    this.modalInventario.abrirModalEdicion(item);
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'Nivel Crítico': return 'text-red-500';
      case 'Stock Bajo': return 'text-amber-500';
      case 'Saludable': return 'text-emerald-500';
      default: return 'text-slate-500';
    }
  }

  getBarraColor(estado: string): string {
    switch (estado) {
      case 'Nivel Crítico': return 'bg-red-500';
      case 'Stock Bajo': return 'bg-amber-400';
      case 'Saludable': return 'bg-blue-500';
      default: return 'bg-blue-500';
    }
  }

  registrarTransaccion() {
    if (!this.transaccion.materialId || !this.transaccion.cantidad) {
      console.error('Faltan datos');
      return;
    }

    // Buscar el nombre del material seleccionado
    const material = this.inventory.find(item => item.id == this.transaccion.materialId);
    const nombreMaterial = material ? material.nombre : 'Material';

    // Generar nota automática
    const nota = this.transaccion.tipo === 'ENTRADA'
      ? `Entrada de ${nombreMaterial} + ${this.transaccion.cantidad}`
      : `Salida de ${nombreMaterial} - ${this.transaccion.cantidad}`;

    this.service.registrarTransaccion(this.transaccion.materialId, {
      tipo: this.transaccion.tipo,
      cantidad: this.transaccion.cantidad,
      nota: nota
    }).subscribe({
      next: () => {
        this.cargarInventario();
        this.cargarSummary();
        this.cargarHistory();
        this.transaccion = { materialId: 0, tipo: 'ENTRADA', cantidad: 0, nota: '' };
      },
      error: (err) => console.error('Error al registrar transacción:', err)
    });
  }

  seleccionarTipo(tipo: 'ENTRADA' | 'SALIDA') {
    this.transaccion.tipo = tipo;
  }

  getTiempoRelativo(fecha: string): string {
    const ahora = new Date();
    const fechaActividad = new Date(fecha);
    const diferencia = ahora.getTime() - fechaActividad.getTime();

    const minutos = Math.floor(diferencia / 60000);
    const horas = Math.floor(diferencia / 3600000);
    const dias = Math.floor(diferencia / 86400000);
    const meses = Math.floor(dias / 30);
    const años = Math.floor(dias / 365);

    if (minutos < 1) return 'Ahora mismo';
    if (minutos < 60) return `Hace ${minutos} min`;
    if (horas < 24) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    if (dias < 30) return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    if (meses < 12) return `Hace ${meses} mes${meses > 1 ? 'es' : ''}`;
    return `Hace ${años} año${años > 1 ? 's' : ''}`;
  }

  soloNumerosPositivos(event: KeyboardEvent): boolean {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
      return false;
    }
    return true;
  }

  validarCantidad() {
    if (this.transaccion.cantidad < 1) {
      this.transaccion.cantidad = 1;
    }
  }
}
