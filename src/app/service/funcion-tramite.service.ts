import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FuncionTtramiteModel } from '../models/funcion_tramite.model';
import { DataService } from './data.service';

const base_url = environment.URL_BASE

@Injectable({
  providedIn: 'root'
})
export class FuncionTramiteService {

  funcionTramite: FuncionTtramiteModel = new FuncionTtramiteModel();
  constructor(
    private readonly dataService: DataService,
    private readonly http: HttpClient
  ) { }

  guardarFuncionTramite(data: Partial<FuncionTtramiteModel>){    
    this.funcionTramite={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${base_url}/funcion-tramite`, this.funcionTramite, {headers});
  }

  listarFuncionTramitesTodos(){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[funcionTramite:FuncionTtramiteModel[], total: number]>(`${base_url}/funcion-tramite`, {headers})
  }

  
}
