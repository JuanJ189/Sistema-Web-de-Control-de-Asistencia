import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../Enviroments/Environment';
import { InventorySummary } from '../../../Shared/Models/InventarioSummary';
import { Observable } from 'rxjs';
import { Inventory } from '../../../Shared/Models/InventorioProduc';
import { InventoryHistory } from '../../../Shared/Models/InventatioHistory';

@Injectable({
  providedIn: 'root',
})
export class InventarioServices {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getInventorySummary(): Observable<InventorySummary> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<InventorySummary>(`${this.baseUrl}inventory/summary`, { headers });
  }

  getInventory(): Observable<Inventory[]> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Inventory[]>(`${this.baseUrl}inventory`, { headers });
  }

  crearInventario(body: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post(`${this.baseUrl}inventory`, body, { headers });
  }

  actualizarInventario(id: number, body: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.put(`${this.baseUrl}inventory/${id}`, body, { headers });
  }

  registrarTransaccion(materialId: number, body: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post(`${this.baseUrl}inventory/${materialId}/transaction`, body, { headers });
  }

  getInventoryHistory(): Observable<InventoryHistory[]> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<InventoryHistory[]>(`${this.baseUrl}inventory/history`, { headers });
  }
}
