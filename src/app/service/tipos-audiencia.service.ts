import { Injectable } from '@angular/core';
import { CategoriaModel } from '../models/categoria.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ModalidadModel } from '../models/modalidad.model';
import { TipoAudienciaModel } from '../models/tipo_audiencia.model';

const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class TiposAudienciaService {

  tiposAudiencia: TipoAudienciaModel = new TipoAudienciaModel();
  constructor(
    private readonly http: HttpClient
  ) { }

  guardar(data: Partial<TipoAudienciaModel>){    
    this.tiposAudiencia={...data};
    return this.http.post(`${base_url}/tipos-audiencia`, this.tiposAudiencia);
  }

  guardarEdicion(id: number, data: Partial<TipoAudienciaModel>){    
    this.tiposAudiencia={...data};
    return this.http.patch(`${base_url}/tipos-audiencia/${id}`, this.tiposAudiencia);
  }

  listarTodos(){
    return this.http.get<[tiposAudiencia:TipoAudienciaModel[], total: number]>(`${base_url}/tipos-audiencia`)
  }
}
