import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioCentroModel } from '../models/usuario_centro.model ';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from './data.service';

const base_url = environment.URL_BASE

@Injectable({
  providedIn: 'root'
})
export class UsuariosCentroService {

  usuarioCentroModel: UsuarioCentroModel = new UsuarioCentroModel;

  constructor(
    private readonly dataService: DataService,
    private readonly http: HttpClient
  ) { }

  guardarUsuarioCentro(data: Partial<UsuarioCentroModel>){    
    this.usuarioCentroModel={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${base_url}/usuarios-centros`, this.usuarioCentroModel, {headers});
  }

  deshabilitarUsuarioCentro(id_usuario_centro:number) {
    let data: Partial<UsuarioCentroModel>;
    
    let habilitado: boolean = false;

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/usuarios-centros/deshabilitar-usuario?id_usuario_centro=${id_usuario_centro}`,data, {headers});
  }

  listarUsuariosXCentro(id_centro:number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[usuarioCentro: UsuarioCentroModel[], total: number]>(`${base_url}/usuarios-centros/buscar-xcentro-mediacion?id_centro=${id_centro}`, {headers})
  }

  listarUsuariosActivosXCentro(id_centro:number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[usuarioCentro: UsuarioCentroModel[], total: number]>(`${base_url}/usuarios-centros/buscar-activos-xcentro-mediacion?id_centro=${id_centro}`, {headers})
  }

  listarCentrosActivosXUsuario(id_usuario:number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[usuarioCentro: UsuarioCentroModel[], total: number]>(`${base_url}/usuarios-centros/buscar-centros-activos-xusuario?id_usuario=${id_usuario}`, {headers})
  }
  
}
