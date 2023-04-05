import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioTramiteModel } from '../models/usuario_tramite.model';


const base_url = environment.URL_BASE

@Injectable({
  providedIn: 'root'
})
export class UsuariosTramiteService {

  usuario_tramite: UsuarioTramiteModel = new UsuarioTramiteModel();
  constructor(
    private readonly http: HttpClient
  ) { }

  guardarUsuarioTramite(data: Partial<UsuarioTramiteModel>){    
    this.usuario_tramite={...data};
    return this.http.post(`${base_url}/usuarios-tramite`, this.usuario_tramite);
  }

  buscarByNumTramiteActivo(num_tramite: number){
    return this.http.get<UsuarioTramiteModel>(`${base_url}/usuarios-tramite/buscar-xnumtramite-activo?numero_tramite=${num_tramite}`)
  }

  listarTramitesAsignadosTodos(){
    return this.http.get<[tramite:UsuarioTramiteModel[], total: number]>(`${base_url}/usuarios-tramite`)
  }

  listarTramitesAsignadosXUsuario(id_usuariox: number){
    return this.http.get<[tramite:UsuarioTramiteModel[], total: number]>(`${base_url}/usuarios-tramite/buscar-xusuario?id_usuario=${id_usuariox}`)
  }

  listarTramitesAsignadosXCiudadano(id_ciudadanox: number){
    return this.http.get<[tramite:UsuarioTramiteModel[], total: number]>(`${base_url}/usuarios-tramite/buscar-xciudadano?id_ciudadano=${id_ciudadanox}`)
  }

  
}
