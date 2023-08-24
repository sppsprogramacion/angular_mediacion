import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CiudadanoModel } from '../models/ciudadano.model';
import { TramiteModel } from '../models/tramite.model';
import { TotalesTramitesModel } from '../models/totales_tramites.model';

const base_url = environment.URL_BASE

@Injectable({
  providedIn: 'root'
})
export class TramitesService {
  tramite: TramiteModel = new TramiteModel();
  constructor(
    private readonly http: HttpClient
  ) { }

  guardarTramite(data: Partial<TramiteModel>){    
    this.tramite={...data};
    return this.http.post(`${base_url}/tramites/nuevo-tramite`, this.tramite);
  }

  listarTramitesTodos(){
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites`)
  }

  listarTramitesXCiudadano(id_ciudadano: number){
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/buscar-xciudadano?id_ciudadano=${id_ciudadano}`)
  }

  listarTramitesNuevos( id_ciudadano: number){
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/nuevos-xciudadano?id_ciudadano=${id_ciudadano}`)
  }

  listarTramitesNuevosAdministrador( id_usuario: number){
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/nuevos-xusuario?id_usuario=${id_usuario}`)
  }

  listarTramitesAsignadosMediador(id_ciudadano: number){
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/asignados-mediador?id_ciudadano=${id_ciudadano}`)
  }

  listarTramitesFinalizados(){
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/finalizados`)
  }

  contarTotalesTramitesXEstado(){
    return this.http.get<TotalesTramitesModel>(`${base_url}/tramites/totales-tramites`)
  }
}
