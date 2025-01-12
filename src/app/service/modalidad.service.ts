import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { ModalidadModel } from '../models/modalidad.model';
import { DataService } from './data.service';

const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class ModalidadService {

  modalidad: ModalidadModel = new ModalidadModel();

  constructor(
    private readonly dataService: DataService,
    private readonly http: HttpClient
  ) { }

  guardarModalidad(data: Partial<ModalidadModel>){    
    this.modalidad={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${base_url}/modalidad`, this.modalidad, {headers});
  }

  guardarEdicionModalidad(id: number, data: Partial<ModalidadModel>){    
    this.modalidad={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/modalidad/${id}`, this.modalidad, {headers});
  }

  listarModalidadTodos(){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[modalidad:ModalidadModel[], total: number]>(`${base_url}/modalidad`, {headers})
  }
}
