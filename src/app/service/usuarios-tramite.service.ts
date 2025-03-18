import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioTramiteModel } from '../models/usuario_tramite.model';
import { DataService } from './data.service';


const base_url = environment.URL_BASE

@Injectable({
  providedIn: 'root'
})
export class UsuariosTramiteService {

  usuario_tramite: UsuarioTramiteModel = new UsuarioTramiteModel();
  constructor(
    private readonly dataService: DataService,
    private readonly http: HttpClient
  ) { }

  guardarUsuarioTramite(data: Partial<UsuarioTramiteModel>){    
    this.usuario_tramite={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${base_url}/usuarios-tramite`, this.usuario_tramite, { headers });
  }

  buscarByNumTramiteActivo(num_tramite: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[usuarioTramite:UsuarioTramiteModel[], total: number]>(`${base_url}/usuarios-tramite/buscar-xnumtramite-activo?numero_tramite=${num_tramite}`, { headers })
  }

  buscarMediadorByNumTramiteActivo(num_tramite: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<UsuarioTramiteModel>(`${base_url}/usuarios-tramite/buscar-mediador-xnumtramite-activo?numero_tramite=${num_tramite}`, { headers })
  }

  listarTramitesAsignadosTodos(){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[usuarioTramite:UsuarioTramiteModel[], total: number]>(`${base_url}/usuarios-tramite`, { headers })
  }

  listarTramitesAsignadosXUsuario(id_usuariox: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[tramite:UsuarioTramiteModel[], total: number]>(`${base_url}/usuarios-tramite/buscar-xusuario-asignados?id_usuario=${id_usuariox}`, { headers })
  }

  listarTramitesAsignadosXUsuarioAdministrado(id_usuariox: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[tramite:UsuarioTramiteModel[], total: number]>(`${base_url}/usuarios-tramite/buscar-xusuarioadministrado-asignados?id_usuario=${id_usuariox}`, { headers })
  }

  listarTramitesFinalizadosXUsuario(id_usuariox: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[tramite:UsuarioTramiteModel[], total: number]>(`${base_url}/usuarios-tramite/buscar-xusuario-finalizados?id_usuario=${id_usuariox}`, { headers })
  }

  listarTramitesFinalizadosXUsuarioXAnio(id_usuariox: number, anio: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[tramite:UsuarioTramiteModel[], total: number]>(`${base_url}/usuarios-tramite/buscar-xusuario-finalizados-xanio?id_usuario=${id_usuariox}&anio=${anio}`, { headers })
  }

  listarFinalizadosXUsuarioAdministrado(id_usuariox: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[tramite:UsuarioTramiteModel[], total: number]>(`${base_url}/usuarios-tramite/buscar-xusuarioadministrado-finalizados?id_usuario=${id_usuariox}`, { headers })
  }

  listarFinalizadosXUsuarioAdministradoXAnio(id_usuariox: number, anio: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[tramite:UsuarioTramiteModel[], total: number]>(`${base_url}/usuarios-tramite/buscar-xusuarioadministrado-finalizados-xanio?id_usuario=${id_usuariox}&anio=${anio}`, { headers })
  }

  listarTramitesAsignadosXCiudadano(id_ciudadanox: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[tramite:UsuarioTramiteModel[], total: number]>(`${base_url}/usuarios-tramite/buscar-xciudadano?id_ciudadano=${id_ciudadanox}`, { headers })
  }

  deshabilitarUsuarioTramite(id_usuario_tramite:number) {
    let data: Partial<UsuarioTramiteModel>;
    
    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/usuarios-tramite/deshabilitar-usuario?id_usuario_tramite=${id_usuario_tramite}`,data, { headers });
  }

  
}
