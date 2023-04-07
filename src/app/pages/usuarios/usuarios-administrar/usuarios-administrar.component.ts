import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { UsuariosTramiteService } from '../../../service/usuarios-tramite.service';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { UsuarioTramiteModel } from 'src/app/models/usuario_tramite.model';
import { TramiteModel } from 'src/app/models/tramite.model';
import { globalConstants } from 'src/app/common/global-constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios-administrar',
  templateUrl: './usuarios-administrar.component.html',
  styleUrls: ['./usuarios-administrar.component.scss']
})
export class UsuariosAdministrarComponent implements OnInit {
  
  loading:boolean = true;

  //MODELOS
  dataUsuario: UsuarioModel= new UsuarioModel;

  //LISTAS    
  listTramitesAsignados: UsuarioTramiteModel[]=[];

  constructor(
    public dataService: DataService,
    private usuarioTramiteService: UsuariosTramiteService,
    private router: Router
  ) {
    this.dataUsuario = dataService.usuarioData;
  }
  //FIN CONSTRUCTOR..................................................

  ngOnInit(): void {
    this.listarTramitesAsignados();

  }
  //FIN ONINIT.......................................................

  //LISTADO DE TRAMITES ASIGNADOS
  listarTramitesAsignados(){    
    this.usuarioTramiteService.listarTramitesAsignadosXUsuario(this.dataUsuario.id_usuario).
        subscribe(respuesta => {
        this.listTramitesAsignados= respuesta[0];
        this.loading = false;  
        console.log("tramites asignados", this.listTramitesAsignados);
    });
  }
  //FIN LISTADO DE TRAMITES ASIGNADOS.......................................................

  //ACCEDER A DATA SERVICE
  administrarTramite(data: TramiteModel){
    this.dataService.tramiteData = data;
    if (globalConstants.usuarioLogin) {
      this.router.navigateByUrl("admin/tramites/administrar");
      
    }
    else{
      this.router.navigateByUrl("ciudadano/tramites/administrar");
    }
    
  }
  //FIN ACCEDER A DATA SERVICE

}
