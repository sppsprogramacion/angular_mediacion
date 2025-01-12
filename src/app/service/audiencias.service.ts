import { Injectable } from '@angular/core';
import { CategoriaModel } from '../models/categoria.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AudienciaModel } from '../models/audiencia.model';
import { DataService } from './data.service';

const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class AudienciasService {

  audiencia: AudienciaModel = new AudienciaModel();
  constructor(
    private readonly dataService: DataService,
    private readonly http: HttpClient
  ) { }

  guardarAudiencia(data: Partial<AudienciaModel>){    
    this.audiencia={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${base_url}/audiencias`, this.audiencia, { headers });
  }

  guardarAudienciaCerrar(id: number, data: Partial<AudienciaModel>){    
    this.audiencia={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/audiencias/resultado/${id}`, this.audiencia, {headers});
  }

  guardarEdicionAudiencia(id: number, data: Partial<AudienciaModel>){    
    this.audiencia={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/audiencias/${id}`, this.audiencia, {headers});
  }

  listarAudienciasTodos(){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[audiencias:AudienciaModel[], total: number]>(`${base_url}/audiencias`, {headers})
  }

  listarAudienciasByTramite(num_tramite: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[audiencias:AudienciaModel[], total: number]>(`${base_url}/audiencias/buscar-xtramite?id_tramite=${num_tramite}`, {headers})
  }

  listarAudienciasAbiertasByUsuario(id_usuario: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[audiencias:AudienciaModel[], total: number]>(`${base_url}/audiencias/buscar-abiertas-xusuario?id_usuario=${id_usuario}`, {headers})
  }
}
