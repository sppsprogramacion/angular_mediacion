import { Component, OnInit } from '@angular/core';
import { TramiteModel } from 'src/app/models/tramite.model';
import { TramitesService } from 'src/app/service/tramites.service';
import { UsuariosTramiteService } from '../../../service/usuarios-tramite.service';
import { UsuarioModel } from '../../../models/usuario.model';
import { DataService } from '../../../service/data.service';
import { UsuarioTramiteModel } from '../../../models/usuario_tramite.model';

@Component({
  selector: 'app-tramites-usuario-asignados',
  templateUrl: './tramites-usuario-asignados.component.html',
  styleUrls: ['./tramites-usuario-asignados.component.scss']
})
export class TramitesUsuarioAsignadosComponent implements OnInit {
  
  loading:boolean = true;

  //VARIABLES TRAMITE    
  tramite: TramiteModel;
  dataUsuarioLogin: UsuarioModel= {};
  tramiteDialog: boolean;
  nuevoTramite: boolean;
  submitted: boolean;

  //LISTAS    
  listTramites: UsuarioTramiteModel[] = [];

  constructor(
    private usuariosTramitesService: UsuariosTramiteService,
    private dataService: DataService
    ) {
      this.dataUsuarioLogin = this.dataService.usuarioLogin;
    }

  ngOnInit(): void {
    this.listarTramites();
  }

  //LISTADO DE TRANITES USUARIO
  listarTramites(){
    let id_usuario: number = 0;
    if (this.dataUsuarioLogin) id_usuario = this.dataUsuarioLogin.id_usuario;

    this.usuariosTramitesService.listarTramitesAsignadosXUsuario(id_usuario).
        subscribe(respuesta => {
        this.listTramites= respuesta[0];
        console.log("tramites", this.listTramites);
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE TRAMITES USUARIO.......................................................

}
