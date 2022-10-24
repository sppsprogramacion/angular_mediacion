import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CiudadanoModel } from '../models/ciudadano.model';
import { TramiteModel } from '../models/tramite.model';

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
    return this.http.post(`${base_url}/tramites/prueba-crear`, this.tramite);
  }

  listarTramitesTodos(){
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites`)
  }
}
