import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MunicipioModel } from '../models/municipio.model';



const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class MunicipiosService {

  municipio: MunicipioModel = new MunicipioModel();

  constructor(
    private readonly http: HttpClient
  ) { }

  guardarMuicipio(data: Partial<MunicipioModel>){    
    this.municipio={...data};
    return this.http.post(`${base_url}/municipios`, this.municipio);
  }

  guardarEdicionMuicipio(id: number, data: Partial<MunicipioModel>){    
    this.municipio={...data};
    return this.http.patch(`${base_url}/municipios/${id}`, this.municipio);
  }

  listarMuicipioTodos(){
    return this.http.get<[municipio:MunicipioModel[], total: number]>(`${base_url}/municipios`)
  }

}
