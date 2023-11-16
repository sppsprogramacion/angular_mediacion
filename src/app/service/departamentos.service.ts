import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DepartamentoModel } from '../models/departamento.model';


const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

  departamento: DepartamentoModel = new DepartamentoModel();

  constructor(
    private readonly http: HttpClient
  ) { }

  guardarDepartamento(data: Partial<DepartamentoModel>){    
    this.departamento={...data};
    return this.http.post(`${base_url}/departamentos`, this.departamento);
  }

  guardarEdicionDepartamento(id: number, data: Partial<DepartamentoModel>){    
    this.departamento={...data};
    return this.http.patch(`${base_url}/departamentos/${id}`, this.departamento);
  }

  listarDepartamentoTodos(){
    return this.http.get<[departamento:DepartamentoModel[], total: number]>(`${base_url}/departamentos`)
  }
}
