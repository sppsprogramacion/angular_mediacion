import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { globalConstants } from 'src/app/common/global-constants';
import { CiudadanoModel } from 'src/app/models/ciudadano.model';
import { TramiteModel } from 'src/app/models/tramite.model';
import { AuthService } from 'src/app/service/auth.service';
import { DataService } from 'src/app/service/data.service';
import { TramitesService } from 'src/app/service/tramites.service';
import { UsuariosTramiteService } from 'src/app/service/usuarios-tramite.service';

@Component({
  selector: 'app-ciudadano-tramites-finalizados',
  templateUrl: './ciudadano-tramites-finalizados.component.html',
  styleUrls: ['./ciudadano-tramites-finalizados.component.scss']
})
export class CiudadanoTramitesFinalizadosComponent implements OnInit {

  loading:boolean = true;

  //MODELOS
  dataCiudadano: CiudadanoModel = new CiudadanoModel;

  //LISTAS    
  listTramites: TramiteModel[]=[];
  listTramitesFinalizados: TramiteModel[]=[];

  constructor(
    private authService: AuthService,
    public dataService: DataService,
    private usuarioTramiteService: UsuariosTramiteService,
    private tramiteService: TramitesService,
    private router: Router
  ) { 
    //recuperar ciudadano seleccioando
    this.dataCiudadano = authService.currentCiudadanoLogin;
  }

  ngOnInit(): void {
    this.listarTramites();
    //this.listarTramitesNuevos();
  }

  //LISTADO DE TRAMITES ASIGNADOS
  listarTramites(){    
    this.tramiteService.listarTramitesXCiudadano(this.dataCiudadano.id_ciudadano)
        .subscribe({
          next: (respuesta) => {
            //this.listTramites= respuesta[0];
            respuesta[0].forEach((tramite) => {
              if(tramite.estado_tramite_id == 3){
                this.listTramites.push(tramite);
              }
            })
            console.log("tramites", this.listTramites);
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
