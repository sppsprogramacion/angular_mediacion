import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { globalConstants } from 'src/app/common/global-constants';
import { DataService } from 'src/app/service/data.service';
import { UsuariosTramiteService } from 'src/app/service/usuarios-tramite.service';
import { CiudadanoModel } from '../../../models/ciudadano.model';
import { TramiteModel } from '../../../models/tramite.model';
import { UsuarioTramiteModel } from '../../../models/usuario_tramite.model';
import { TramitesService } from '../../../service/tramites.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-ciudadano-principal',
  templateUrl: './ciudadano-principal.component.html',
  styleUrls: ['./ciudadano-principal.component.scss']
})
export class CiudadanoPrincipalComponent implements OnInit {
  loading:boolean = true;

  //MODELOS
  dataCiudadano: CiudadanoModel = new CiudadanoModel;

  //LISTAS    
  listTramites: TramiteModel[]=[];
  listTramitesNuevos: TramiteModel[]=[];
  listTramitesAsignados: UsuarioTramiteModel[]=[];

  constructor(
    private authService: AuthService,
    public dataService: DataService,
    private usuarioTramiteService: UsuariosTramiteService,
    private tramiteService: TramitesService,
    private router: Router
  ) { 
    //recuperar ciudadano seleccioando
    this.dataCiudadano = dataService.ciudadanoData;
  }

  ngOnInit(): void {
    this.listarTramites();
    this.listarTramitesAsignados();
    this.listarTramitesNuevos();
  }

  //LISTADO DE TRAMITES ASIGNADOS
  listarTramites(){    
    this.tramiteService.listarTramitesXCiudadano(this.dataCiudadano.id_ciudadano)
        .subscribe({
          next: (respuesta) => {
            this.listTramites= respuesta[0];
            console.log("tramites", this.listTramites);
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
            console.log("tramites nuevos", this.listTramitesNuevos);
            this.loading = false;  
          }
    });
  }
  //FIN LISTADO DE TRAMITES ASIGNADOS.......................................................

  //LISTADO DE TRAMITES ASIGNADOS
  listarTramitesAsignados(){    
    this.usuarioTramiteService.listarTramitesAsignadosXCiudadano(this.dataCiudadano.id_ciudadano)
        .subscribe({
          next: (respuesta) => {
            this.listTramitesAsignados= respuesta[0];
            this.loading = false;  
          }
    });
  }
  //FIN LISTADO DE TRAMITES ASIGNADOS.......................................................

  //ABRIR NUEVO TRAMITE
  abrirNuevoTramite(){
    this.router.navigateByUrl("ciudadano/tramites/nuevo");
  }
  //FIN ABRIR NUEVO TRAMITE

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
