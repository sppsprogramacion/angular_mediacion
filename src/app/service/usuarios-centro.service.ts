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
    console.log("data en servicio", this.usuarioCentroModel);
    return this.http.post(`${base_url}/usuarios-centros`, this.usuarioCentroModel);
  }

  listarUsuariosXCentro(id_centro:number){
    return this.http.get<[usuarioCentro: UsuarioCentroModel[], total: number]>(`${base_url}/usuarios-centros/buscar-xcentro-mediacion?id_centro=${id_centro}`)
  }

  listarUsuariosActivosXCentro(id_centro:number){
    return this.http.get<[usuarioCentro: UsuarioCentroModel[], total: number]>(`${base_url}/usuarios-centros/buscar-activos-xcentro-mediacion?id_centro=${id_centro}`)
  }

  
}
