import { Injectable } from '@angular/core';
import { CategoriaModel } from '../models/categoria.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';

const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  categoria: CategoriaModel = new CategoriaModel();
  constructor(
    private readonly dataService: DataService,
    private readonly http: HttpClient
  ) { }

  guardarCategoria(data: Partial<CategoriaModel>){    
    this.categoria={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${base_url}/categorias`, this.categoria, { headers });
  }

  guardarEdicionCategoria(id: number, data: Partial<CategoriaModel>){    
    this.categoria={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/categorias/${id}`, this.categoria, { headers });
  }

  listarCategoriasTodos(){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[categorias:CategoriaModel[], total: number]>(`${base_url}/categorias`, {headers})
  }
}
