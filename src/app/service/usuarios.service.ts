import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioModel } from '../models/usuario.model';

const base_url = environment.URL_BASE

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  usuario: UsuarioModel = new UsuarioModel();
  constructor(
    private readonly http: HttpClient
  ) { }

  guardarUsuario(data: Partial<UsuarioModel>){    
    this.usuario={...data};
    return this.http.post(`${base_url}/usuarios`, this.usuario);
  }

  listarUsuariosTodos(){
    return this.http.get<[usuario:UsuarioModel[], total: number]>(`${base_url}/usuarios`)
  }
}
