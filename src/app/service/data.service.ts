import { DatePipe } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { TramiteModel } from '../models/tramite.model';
import { UsuarioModel } from '../models/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  tramiteData: TramiteModel = {};
  usuarioData: UsuarioModel ={};
  constructor(private readonly datePipe: DatePipe,) { }

  getTramiteData(data: TramiteModel){
    this.tramiteData = data;
  }

  getUsuarioData(data: UsuarioModel){
    this.usuarioData = data;
  }

  getchangeFormatoFechaGuardar(nuevaFecha: Date){
    let fechaAuxiliar:any = null;
    if(nuevaFecha != null){
      fechaAuxiliar = this.datePipe.transform(nuevaFecha,"yyyy-MM-dd")!;
      
    }
    return fechaAuxiliar;
  }
}
