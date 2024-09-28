import { Injectable } from '@angular/core';
import { RolModel } from '../models/rol.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  rol: RolModel = new RolModel();

  constructor(
    private readonly http: HttpClient
  ) { }

  listarRolesTodos(){
    return this.http.get<[rol:RolModel[], total: number]>(`${base_url}/roles`)
  }
}
