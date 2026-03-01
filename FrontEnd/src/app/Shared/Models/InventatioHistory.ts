export interface InventoryHistory {
  motivo: 'ENTRADA' | 'SALIDA';
  descripcion: string;
  fechaActividad: string;
}