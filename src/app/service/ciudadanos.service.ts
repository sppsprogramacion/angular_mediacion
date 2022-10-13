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


  listarCiudadanosTodos(){
    return this.http.get<[ciudadano:CiudadanoModel[], total: number]>(`${base_url}/ciudadanos`)
  }
}
