import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { ObjetoModel } from '../models/objeto.model';
import { DataService } from './data.service';


const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class ObjetosService {

  objeto: ObjetoModel = new ObjetoModel();
  constructor(
    private readonly dataService: DataService,
    private readonly http: HttpClient
  ) { }

  guardarObjeto(data: Partial<ObjetoModel>){    
    this.objeto={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${base_url}/objetos`, this.objeto, {headers});
  }

  guardarEdicionObjeto(id: number, data: Partial<ObjetoModel>){    
    this.objeto={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/objetos/${id}`, this.objeto, {headers});
  }

  listarObjetoTodos(){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[objeto:ObjetoModel[], total: number]>(`${base_url}/objetos`, {headers})
  }
}
