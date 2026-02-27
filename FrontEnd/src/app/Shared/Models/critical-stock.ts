export interface CriticalStock {
  id: number;
  nombre: string;
  stockActual: number;
  umbral: number;
  estado: 'Bajo Stock' | 'Advertencia';
}

