import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CiudadanoModel } from '../models/ciudadano.model';
import { DataService } from './data.service';

const base_url = environment.URL_BASE

@Injectable({
  providedIn: 'root'
})
export class CiudadanosService {
  ciudadano: CiudadanoModel = new CiudadanoModel();
  constructor(
    private readonly dataService: DataService,
    private readonly http: HttpClient
  ) { }

  guardarCiudadano(data: Partial<CiudadanoModel>){    
    this.ciudadano={...data};
    return this.http.post(`${base_url}/ciudadanos`, this.ciudadano);
  }

  guardarEdicionCiudadano(id: number, data: Partial<CiudadanoModel>){    
    this.ciudadano={...data};

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/ciudadanos/${id}`, this.ciudadano, { headers });
  }

  guardarCambiarContrasenia(id: number, data: any){    
    
    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${base_url}/ciudadanos/cambiar-password/${id}`, data, { headers });
  }

  listarCiudadanosTodos(){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[ciudadano:CiudadanoModel[], total: number]>(`${base_url}/ciudadanos`, { headers })
  }

  listarCiudadanosXDni(dni:number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[ciudadano:CiudadanoModel[], total: number]>(`${base_url}/ciudadanos/buscarlista-xdni?dni=${dni}`, { headers })
  }

  listarCiudadanosXApellido(apellido:string){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[ciudadano:CiudadanoModel[], total: number]>(`${base_url}/ciudadanos/buscarlista-xapellido?apellido=${apellido}`, { headers })
  }

  buscarXDni(dni: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<CiudadanoModel>(`${base_url}/ciudadanos/buscar-xdni?dni=${dni}`, { headers })
  }

  buscarXId(id: number){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<CiudadanoModel>(`${base_url}/ciudadanos/${id}`, { headers })
  }

  

}
