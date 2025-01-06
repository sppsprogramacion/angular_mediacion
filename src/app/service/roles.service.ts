import { Injectable } from '@angular/core';
import { RolModel } from '../models/rol.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';

const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  rol: RolModel = new RolModel();

  constructor(
    private readonly dataService: DataService,
    private readonly http: HttpClient
  ) { }

  listarRolesTodos(){

    const token = this.dataService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<[rol:RolModel[], total: number]>(`${base_url}/roles`, {headers})
  }
}
