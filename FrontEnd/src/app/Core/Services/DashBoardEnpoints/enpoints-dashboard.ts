import { Injectable } from '@angular/core';
import { environment } from '../../../Enviroments/Environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DashboardSummary } from '../../../Shared/Models/dashboardsumary';
import { Observable } from 'rxjs';
import { MaterialStates } from '../../../Shared/Models/material-states';
import { CriticalStock } from '../../../Shared/Models/critical-stock';

@Injectable({
  providedIn: 'root',
})
export class EnpointsDashboard {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getDashboardSummary(): Observable<DashboardSummary> {
    const token = sessionStorage.getItem('token'); // ajusta la key según tu app
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<DashboardSummary>(`${this.baseUrl}dashboard/summary`, { headers });
  }

  getMaterialStates(): Observable<MaterialStates[]> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<MaterialStates[]>(`${this.baseUrl}dashboard/material-states`, { headers });
  }

  getCriticalStock(): Observable<CriticalStock[]> {
  const token = sessionStorage.getItem('token');
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  return this.http.get<CriticalStock[]>(`${this.baseUrl}dashboard/critical-stock`, { headers });
}
}
