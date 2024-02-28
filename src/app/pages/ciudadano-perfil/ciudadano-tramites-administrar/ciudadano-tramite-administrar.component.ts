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
import { ConvocadoModel } from '../../../models/convocado.model';
import { VinculadoModel } from '../../../models/vinculado.model';
import { Message, MessageService } from 'primeng/api';
import { TramitesService } from 'src/app/service/tramites.service';
@Component({
  selector: 'app-ciudadano-tramite-administrar',
  templateUrl: './ciudadano-tramite-administrar.component.html',
  providers: [MessageService,],
  styleUrls: ['./ciudadano-tramite-administrar.component.scss']
})
export class CiudadanoTramitesAdministrarComponent implements OnInit {

  msgs: Message[] = []; 

  //MODELOS
  dataTramite: TramiteModel= new TramiteModel;
  dataUsuarioTramite: UsuarioTramiteModel= {};
  dataConvocado: ConvocadoModel = {};
  dataVinculado: VinculadoModel = {};

  //listas
  listUsuariosTramite: UsuarioTramiteModel[]=[];

  //variables booleanas
  convocadoDialog: boolean = false;
  loadingMediadores: boolean = true;
  loadingFuncionTramite: boolean = true;
  loadingUsuariosTramite: boolean = true;
  vinculadoDialog: boolean = false;

  //FORMULARIOS
  

  constructor(
    private readonly datePipe: DatePipe,
    public dataService: DataService,
    private centroMediacionService: CentrosMediacionService,
    private funcionTramiteService: FuncionTramiteService,
    private tramiteService: TramitesService,   
    private usuariosCentroService: UsuariosCentroService,
    private usuarioService: UsuariosService,
    private usuarioTramiteService: UsuariosTramiteService,
    
  ) { 
    //OBTENER EL TRAMITE
    
    console.log("tramite recibido", this.dataTramite);
    
  }
  //FIN CONSTRUCTOR................................................................................

  ngOnInit(): void {
    this.dataTramite= this.dataService.tramiteData;
    if(this.dataTramite){
      this.msgs = []; 
      if (this.dataTramite.es_expediente){
        this.msgs.push({ severity: 'success', summary: 'Expediente', detail: 'Se generó el número de expediente para su tramite' });
      }

      this.buscarAsignacionByNumTramiteActivo();
      console.log(this.dataTramite.convocados);
    }
  }
  //FIN ONINIT......................................................................................
  

  //BUSCAR TRAMITE X NUMERO TRAMITE ACTIVO
  buscarAsignacionByNumTramiteActivo(){
    this.usuarioTramiteService.buscarByNumTramiteActivo(this.dataTramite.numero_tramite)
      .subscribe({
        next: (resultado) => {
          this.listUsuariosTramite = resultado[0];  
          this.loadingUsuariosTramite = false;          
        },
        error: (err) => {
          this.dataUsuarioTramite= {};
          //Swal.fire('Error',`Error al buscar tramite asignado: ${err.error.message}`,"error") 
        }
      });       
  }

  //BUSCAR MEDIADOR DEL TRAMITE X NUMERO TRAMITE ACTIVO
  buscarMediadorByNumTramiteActivo(){
    this.usuarioTramiteService.buscarMediadorByNumTramiteActivo(this.dataService.tramiteData.numero_tramite)
      .subscribe({
        next: (resultado) => {
          this.dataUsuarioTramite = resultado; 
          this.loadingUsuariosTramite = false;     
        },
        error: (err) => {
          this.dataUsuarioTramite= {};
          this.loadingUsuariosTramite = false;  
          //Swal.fire('Error',`Error al buscar tramite asignado: ${err.error.message}`,"error") 
        }
      });       
  }
  //FIN BUSCAR MEDIADOR DEL TRAMITE X NUMERO TRAMITE ACTIVO...................................
  

  //BUSCAR TRAMITE 
  buscarTramite(){  
    this.dataTramite = {};  
    this.tramiteService.buscarTramiteNumTram(this.dataService.tramiteData.numero_tramite)
      .subscribe({
        next: (resultado) => {          
          this.dataTramite = {};
          this.dataTramite = resultado;  
          if(this.dataTramite.estado_tramite_id === 1){
      
            
            //cargar datos formulario recibir tramite
            // this.cargarCentrosMediacion(globalConstants.usuarioLogin.id_usuario);
            // this.listarFuncionTramite();
          }  
          
          if(this.dataTramite.estado_tramite_id === 2) {
            
            this.buscarMediadorByNumTramiteActivo();
          }
        }
      });    
  }
  //FIN BUSCAR TRAMITE................................................................... 

  //MANEJO DE FORMULARIO DIALOG VINCULADO
  openDialogConvocado(convocado: ConvocadoModel) {
    this.dataConvocado = convocado;
    this.convocadoDialog = true; 
    
  }
  
  hideDialogConvocado() {    
    this.convocadoDialog = false;    
  }    
  //FIN MANEJO FORMULARIO DIALOG VINCULADO....................................

  
  //MANEJO DE FORMULARIO DIALOG VINCULADO
  reiniciarFormularioVinculado(){
    
  }

  openDialogVinculado(vinculado: VinculadoModel) {
    this.dataVinculado = vinculado;
    this.vinculadoDialog = true; 

  }
  
  hideDialogVinculado() {    
    this.vinculadoDialog = false;    
  }    
  //FIN MANEJO FORMULARIO DIALOG VINCULADO....................................

}
