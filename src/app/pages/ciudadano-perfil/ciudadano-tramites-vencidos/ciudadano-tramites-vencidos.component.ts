import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';

import { CiudadanoModel } from 'src/app/models/ciudadano.model';
import { DataService } from 'src/app/service/data.service';
import { TramiteModel } from 'src/app/models/tramite.model';
import { TramitesService } from 'src/app/service/tramites.service';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ciudadano-tramites-vencidos',
  templateUrl: './ciudadano-tramites-vencidos.component.html',
  styleUrls: ['./ciudadano-tramites-vencidos.component.scss']
})
export class CiudadanoTramitesVencidosComponent implements OnInit {

  msgsDatosPersonales: Message[] = []; 
    
  //MODELOS
  dataCiudadano: CiudadanoModel = new CiudadanoModel;

  //BOOLEANAS
  loading:boolean = true;

  //LISTAS    
  listTramites: TramiteModel[]=[];
  listTramitesNuevos: TramiteModel[]=[];

  constructor(
    private authService: AuthService,
    public dataService: DataService,
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
              if(tramite.estado_tramite_id == 4){
                this.listTramites.push(tramite);
              }
            })
            this.loading = false;  
          },
          error: (err) => {
            if (err.error.statusCode == 401){
              Swal.fire('Fallo ',`No tiene autorización para continuar `,"error");
              this.loading = false;
              return;
            }

            Swal.fire('Fallo ',`No se pudo obtener los tramites ` + err.error.message,"error");
            this.loading = false; 
          }
    });
  }
  //FIN LISTADO DE TRAMITES ASIGNADOS.......................................................

  
}
