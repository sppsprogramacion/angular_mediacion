import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { ModalidadModel } from '../models/modalidad.model';

const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class ModalidadService {

  modalidad: ModalidadModel = new ModalidadModel();
  constructor(
    private readonly http: HttpClient
  ) { }

  guardarModalidad(data: Partial<ModalidadModel>){    
    this.modalidad={...data};
    return this.http.post(`${base_url}/modalidad`, this.modalidad);
  }

  guardarEdicionModalidad(id: number, data: Partial<ModalidadModel>){    
    this.modalidad={...data};
    return this.http.patch(`${base_url}/modalidad/${id}`, this.modalidad);
  }

  listarModalidadTodos(){
    return this.http.get<[modalidad:ModalidadModel[], total: number]>(`${base_url}/modalidad`)
  }
}
