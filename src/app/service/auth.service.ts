import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginModel } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private base_url: string = environment.URL_BASE;

  constructor(
    private readonly http: HttpClient
  ) { }

  loginCiudadano(dataLogin: LoginModel){
    const url= `${this.base_url}/auth/login-ciudadano`;

    return this.http.post(url, dataLogin);
  
  }

  loginUsuario(dataLogin: LoginModel){
    const url= `${this.base_url}/auth/login-usuario`;

    return this.http.post(url, dataLogin);
  
  }
}
