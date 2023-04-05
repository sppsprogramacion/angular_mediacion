import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TramiteModel } from 'src/app/models/tramite.model';
import { UsuarioTramiteModel } from 'src/app/models/usuario_tramite.model';
import { CentrosMediacionService } from 'src/app/service/centros-mediacion.service';
import { DataService } from 'src/app/service/data.service';
import { FuncionTramiteService } from 'src/app/service/funcion-tramite.service';
import { UsuariosCentroService } from 'src/app/service/usuarios-centro.service';
import { UsuariosTramiteService } from 'src/app/service/usuarios-tramite.service';
import { UsuariosService } from 'src/app/service/usuarios.service';

@Component({
  selector: 'app-tramites-ciudadano-administrar',
  templateUrl: './tramites-ciudadano-administrar.component.html',
  styleUrls: ['./tramites-ciudadano-administrar.component.scss']
})
export class TramitesCiudadanoAdministrarComponent implements OnInit {

  //MODELOS
  dataTramite: TramiteModel= new TramiteModel;
  dataUsuarioTramite: UsuarioTramiteModel= {};

  //listas
  

  //variables
  loadingMediadores: boolean = true;
  loadingFuncionTramite: boolean = true

  //FORMULARIOS
  

  constructor(
    private readonly datePipe: DatePipe,
    public dataService: DataService,
    private usuarioService: UsuariosService,
    private centroMediacionService: CentrosMediacionService,
    private usuariosCentroService: UsuariosCentroService,
    private usuarioTramiteService: UsuariosTramiteService,
    private funcionTramiteService: FuncionTramiteService
    
  ) { 
    //OBTENER EL TRAMITE
    
    console.log("tramite recibido", this.dataTramite);
    
  }
  //FIN CONSTRUCTOR................................................................................

  ngOnInit(): void {
    this.dataTramite= this.dataService.tramiteData;
    if(this.dataTramite){
      this.buscarAsignacionByNumTramiteActivo();
      
    }
  }
  //FIN ONINIT......................................................................................
  

  //BUSCAR TRAMITE X NUMERO TRAMITE ACTIVO
  buscarAsignacionByNumTramiteActivo(){
    this.usuarioTramiteService.buscarByNumTramiteActivo(this.dataTramite.numero_tramite)
      .subscribe({
        next: (resultado) => {
          this.dataUsuarioTramite = resultado;
          console.log("dataUdsuarioTramite", this.dataUsuarioTramite);          
        },
        error: (err) => {
          this.dataUsuarioTramite= {};
          //Swal.fire('Error',`Error al buscar tramite asignado: ${err.error.message}`,"error") 
        }
      });       
  }

}
