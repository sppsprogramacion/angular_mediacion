import { Injectable } from '@angular/core';
import { TramiteModel } from '../models/tramite.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  tramiteData: TramiteModel = {};
  constructor() { }

  getTramiteData(data: TramiteModel){
    this.tramiteData = data;
  }
}
