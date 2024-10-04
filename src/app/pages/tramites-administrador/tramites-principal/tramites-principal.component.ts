import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { DataService } from 'src/app/service/data.service';
import { TramiteModel } from '../../../models/tramite.model';
import { TramitesService } from '../../../service/tramites.service';
import { TotalesTramitesModel } from '../../../models/totales_tramites.model';
import { globalConstants } from '../../../common/global-constants';
import { UsuariosTramiteService } from '../../../service/usuarios-tramite.service';
import { UsuarioTramiteModel } from '../../../models/usuario_tramite.model';
import { AuthService } from '../../../service/auth.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-tramites-principal',
  templateUrl: './tramites-principal.component.html',
  styleUrls: ['./tramites-principal.component.scss']
})
export class TramitesPrincipalComponent implements OnInit {

  //PARA FILTRAR EN TABLA
  @ViewChild('dt') table: Table;
  @ViewChild('filter') filter: ElementRef;

  loading:boolean = true;

  //VARIABLES TRAMITE    
  tramite: TramiteModel;
  tramiteDialog: boolean;
  nuevoTramite: boolean;
  submitted: boolean;
  urlTramite: string = 'tramites/administrar';
  totalTramite: number= 0;
  totalesTramites: TotalesTramitesModel= {};
  tituloPagina: string ="Usuario: Administrador"

  //LISTAS    
  listTramites: TramiteModel[]=[];
  listUsuariosTramites: UsuarioTramiteModel[]=[];
  listDepartamentos: DepartamentoModel[]=[];
  listMunicipios: MunicipioModel[]= [];
  listSexo: SexoModel[]=[];

  constructor(
    private authService: AuthService,
    private tramitesService: TramitesService,
    private usuariosTramitesService: UsuariosTramiteService,
    public dataService: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.currentUserLogin.rol_id == "administrador" || this.authService.currentUserLogin.rol_id == "supervisor") {
      this.tituloPagina ="Usuario: Administrador";
      this.listarTramitesAdministrador();
    }

    if (this.authService.currentCiudadanoLogin) {
      this.tituloPagina ="Ciudadano: " + this.authService.currentCiudadanoLogin.apellido + " " + this.authService.currentCiudadanoLogin.nombre;
      this.listTramites = [];
      this.loading = false;
      //this.listarTramitesCiudadano();
    }
    
    if (this.authService.currentUserLogin) {
      this.tituloPagina ="Usuario: " + this.authService.currentUserLogin.apellido + " " + this.authService.currentUserLogin.nombre;
      this.listTramites = [];
      this.loading = false;
    }

    this.contarTramitesXEstado();
    
  }


  //LISTADO DE TRAMITES ADMINISTRADOR
  listarTramitesAdministrador(){    
    this.tramitesService.listarTramitesTodos().
        subscribe(respuesta => {
        this.listTramites= respuesta[0];
        this.totalTramite = respuesta[1];
        this.loading=false;
    
    });
  }
  //FIN LISTADO DE TRAMITES............................

  //LISTADO DE TRANITES USUARIO
  listarTramitesUsuario(){
    let id_usuario: number = 0;
    id_usuario = this.authService.currentUserLogin.id_usuario;

    this.usuariosTramitesService.listarTramitesAsignadosXUsuario(id_usuario).
        subscribe(respuesta => {
        this.listUsuariosTramites= respuesta[0];
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE TRAMITES USUARIO.......................................................

  //LISTADO DE TRAMITES CIUDADANOS
  listarTramitesCiudadano(){    
    this.tramitesService.listarTramitesTodos().
        subscribe(respuesta => {
        this.listTramites= respuesta[0];
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE TRAMITES CIUDADANOS.......................................................

  //CONTAR TRAMITES
  contarTramitesXEstado(){    
    this.tramitesService.contarTotalesTramitesXEstado().
        subscribe(respuesta => {
        this.totalesTramites = respuesta;    
    });
  }
  //FIN CONTAR TRAMITES............................

  //LIMPIAR FILTROS
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  } 
  //FIN LIMPIAR FILTROS....................................................................................  


  //ACCEDER A DATA SERVICE
  administrarTramite(data: TramiteModel){
    this.dataService.tramiteData = data;
    this.dataService.getTramiteData(data);

    if( this.authService.currentUserLogin.rol_id == "administrador" && data.estado_tramite_id != 3){
      this.router.navigateByUrl("admin/tramites/administrar");
    }    

    //verificacion si el usuario tiene la funcion de administrativo en el tramite
    if( this.authService.currentUserLogin.rol_id == "supervisor" && data.estado_tramite_id != 3 ){
      this.router.navigateByUrl("admin/tramites/administrar-visor");
    }
    
    //verificacion si el usuario tiene la funcion de mediador en el tramite
    if( this.authService.currentUserLogin.rol_id == "mediador" && data.estado_tramite_id != 3){
      this.router.navigateByUrl("admin/tramites/administrar-med" );
    }


    if(data.estado_tramite_id == 3){
      this.router.navigateByUrl("admin/tramites/administrar-finalizado");
    }
    
    
  }
  //FIN ACCEDER A DATA SERVICE

}
