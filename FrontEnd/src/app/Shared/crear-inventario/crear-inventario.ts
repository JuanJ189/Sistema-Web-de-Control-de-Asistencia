import { Component, EventEmitter, Output } from '@angular/core';
import { InventarioServices } from '../../Core/Services/Inventario/inventario-services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-inventario',
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-inventario.html',
  styleUrl: './crear-inventario.css',
})
export class CrearInventario {
  @Output() inventarioGuardado = new EventEmitter<void>();

  mostrarModal: boolean = false;
  modoEdicion: boolean = false;
  inventarioEditandoId: number | null = null;

  nuevoItem = {
    nombre: '',
    descripcion: '',
    stock: 0,
    maxStock: 0
  };

  errorMessage: string = '';

  constructor(private service: InventarioServices) { }

  abrirModal() {
    this.modoEdicion = false;
    this.mostrarModal = true;
  }

  abrirModalEdicion(item: any) {
    this.modoEdicion = true;
    this.inventarioEditandoId = item.id;
    this.nuevoItem = {
      nombre: item.nombre,
      descripcion: item.descripcion,
      stock: item.stock,
      maxStock: item.maxStock
    };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.modoEdicion = false;
    this.inventarioEditandoId = null;
    this.nuevoItem = {
      nombre: '',
      descripcion: '',
      stock: 0,
      maxStock: 0
    };
  }

  soloNumerosPositivos(event: KeyboardEvent): boolean {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
      return false;
    }
    return true;
  }

  validarStock() {
    if (this.nuevoItem.stock < 1) this.nuevoItem.stock = 1;
    if (this.nuevoItem.maxStock < 1) this.nuevoItem.maxStock = 1;
    // stock actual no puede ser mayor al máximo
    if (this.nuevoItem.stock > this.nuevoItem.maxStock) {
      this.nuevoItem.stock = this.nuevoItem.maxStock;
    }
  }

  guardarItem() {
    // Validar campos obligatorios
    if (!this.nuevoItem.nombre.trim()) {
      this.errorMessage = 'El nombre es obligatorio.';
      return;
    }
    if (!this.nuevoItem.descripcion.trim()) {
      this.errorMessage = 'La descripción es obligatoria.';
      return;
    }
    if (this.nuevoItem.stock < 1) {
      this.errorMessage = 'El stock actual debe ser mayor a 0.';
      return;
    }
    if (this.nuevoItem.maxStock < 1) {
      this.errorMessage = 'El stock máximo debe ser mayor a 0.';
      return;
    }

    this.errorMessage = '';

    if (this.modoEdicion && this.inventarioEditandoId) {
      this.service.actualizarInventario(this.inventarioEditandoId, this.nuevoItem).subscribe({
        next: () => { this.cerrarModal(); this.inventarioGuardado.emit(); },
        error: (err: any) => console.error('Error al actualizar item:', err)
      });
    } else {
      this.service.crearInventario(this.nuevoItem).subscribe({
        next: () => { this.cerrarModal(); this.inventarioGuardado.emit(); },
        error: (err: any) => console.error('Error al crear item:', err)
      });
    }
  }
}
