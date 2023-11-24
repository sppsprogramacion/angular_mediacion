import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { ObjetoModel } from '../models/objeto.model';


const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class ObjetosService {

  objeto: ObjetoModel = new ObjetoModel();
  constructor(
    private readonly http: HttpClient
  ) { }

  guardarObjeto(data: Partial<ObjetoModel>){    
    this.objeto={...data};

    return this.http.post(`${base_url}/objetos`, this.objeto);
  }

  guardarEdicionObjeto(id: number, data: Partial<ObjetoModel>){    
    this.objeto={...data};
    return this.http.patch(`${base_url}/objetos/${id}`, this.objeto);
  }

  listarObjetoTodos(){
    return this.http.get<[objeto:ObjetoModel[], total: number]>(`${base_url}/objetos`)
  }
}
