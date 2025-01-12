import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProvinciaModel } from '../models/provincia.model';
import { DataService } from './data.service';


const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class ProvinciasService {

  provincia: ProvinciaModel = new ProvinciaModel();

  constructor(
    private readonly dataService: DataService,
    private readonly http: HttpClient
  ) { }

  guardarProvicica(data: Partial<ProvinciaModel>){    
    this.provincia={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${base_url}/provincias`, this.provincia, {headers});
  }

  guardarEdicionProvicica(id: number, data: Partial<ProvinciaModel>){    
    this.provincia={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/provincias/${id}`, this.provincia, {headers});
  }

  listarProvicicaTodos(){
    
    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[provincia:ProvinciaModel[], total: number]>(`${base_url}/provincias`, {headers})
  }

}
