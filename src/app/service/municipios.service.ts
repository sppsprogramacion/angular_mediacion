import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MunicipioModel } from '../models/municipio.model';
import { DataService } from './data.service';



const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class MunicipiosService {

  municipio: MunicipioModel = new MunicipioModel();

  constructor(
    private readonly dataService: DataService,
    private readonly http: HttpClient
  ) { }

  guardarMuicipio(data: Partial<MunicipioModel>){    
    this.municipio={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${base_url}/municipios`, this.municipio, {headers});
  }

  guardarEdicionMuicipio(id: number, data: Partial<MunicipioModel>){    
    this.municipio={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/municipios/${id}`, this.municipio, {headers});
  }

  listarMuicipioTodos(){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[municipio:MunicipioModel[], total: number]>(`${base_url}/municipios`, {headers})
  }

}
