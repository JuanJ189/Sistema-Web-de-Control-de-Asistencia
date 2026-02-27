export interface Employee {
  id: number;
  nombreCompleto: string;
  dni: string;
  rol: string;
  cargo: string;
  salarioDiario: number;
  estadoAsistencia: 'A TIEMPO' | 'FALTA';
  estado: boolean;
  createdAt: string;
}