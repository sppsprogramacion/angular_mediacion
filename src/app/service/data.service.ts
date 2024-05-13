import { DatePipe } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { TramiteModel } from '../models/tramite.model';
import { UsuarioModel } from '../models/usuario.model';
import { CentroMediacionModel } from '../models/centro_mediacion.model';
import { CiudadanoModel } from '../models/ciudadano.model';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  ciudadanoData: CiudadanoModel = {};
  
  centroMediacionData: CentroMediacionModel= {};
  
  tramiteData: TramiteModel = {};
  
  usuarioData: UsuarioModel ={};

  constructor(private readonly datePipe: DatePipe,) { }

  getTramiteData(data: TramiteModel){
    this.tramiteData = data;
  }

  getUsuarioData(data: UsuarioModel){
    this.usuarioData = data;
  }

  getCiudadanoData(data: UsuarioModel){
    this.ciudadanoData = data;
  }

  getCentroMediacionData(data: CentroMediacionModel){
    this.centroMediacionData = data;
  }

  getchangeFormatoFechaGuardar(nuevaFecha: Date){
    let fechaAuxiliar:any = null;
    if(nuevaFecha != null){
      fechaAuxiliar = this.datePipe.transform(nuevaFecha,"yyyy-MM-dd")!;
      
    }
    return fechaAuxiliar;
  }

  getchangeFormatoFechaRetornar(nuevaFecha: Date){
    let fechaAuxiliar:Date = null;
    if(nuevaFecha != null){
      fechaAuxiliar = new Date(this.datePipe.transform(this.ciudadanoData.fecha_nac, "MM-dd-yyyy"))
      
    }
    return fechaAuxiliar;
  }
}
