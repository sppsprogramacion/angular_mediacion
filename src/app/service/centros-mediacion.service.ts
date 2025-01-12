import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CentroMediacionModel } from '../models/centro_mediacion.model';
import { DataService } from './data.service';

const base_url = environment.URL_BASE

@Injectable({
  providedIn: 'root'
})
export class CentrosMediacionService {

  centroMediacion: CentroMediacionModel = new CentroMediacionModel();
  constructor(
    private readonly dataService: DataService,
    private readonly http: HttpClient
  ) { }

  guardarCentroMediacion(data: Partial<CentroMediacionModel>){    
    this.centroMediacion={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${base_url}/centros-mediacion`, this.centroMediacion, {headers});
  }

  guardarEdicionCentroMediacion(id: number, data: Partial<CentroMediacionModel>){    
    this.centroMediacion={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/centros-mediacion/${id}`, this.centroMediacion, {headers});
  }

  listarCentroMediacionTodos(){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[centros:CentroMediacionModel[], total: number]>(`${base_url}/centros-mediacion`, {headers})
  }

  listarCentroMediacionXDepartamento(id_departamento: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[centros:CentroMediacionModel[], total: number]>(`${base_url}/centros-mediacion/buscar-xdepartamento?id_departamento=${id_departamento}`, {headers})
  }

  
}
