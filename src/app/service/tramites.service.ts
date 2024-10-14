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

  guardarFinalizarTramite(num_tramite: number, data: Partial<TramiteModel>){    
    this.tramite={...data};
    return this.http.patch(`${base_url}/tramites/finalizar?numero_tramite=${num_tramite}`, this.tramite);
  }

  buscarTramiteNumTram(num_tramite: number){
    //return this.http.get<TramiteModel>(`${base_url}/tramites/buscar-xnumtramite?numero_tramite=${num_tramite}`)
    return this.http.get<TramiteModel>(`${base_url}/tramites/buscar-xnumtramite?numero_tramite=${num_tramite}`)
  }

  listarTramitesTodos(){
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites`)
  }

  listarTramitesTodosApellidoCiudadano(apellido: string){
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/todos-xapellidociudadano?apellido=${apellido}`)
  }

  listarTramitesTodosDniCiudadano(dni: number){
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/todos-xdniciudadano?numero_dni=${dni}`)
  }

  listarTramitesTodosExpediente(expediente: string){
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/todos-xexpediente?expediente=${expediente}`)
  }

  listarTramitesTodosFecha(fecha_ini: string, fecha_fin: string){
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/todos-xfecha?fecha_ini=${fecha_ini}&fecha_fin=${fecha_fin}`)
  }

  listarTramitesTodosNumeroTramite(numero_tramite: number){
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/todos-xnumtramite?numero_tramite=${numero_tramite}`)
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
