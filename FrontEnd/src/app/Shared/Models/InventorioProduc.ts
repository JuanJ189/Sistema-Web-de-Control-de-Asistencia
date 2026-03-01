export interface Inventory {
  id: number;
  nombre: string;
  descripcion: string;
  stock: number;
  maxStock: number;
  porcentajeCantidad: number;
  estado: 'Nivel Crítico' | 'Stock Bajo' | 'Saludable';
}