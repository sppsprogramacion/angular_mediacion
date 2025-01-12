import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DepartamentoModel } from '../models/departamento.model';
import { DataService } from './data.service';


const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

  departamento: DepartamentoModel = new DepartamentoModel();

  constructor(
    private readonly dataService: DataService,
    private readonly http: HttpClient
  ) { }

  guardarDepartamento(data: Partial<DepartamentoModel>){    
    this.departamento={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${base_url}/departamentos`, this.departamento, {headers});
  }

  guardarEdicionDepartamento(id: number, data: Partial<DepartamentoModel>){
        
    this.departamento={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/departamentos/${id}`, this.departamento, {headers});
  }

  listarActualizarDepartamentosConCentros(){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<DepartamentoModel[]>(`${base_url}/departamentos/actualizar-con-centro-mediacion`, {headers})
  }

  listarDepartamentoTodos(){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[departamento:DepartamentoModel[], total: number]>(`${base_url}/departamentos`, {headers})
  }

  listarDepartamentosConCentros(){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<DepartamentoModel[]>(`${base_url}/departamentos/con-centro-mediacion`, {headers})
  }
}
