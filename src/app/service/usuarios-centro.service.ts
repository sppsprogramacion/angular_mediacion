import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioCentroModel } from '../models/usuario_centro.model ';
import { HttpClient } from '@angular/common/http';

const base_url = environment.URL_BASE

@Injectable({
  providedIn: 'root'
})
export class UsuariosCentroService {

  usuarioCentroModel: UsuarioCentroModel = new UsuarioCentroModel;

  constructor(
    private readonly http: HttpClient
  ) { }

  guardarUsuarioCentro(data: Partial<UsuarioCentroModel>){    
    this.usuarioCentroModel={...data};
    return this.http.post(`${base_url}/usuarios-centros`, this.usuarioCentroModel);
  }

  deshabilitarUsuarioCentro(id_usuario_centro:number) {
    let data: Partial<UsuarioCentroModel>;
    
    let habilitado: boolean = false;
    return this.http.put(`${base_url}/usuarios-centros/deshabilitar-usuario?id_usuario_centro=${id_usuario_centro}`,data);
  }

  listarUsuariosXCentro(id_centro:number){
    console.log("ide centro en servicio", id_centro);
    return this.http.get<[usuarioCentro: UsuarioCentroModel[], total: number]>(`${base_url}/usuarios-centros/buscar-xcentro-mediacion?id_centro=${id_centro}`)
  }

  listarUsuariosActivosXCentro(id_centro:number){
    return this.http.get<[usuarioCentro: UsuarioCentroModel[], total: number]>(`${base_url}/usuarios-centros/buscar-activos-xcentro-mediacion?id_centro=${id_centro}`)
  }

  listarCentrosActivosXUsuario(id_usuario:number){
    return this.http.get<[usuarioCentro: UsuarioCentroModel[], total: number]>(`${base_url}/usuarios-centros/buscar-centros-activos-xusuario?id_usuario=${id_usuario}`)
  }
  
}
