import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-tramites-principal',
  templateUrl: './tramites-principal.component.html',
  styleUrls: ['./tramites-principal.component.scss']
})
export class TramitesPrincipalComponent implements OnInit {

  loading:boolean = true;

  //VARIABLES TRAMITE    
  tramite: TramiteModel;
  tramiteDialog: boolean;
  nuevoTramite: boolean;
  submitted: boolean;
  urlTramite: string = 'tramites/administrar';
  totalTramite: number= 0;
  totalesTramites: TotalesTramitesModel= {};

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
    if (globalConstants.isAdministrador) this.listarTramitesAdministrador();

    if (globalConstants.ciudadanoLogin) this.listarTramitesCiudadano();
    
    if (globalConstants.usuarioLogin) this.listTramites = [];

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
    id_usuario = globalConstants.usuarioLogin.id_usuario;

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

  //ACCEDER A DATA SERVICE
  administrarTramite(data: TramiteModel){
    this.dataService.tramiteData = data;
    this.dataService.getTramiteData(data);
    this.router.navigateByUrl("admin/tramites/administrar");
  }
  //FIN ACCEDER A DATA SERVICE

}
