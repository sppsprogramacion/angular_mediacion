import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SexoModel } from '../models/sexo.model';


const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class SexoService {

  sexo: SexoModel = new SexoModel();

  constructor(
    private readonly http: HttpClient
  ) { }

  guardarSexo(data: Partial<SexoModel>){    
    this.sexo={...data};
    return this.http.post(`${base_url}/sexo`, this.sexo);
  }

  guardarEdicionSexo(id: number, data: Partial<SexoModel>){    
    this.sexo={...data};
    return this.http.patch(`${base_url}/sexo/${id}`, this.sexo);
  }

  listarSexoTodos(){
    return this.http.get<[sexo:SexoModel[], total: number]>(`${base_url}/sexo`)
  }
}
