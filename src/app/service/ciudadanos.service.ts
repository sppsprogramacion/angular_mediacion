import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CiudadanoModel } from '../models/ciudadano.model';

const base_url = environment.URL_BASE

@Injectable({
  providedIn: 'root'
})
export class CiudadanosService {
  ciudadano: CiudadanoModel = new CiudadanoModel();
  constructor(
    private readonly http: HttpClient
  ) { }

  guardarCiudadano(data: Partial<CiudadanoModel>){    
    this.ciudadano={...data};
    return this.http.post(`${base_url}/ciudadanos`, this.ciudadano);
  }

  guardarEdicionCiudadano(id: number, data: Partial<CiudadanoModel>){    
    this.ciudadano={...data};
    return this.http.patch(`${base_url}/ciudadanos/${id}`, this.ciudadano);
  }

  listarCiudadanosTodos(){
    return this.http.get<[ciudadano:CiudadanoModel[], total: number]>(`${base_url}/ciudadanos`)
  }

  buscarXDni(dni: number){
    return this.http.get<CiudadanoModel>(`${base_url}/ciudadanos/buscar-xdni?dni=${dni}`)
  }

  buscarXId(id: number){
    return this.http.get<CiudadanoModel>(`${base_url}/ciudadanos/${id}`)
  }

  

}
