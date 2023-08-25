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
      // this.tituloPagina ="Usuario: Administrador"
      // this.listarTramitesAdministrador();
    }
    
    if (globalConstants.usuarioLogin) {
      console.log("usuario", globalConstants.usuarioLogin);
      this.tituloPagina ="Usuario: " + globalConstants.usuarioLogin.apellido + " " + globalConstants.usuarioLogin.nombre;
      this.listarTramitesAdministrador();
    }
    
  }


  //LISTADO DE TRAMITES ADMINISTRADOR NUEVOS
  listarTramitesAdministrador(){        
    this.tramitesService.listarTramitesNuevosAdministrador(globalConstants.usuarioLogin.id_usuario).
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
    console.log("tramite en lista", this.dataService.tramiteData);
    if( globalConstants.isAdministrador ){
      this.router.navigateByUrl("admin/tramites/administrar");
    }
    else{
      this.router.navigateByUrl("admin/tramites/administrar-med");
    }
    
  }
  //FIN ACCEDER A DATA SERVICE

}
