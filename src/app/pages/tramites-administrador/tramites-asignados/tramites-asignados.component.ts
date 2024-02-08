import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { globalConstants } from 'src/app/common/global-constants';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { TramiteModel } from 'src/app/models/tramite.model';
import { UsuarioTramiteModel } from 'src/app/models/usuario_tramite.model';
import { DataService } from 'src/app/service/data.service';
import { TramitesService } from 'src/app/service/tramites.service';
import { UsuariosTramiteService } from '../../../service/usuarios-tramite.service';

@Component({
  selector: 'app-tramites-asignados',
  templateUrl: './tramites-asignados.component.html',
  styleUrls: ['./tramites-asignados.component.scss']
})
export class TramitesAsignadosComponent implements OnInit {

  loading:boolean = true;

  //VARIABLES TRAMITE    
  tramite: TramiteModel;
  tramiteDialog: boolean;
  nuevoTramite: boolean;
  submitted: boolean;
  tituloPagina: string = "Usuario: Administrador";

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
      this.listarTramitesUsuario();
    }

    if (globalConstants.ciudadanoLogin) {
      console.log("ciudadano", globalConstants.ciudadanoLogin);
      this.tituloPagina ="Ciudadano: " + globalConstants.ciudadanoLogin.apellido + " " + globalConstants.ciudadanoLogin.nombre
      this.listarTramitesCiudadano();
    }
    
    if (globalConstants.usuarioLogin && !globalConstants.isAdministrador) {
      console.log("usuario", globalConstants.usuarioLogin);
      this.tituloPagina ="Usuario: " + globalConstants.usuarioLogin.apellido + " " + globalConstants.usuarioLogin.nombre
      this.listTramites = [];
      this.listarTramitesUsuario();
    }
    
  }


  

  //LISTADO DE TRAMITES ADMINISTRADOR ASIGNADOS
  listarTramitesAdministrador(){    
    
    this.usuariosTramitesService.listarTramitesAsignadosXCiudadano(0)
      .subscribe({
        next: (respuesta) => {
          this.listUsuariosTramites= respuesta[0];
          this.loading = false; 
        }     
      });
  }
  //FIN LISTADO DE TRAMITES ADMINISTRADOR ASIGNADOS....................................................... 
  
  //LISTADO DE TRAMITES CIUDADANOS ASIGNADOS
  listarTramitesCiudadano(){   

    let id_ciudadano: number = globalConstants.ciudadanoLogin.id_ciudadano; 
    this.usuariosTramitesService.listarTramitesAsignadosXCiudadano(id_ciudadano)
      .subscribe ({
        next: (respuesta) => {
          this.listUsuariosTramites= respuesta[0];
          this.loading = false;  
        }    
      });
  }
  //FIN LISTADO DE TRAMITES CIUDADANOS ASIGNADOS.......................................................


  //LISTADO DE TRAMITES USUARIO
  listarTramitesUsuario(){
    let id_usuario: number = globalConstants.usuarioLogin.id_usuario;

    this.usuariosTramitesService.listarTramitesAsignadosXUsuario(id_usuario)
      .subscribe({
        next: (respuesta) => {
          this.listUsuariosTramites= respuesta[0];
          this.loading = false;  
          console.log("asignados usuario", this.listUsuariosTramites);
        }  
      });
  }
  //FIN LISTADO DE TRAMITES USUARIO.......................................................

  //ACCEDER A DATA SERVICE
  administrarTramite(data: UsuarioTramiteModel){
    this.dataService.tramiteData = data.tramite;
    if( globalConstants.isAdministrador ){
      this.router.navigateByUrl("admin/tramites/administrar");
    }
    else{
      this.router.navigateByUrl("admin/tramites/administrar-med");
    }

    
  }
  //FIN ACCEDER A DATA SERVICE

}
