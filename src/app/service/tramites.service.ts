import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CiudadanoModel } from '../models/ciudadano.model';
import { TramiteModel } from '../models/tramite.model';
import { TotalesTramitesModel } from '../models/totales_tramites.model';
import { DataService } from './data.service';

const base_url = environment.URL_BASE

@Injectable({
  providedIn: 'root'
})
export class TramitesService {
  tramite: TramiteModel = new TramiteModel();
  constructor(
    private readonly dataService: DataService,
    private readonly http: HttpClient
  ) { }

  guardarTramite(data: Partial<TramiteModel>){    
    this.tramite={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${base_url}/tramites/nuevo-tramite`, this.tramite, { headers });
  }

  guardarFinalizarTramite(num_tramite: number, data: Partial<TramiteModel>){    
    this.tramite={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/tramites/finalizar?numero_tramite=${num_tramite}`, this.tramite, { headers });
  }

  buscarTramiteNumTram(num_tramite: number){
    
    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<TramiteModel>(`${base_url}/tramites/buscar-xnumtramite?numero_tramite=${num_tramite}`, { headers })
  }

  listarTramitesTodos(){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites`, { headers })
  }

  listarTramitesTodosApellidoCiudadano(apellido: string){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/todos-xapellidociudadano?apellido=${apellido}`, { headers })
  }

  listarTramitesTodosDniCiudadano(dni: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/todos-xdniciudadano?numero_dni=${dni}`, { headers })
  }

  listarTramitesTodosExpediente(expediente: string){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/todos-xexpediente?expediente=${expediente}`, { headers })
  }

  listarTramitesTodosFecha(fecha_ini: string, fecha_fin: string){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/todos-xfecha?fecha_ini=${fecha_ini}&fecha_fin=${fecha_fin}`, { headers })
  }

  listarTramitesTodosNumeroTramite(numero_tramite: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/todos-xnumtramite?numero_tramite=${numero_tramite}`, { headers })
  }

  listarTramitesXCiudadano(id_ciudadano: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/buscar-xciudadano?id_ciudadano=${id_ciudadano}`, { headers })
  }

  listarTramitesNuevos( id_ciudadano: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/nuevos-xciudadano?id_ciudadano=${id_ciudadano}`, { headers })
  }

  listarTramitesNuevosAdministrador( id_usuario: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/nuevos-xusuario?id_usuario=${id_usuario}`, { headers })
  }

  listarTramitesAsignadosMediador(id_ciudadano: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/asignados-mediador?id_ciudadano=${id_ciudadano}`, { headers })
  }

  listarTramitesFinalizados(){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/finalizados`, { headers })
  }

  contarTotalesTramitesXEstado(){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<TotalesTramitesModel>(`${base_url}/tramites/totales-tramites`, { headers })
  }
}


