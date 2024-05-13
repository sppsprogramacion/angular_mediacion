import { Injectable } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { ResultadoAudienciaModel } from '../models/resultadoAudiencia.model';

const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class ResultadosAudienciaService {

  resultadoAudiencia: ResultadoAudienciaModel = new ResultadoAudienciaModel();

  constructor(
    private readonly http: HttpClient
  ) { }

  guardarResultadoAudiencia(data: Partial<ResultadoAudienciaModel>){    
    this.resultadoAudiencia={...data};
    return this.http.post(`${base_url}/resultados-audiencia`, this.resultadoAudiencia);
  }

  guardarEdicionResultadoAudiencia(id: number, data: Partial<ResultadoAudienciaModel>){    
    this.resultadoAudiencia={...data};
    return this.http.patch(`${base_url}/resultados-audiencia/${id}`, this.resultadoAudiencia);
  }

  listarResultadoAudienciaTodos(){
    return this.http.get<[resultadoAudiencia:ResultadoAudienciaModel[], total: number]>(`${base_url}/resultados-audiencia`)
  }
}
