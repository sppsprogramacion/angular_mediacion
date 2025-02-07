import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';

import { CiudadanoModel } from 'src/app/models/ciudadano.model';
import { DataService } from 'src/app/service/data.service';
import { TramiteModel } from 'src/app/models/tramite.model';
import { TramitesService } from 'src/app/service/tramites.service';
import { UsuariosTramiteService } from 'src/app/service/usuarios-tramite.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-ciudadano-tramites-nuevoslista',
  templateUrl: './ciudadano-tramites-nuevoslista.component.html',
  styleUrls: ['./ciudadano-tramites-nuevoslista.component.scss']
})
export class CiudadanoTramitesNuevoslistaComponent implements OnInit {


  msgsDatosPersonales: Message[] = []; 
  
  //MODELOS
  dataCiudadano: CiudadanoModel = new CiudadanoModel;

  //BOOLEANAS
  datosPersonalesDialog:boolean = false;
  loading:boolean = true;

  //LISTAS    
  listTramites: TramiteModel[]=[];
  listTramitesNuevos: TramiteModel[]=[];

  constructor(
    private authService: AuthService,
    public dataService: DataService,
    private tramiteService: TramitesService,
    private router: Router
  ) { 
    //recuperar ciudadano seleccioando
    this.dataCiudadano = authService.currentCiudadanoLogin;
  }

  ngOnInit(): void {
    this.listarTramites();
    //this.listarTramitesNuevos();
  }

  //LISTADO DE TRAMITES ASIGNADOS
  listarTramites(){    
    this.tramiteService.listarTramitesXCiudadano(this.dataCiudadano.id_ciudadano)
        .subscribe({
          next: (respuesta) => {
            //this.listTramites= respuesta[0];
            respuesta[0].forEach((tramite) => {
              if(tramite.estado_tramite_id < 3){
                this.listTramites.push(tramite);
              }
            })
            this.loading = false;  
          }
    });
  }
  //FIN LISTADO DE TRAMITES ASIGNADOS.......................................................

  //LISTADO DE TRAMITES ASIGNADOS
  listarTramitesNuevos(){    
    this.tramiteService.listarTramitesNuevos(this.dataCiudadano.id_ciudadano)
        .subscribe({
          next: (respuesta) => {
            this.listTramitesNuevos= respuesta[0];
            this.loading = false;  
          }
    });
  }
  //FIN LISTADO DE TRAMITES ASIGNADOS.......................................................


  //MANEJO DE FORMULARIO DIALOG DATOS PERSONALES
  openDialogDatosPersonales() {
    this.msgsDatosPersonales = []; 
    this.msgsDatosPersonales.push({ severity: 'success', detail: 'Si los datos son correctos presione el botón "Continuar" para solicitar un nuevo tramite.'});
    this.msgsDatosPersonales.push({ severity: 'warn', detail: 'Si hay datos incorrectos presione el botón "Modificar datos" para corregir sus datos personales.'});
    
    this.datosPersonalesDialog = true;     
  }
  
  hideDialogDatosPersonales() {    
    this.datosPersonalesDialog = false;    
  }    
  //FIN MANEJO FORMULARIO DIALOG DATOS PERSONALES....................................
  
  
  //ABRIR NUEVO TRAMITE
  abrirNuevoTramite(){
    this.router.navigateByUrl("ciudadano/tramites/nuevo");
  }
  //FIN ABRIR NUEVO TRAMITE

  //ABRIR MODIFICAR DATOS PERSONALES
  abrirModificarDatosPersonales(){
    this.router.navigateByUrl("ciudadano/datospersonales");
  }
  //FIN ABRIR MODIFICAR DATOS PERSONALES

  //ACCEDER A DATA SERVICE
  administrarTramite(data: TramiteModel){
    this.dataService.tramiteData = data;
    if (this.authService.currentCiudadanoLogin) {
      this.router.navigateByUrl("ciudadano/tramites/administrar");
    }
    else{
      this.router.navigateByUrl("admin/tramites/administrar");
    }
    
  }
  //FIN ACCEDER A DATA SERVICE

}
