import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../Enviroments/Environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserLogin } from '../../Shared/Models/UserLoin';

@Injectable({
  providedIn: 'root',
})
export class Account {
  BaseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  
  CurrentUser = signal<UserLogin | null>(null);

  Login(values: any ){
    let params = new HttpParams();
    params = params.append('useCookies', true);
    return this.http.post<UserLogin>(this.BaseUrl + 'login', values, { params });
  }

}


