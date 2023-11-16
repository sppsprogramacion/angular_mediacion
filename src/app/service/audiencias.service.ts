import { Injectable } from '@angular/core';
import { CategoriaModel } from '../models/categoria.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AudienciaModel } from '../models/audiencia.model';

const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class AudienciasService {

  audiencia: AudienciaModel = new AudienciaModel();
  constructor(
    private readonly http: HttpClient
  ) { }

  guardarAudiencia(data: Partial<AudienciaModel>){    
    this.audiencia={...data};
    return this.http.post(`${base_url}/audiencias`, this.audiencia);
  }

  guardarEdicionAudiencia(id: number, data: Partial<AudienciaModel>){    
    this.audiencia={...data};
    return this.http.patch(`${base_url}/audiencias/${id}`, this.audiencia);
  }

  listarAudienciasTodos(){
    return this.http.get<[audiencias:AudienciaModel[], total: number]>(`${base_url}/audiencias`)
  }

  listarAudienciasByTramite(num_tramite: number){
    return this.http.get<[audiencias:AudienciaModel[], total: number]>(`${base_url}/audiencias/buscar-xtramite?id_tramite=${num_tramite}`)
  }

  listarAudienciasAbiertasByUsuario(id_usuario: number){
    return this.http.get<[audiencias:AudienciaModel[], total: number]>(`${base_url}/audiencias/buscar-abiertas-xusuario?id_usuario=${id_usuario}`)
  }
}
