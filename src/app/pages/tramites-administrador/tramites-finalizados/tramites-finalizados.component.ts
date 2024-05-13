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
import { UsuariosTramiteService } from 'src/app/service/usuarios-tramite.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-tramites-finalizados',
  templateUrl: './tramites-finalizados.component.html',
  styleUrls: ['./tramites-finalizados.component.scss']
})
export class TramitesFinalizadosComponent implements OnInit {

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
  listUsuariosTramites: UsuarioTramiteModel[]=[];

  constructor(
    private authService: AuthService,
    private tramitesService: TramitesService,
    private usuariosTramitesService: UsuariosTramiteService,
    public dataService: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.listarTramitesUsuarioFinalizados();
    
  }


  //LISTADO DE TRAMITES FINALIZADOS
  listarTramites(){    
    this.tramitesService.listarTramitesFinalizados().
        subscribe(respuesta => {
        this.listTramites= respuesta[0];
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE TRAMITES FINALIZADOS.......................................................

  //LISTADO DE TRANITES USUARIO
  listarTramitesUsuarioFinalizados(){
    let id_usuario: number = this.authService.currentUserLogin.id_usuario;

    //REVISAR PARA LISTAR TRAMITES FINALIZADOS
    this.usuariosTramitesService.listarTramitesFinalizadosXUsuario(id_usuario).
      subscribe(respuesta => {
        this.listUsuariosTramites= respuesta[0];
        this.loading = false;  
    
      });
  }
  //FIN LISTADO DE TRAMITES USUARIO.......................................................
  
  //ACCEDER A DATA SERVICE
  administrarTramite(data: UsuarioTramiteModel){
    this.dataService.tramiteData = data.tramite;    
    this.router.navigateByUrl("admin/tramites/administrar-finalizado");
  }
  //FIN ACCEDER A DATA SERVICE

}
