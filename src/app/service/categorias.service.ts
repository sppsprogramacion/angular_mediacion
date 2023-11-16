import { Injectable } from '@angular/core';
import { CategoriaModel } from '../models/categoria.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  categoria: CategoriaModel = new CategoriaModel();
  constructor(
    private readonly http: HttpClient
  ) { }

  guardarCategoria(data: Partial<CategoriaModel>){    
    this.categoria={...data};
    return this.http.post(`${base_url}/categorias`, this.categoria);
  }

  guardarEdicionCategoria(id: number, data: Partial<CategoriaModel>){    
    this.categoria={...data};
    return this.http.patch(`${base_url}/categorias/${id}`, this.categoria);
  }

  listarCategoriasTodos(){
    return this.http.get<[categorias:CategoriaModel[], total: number]>(`${base_url}/categorias`)
  }
}
