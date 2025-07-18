import { Injectable } from '@angular/core';
import { CategoriaModel } from '../models/categoria.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AudienciaModel } from '../models/audiencia.model';
import { DataService } from './data.service';
import { ConvocadoModel } from '../models/convocado.model';

const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class ConvocadosService {

  convocado: ConvocadoModel = new ConvocadoModel();
  constructor(
    private readonly dataService: DataService,
    private readonly http: HttpClient
  ) { }

  guardarEdicionConvocado(id: number, data: Partial<ConvocadoModel>){    
    this.convocado={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/convocados/${id}`, this.convocado, {headers});
  }

  
}
