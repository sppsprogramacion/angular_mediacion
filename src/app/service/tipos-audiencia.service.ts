import { Injectable } from '@angular/core';
import { CategoriaModel } from '../models/categoria.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ModalidadModel } from '../models/modalidad.model';
import { TipoAudienciaModel } from '../models/tipo_audiencia.model';
import { DataService } from './data.service';

const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class TiposAudienciaService {

  tiposAudiencia: TipoAudienciaModel = new TipoAudienciaModel();
  constructor(
    private readonly dataService: DataService,
    private readonly http: HttpClient
  ) { }

  guardar(data: Partial<TipoAudienciaModel>){    
    this.tiposAudiencia={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${base_url}/tipos-audiencia`, this.tiposAudiencia, {headers});
  }

  guardarEdicion(id: number, data: Partial<TipoAudienciaModel>){    
    this.tiposAudiencia={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/tipos-audiencia/${id}`, this.tiposAudiencia, {headers});
  }

  listarTodos(){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[tiposAudiencia:TipoAudienciaModel[], total: number]>(`${base_url}/tipos-audiencia`, {headers})
  }
}
