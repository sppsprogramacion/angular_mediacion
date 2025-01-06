import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SexoModel } from '../models/sexo.model';
import { DataService } from './data.service';


const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class SexoService {

  sexo: SexoModel = new SexoModel();

  constructor(
    private readonly dataService: DataService,
    private readonly http: HttpClient
  ) { }

  guardarSexo(data: Partial<SexoModel>){    
    this.sexo={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${base_url}/sexo`, this.sexo, {headers});
  }

  guardarEdicionSexo(id: number, data: Partial<SexoModel>){    
    this.sexo={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/sexo/${id}`, this.sexo, {headers});
  }

  listarSexoTodos(){
    return this.http.get<[sexo:SexoModel[], total: number]>(`${base_url}/sexo`)
  }
}
