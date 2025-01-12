import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioModel } from '../models/usuario.model';
import { DataService } from './data.service';

const base_url = environment.URL_BASE

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  usuario: UsuarioModel = new UsuarioModel();

  constructor(
    private readonly dataService: DataService,
    private readonly http: HttpClient
  ) { }

  guardarUsuario(data: Partial<UsuarioModel>){    
    this.usuario={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${base_url}/usuarios`, this.usuario, {headers});
  }

  guardarEdicionPerfil(id: number, data: Partial<UsuarioModel>){    
    this.usuario={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/usuarios/editar-perfil/${id}`, this.usuario, {headers});
  }

  guardarEdicionEstado(id: number, data: Partial<UsuarioModel>){    
    this.usuario={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/usuarios/editar-estado/${id}`, this.usuario, {headers});
  }

  guardarCambiarContrasenia(id: number, data: any){    
    
    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/usuarios/cambiar-password/${id}`, data, {headers});
  }

  guardarResetContrasenia(id: number, data: any){    
    
    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/usuarios/reset-password/${id}`, data, {headers});
  }

  buscarXDni(dni: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<UsuarioModel>(`${base_url}/usuarios/buscar-xdni?dni=${dni}`, {headers})
  }

  listarUsuariosTodos(){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[usuario:UsuarioModel[], total: number]>(`${base_url}/usuarios`, {headers})
  }
}
