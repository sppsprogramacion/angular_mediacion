import { Injectable } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { ResultadoAudienciaModel } from '../models/resultadoAudiencia.model';
import { DataService } from './data.service';

const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class ResultadosAudienciaService {

  resultadoAudiencia: ResultadoAudienciaModel = new ResultadoAudienciaModel();

  constructor(
    private readonly dataService: DataService,
    private readonly http: HttpClient
  ) { }

  guardarResultadoAudiencia(data: Partial<ResultadoAudienciaModel>){    
    this.resultadoAudiencia={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${base_url}/resultados-audiencia`, this.resultadoAudiencia, {headers});
  }

  guardarEdicionResultadoAudiencia(id: number, data: Partial<ResultadoAudienciaModel>){    
    this.resultadoAudiencia={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/resultados-audiencia/${id}`, this.resultadoAudiencia, {headers});
  }

  listarResultadoAudienciaTodos(){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[resultadoAudiencia:ResultadoAudienciaModel[], total: number]>(`${base_url}/resultados-audiencia`, {headers})
  }
}
