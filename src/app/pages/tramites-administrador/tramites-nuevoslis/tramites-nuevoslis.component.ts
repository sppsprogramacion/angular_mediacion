import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { TramiteModel } from 'src/app/models/tramite.model';
import { UsuarioTramiteModel } from 'src/app/models/usuario_tramite.model';
import { DataService } from 'src/app/service/data.service';
import { TramitesService } from 'src/app/service/tramites.service';
import { globalConstants } from '../../../common/global-constants';
import { UsuariosTramiteService } from '../../../service/usuarios-tramite.service';

@Component({
  selector: 'app-tramites-nuevoslis',
  templateUrl: './tramites-nuevoslis.component.html',
  styleUrls: ['./tramites-nuevoslis.component.scss']
})
export class TramitesNuevoslisComponent implements OnInit {

  loading:boolean = true;

  //MODELOS
  tramite: TramiteModel;

  //VARIABLES TRAMITE    
  isCiudadano: boolean = false;
  tramiteDialog: boolean;
  nuevoTramite: boolean;
  submitted: boolean;
  tituloPagina: string ="Usuario: Administrador";

  //LISTAS    
  listTramites: TramiteModel[]=[];
  listUsuariosTramites: UsuarioTramiteModel[]=[];
  listDepartamentos: DepartamentoModel[]=[];
  listMunicipios: MunicipioModel[]= [];
  listSexo: SexoModel[]=[];

  constructor(
    private tramitesService: TramitesService,
    private usuariosTramitesService: UsuariosTramiteService,
    public dataService: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    
    if (globalConstants.isAdministrador) {
      console.log("administrador ", globalConstants.isAdministrador);
      this.tituloPagina ="Usuario: Administrador"
      this.listarTramitesAdministrador();
    }

    if (globalConstants.ciudadanoLogin) {
      console.log("ciudadano", globalConstants.ciudadanoLogin);
      this.tituloPagina ="Ciudadano: " + globalConstants.ciudadanoLogin.apellido + " " + globalConstants.ciudadanoLogin.nombre;
      this.listarTramitesCiudadano();
      this.isCiudadano= true;
    }
    
    if (globalConstants.usuarioLogin) {
      console.log("usuario", globalConstants.usuarioLogin);
      this.tituloPagina ="Usuario: " + globalConstants.usuarioLogin.apellido + " " + globalConstants.usuarioLogin.nombre;
      this.listTramites = [];
      this.loading=false;
    }
    
  }


  //LISTADO DE TRAMITES ADMINISTRADOR NUEVOS
  listarTramitesAdministrador(){    
    
    this.tramitesService.listarTramitesNuevos(0).
        subscribe(respuesta => {
        this.listTramites= respuesta[0];
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE TRAMITES ADMINISTRADOR NUEVOS....................................................... 
  
   //LISTADO DE TRAMITES CIUDADANOS
   listarTramitesCiudadano(){   

    let id_ciudadano: number = globalConstants.ciudadanoLogin.id_ciudadano; 
    this.tramitesService.listarTramitesNuevos(id_ciudadano).
        subscribe(respuesta => {
        this.listTramites= respuesta[0];
        this.loading = false;      
    });
  }
  //FIN LISTADO DE TRAMITES CIUDADANOS.......................................................

  //LISTADO DE TRANITES USUARIO
  listarTramitesUsuario(){
    let id_usuario: number = globalConstants.usuarioLogin.id_usuario;

    this.usuariosTramitesService.listarTramitesAsignadosXUsuario(id_usuario).
        subscribe(respuesta => {
        this.listUsuariosTramites= respuesta[0];
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE TRAMITES USUARIO.......................................................

 //ABRIR NUEVO TRAMITE
  abrirNuevoTramite(){
    this.router.navigateByUrl("admin/tramites/nuevo");
  }
  //FIN ABRIR NUEVO TRAMITE

  //ACCEDER A DATA SERVICE
  administrarTramite(data: TramiteModel){
    this.dataService.tramiteData = data;
    this.router.navigateByUrl("admin/tramites/administrar");
  }
  //FIN ACCEDER A DATA SERVICE

}
