import { Injectable } from '@angular/core';
import { EmployeesSummary } from '../../../Shared/Models/EmployeesSummary';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../Enviroments/Environment';
import { Observable } from 'rxjs';
import { Employee } from '../../../Shared/Models/Empleado';

@Injectable({
  providedIn: 'root',
})
export class SevicesEmpleados {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getEmployeesSummary(): Observable<EmployeesSummary> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<EmployeesSummary>(`${this.baseUrl}employees/summary`, { headers });
  }

  getEmployees(): Observable<Employee[]> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Employee[]>(`${this.baseUrl}employees`, { headers });
  }

  crearEmpleado(body: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post(`${this.baseUrl}register`, body, { headers });
  }

  editarEmpleado(id: number, body: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.put(`${this.baseUrl}employees/${id}`, body, { headers });
  }

  toggleEmpleado(id: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.put(`${this.baseUrl}employees/${id}/toggle`, null, {
      headers,
      responseType: 'text' // ← agrega esto
    });
  }
}
