import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProvinciaModel } from '../models/provincia.model';


const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class ProvinciasService {

  provincia: ProvinciaModel = new ProvinciaModel();

  constructor(
    private readonly http: HttpClient
  ) { }

  guardarProvicica(data: Partial<ProvinciaModel>){    
    this.provincia={...data};
    return this.http.post(`${base_url}/provincias`, this.provincia);
  }

  guardarEdicionProvicica(id: number, data: Partial<ProvinciaModel>){    
    this.provincia={...data};
    return this.http.patch(`${base_url}/provincias/${id}`, this.provincia);
  }

  listarProvicicaTodos(){
    return this.http.get<[provincia:ProvinciaModel[], total: number]>(`${base_url}/provincias`)
  }

}
