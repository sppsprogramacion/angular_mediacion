import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { TramiteModel } from 'src/app/models/tramite.model';
import { TramitesService } from 'src/app/service/tramites.service';

@Component({
  selector: 'app-tramites-ciudadano-principal',
  templateUrl: './tramites-ciudadano-principal.component.html',
  
  //styleUrls: ['./tramites-ciudadano-principal.component.scss']
})
export class TramitesCiudadanoPrincipalComponent implements OnInit {

  loading:boolean = true;

  //VARIABLES TRAMITE    
  tramite: TramiteModel;
  tramiteDialog: boolean;
  nuevoTramite: boolean;
  submitted: boolean;

  //LISTAS    
  listTramites: TramiteModel[]=[];
  listDepartamentos: DepartamentoModel[]=[];
  listMunicipios: MunicipioModel[]= [];
  listSexo: SexoModel[]=[];

  constructor(
    private tramitesService: TramitesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.listarTramites();
    
  }


  //LISTADO DE CIUDADANOS
  listarTramites(){    
    this.tramitesService.listarTramitesTodos().
        subscribe(respuesta => {
        this.listTramites= respuesta[0];
        console.log("tramites", this.listTramites);
        this.loading = false;  
    
    });
}
//FIN LISTADO DE CIUDADANOS....................................................... 

//ABRIR NUEVO TRAMITE
abrirNuevoTramite(){
  this.router.navigateByUrl("tramites/ciudadano/nuevo");
}
//FIN ABRIR NUEVO TRAMITE

//ABRIR NUEVO TRAMITE
volverTramitesPrincipal(){
  this.router.navigateByUrl("tramites/ciudadano/principal");
}
//FIN ABRIR NUEVO TRAMITE

}
