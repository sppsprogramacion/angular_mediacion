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
import { AudienciasService } from 'src/app/service/audiencias.service';
import { AudienciaModel } from 'src/app/models/audiencia.model';
@Component({
  selector: 'app-ciudadano-tramite-administrar',
  templateUrl: './ciudadano-tramite-administrar.component.html',
  providers: [MessageService,],
  styleUrls: ['./ciudadano-tramite-administrar.component.scss']
})
export class CiudadanoTramitesAdministrarComponent implements OnInit {

  msgs: Message[] = []; 

  //MODELOS
  dataAudiencia: AudienciaModel = {};
  dataConvocado: ConvocadoModel = {};
  dataTramite: TramiteModel= new TramiteModel;
  dataTramiteAux: TramiteModel= new TramiteModel;
  dataUsuarioTramite: UsuarioTramiteModel= {};
  dataVinculado: VinculadoModel = {};

  //listas
  listAudiencias: AudienciaModel[] = [];
  listUsuariosTramite: UsuarioTramiteModel[]=[];

  //variables booleanas
  audienciaFinalizadaDialog: boolean = false;
  convocadoDialog: boolean = false;
  loadingAudiencia: boolean = true;
  loadingMediadores: boolean = true;
  loadingFuncionTramite: boolean = true;
  loadingUsuariosTramite: boolean = true;
  vinculadoDialog: boolean = false;
  isTramiteFinalizado: boolean = false;

  //FORMULARIOS
  

  constructor(
    private readonly datePipe: DatePipe,
    public dataService: DataService,
    private audienciaService: AudienciasService,
    private centroMediacionService: CentrosMediacionService,
    private funcionTramiteService: FuncionTramiteService,
    private tramiteService: TramitesService,   
    private usuariosCentroService: UsuariosCentroService,
    private usuarioService: UsuariosService,
    private usuarioTramiteService: UsuariosTramiteService,
    
  ) {     
    
  }
  //FIN CONSTRUCTOR................................................................................

  ngOnInit(): void {

    //obtener tramite
    this.dataTramiteAux= this.dataService.tramiteData;

    if(this.dataTramiteAux){
      this.msgs = []; 
      if (this.dataTramite.es_expediente){
        this.msgs.push({ severity: 'success', summary: 'Expediente', detail: 'Se generó el número de expediente para su tramite' });
      }

      this.buscarTramite();
      this.buscarAudienciasByNumTramiteActivo();
      
    }
    //fin obtener tramite
  }
  //FIN ONINIT......................................................................................


  //BUSCAR AUDIENCIA POR NUMERO DE TRAMITE
  buscarAudienciasByNumTramiteActivo(){
    this.audienciaService.listarAudienciasByTramite(this.dataTramiteAux.numero_tramite)
      .subscribe({
        next: (resultado) => {
          this.listAudiencias = resultado[0]; 
          this.loadingAudiencia = false;     
        },
        error: (err) => {
          this.listAudiencias = [];
          this.loadingAudiencia = false;  
          //Swal.fire('Error',`Error al buscar tramite asignado: ${err.error.message}`,"error") 
        }
      });       
  }
  //FIN BUSCAR AUDIENCIA POR NUMERO DE TRAMITE...................................
  


  //BUSCAR MEDIADOR DEL TRAMITE X NUMERO TRAMITE ACTIVO
  buscarMediadorByNumTramiteActivo(){
    this.usuarioTramiteService.buscarMediadorByNumTramiteActivo(this.dataTramiteAux.numero_tramite)
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
    this.tramiteService.buscarTramiteNumTram(this.dataTramiteAux.numero_tramite)
      .subscribe({
        next: (resultado) => {          
          this.dataTramite = {};
          this.dataTramite = resultado;  
          
          if(this.dataTramite.estado_tramite_id === 2 || this.dataTramite.estado_tramite_id === 3) {
            
            this.buscarMediadorByNumTramiteActivo();
          }

          if(this.dataTramite.estado_tramite_id === 3) {
            
            this.buscarMediadorByNumTramiteActivo();
            this.isTramiteFinalizado = true;
          }
        }
      });    
  }
  //FIN BUSCAR TRAMITE................................................................... 

  //MANEJO FORMULARIO DIALOG VER AUDIENCIA FINALIZADA
  openDialogAudienciaFinalizada(audiencia: AudienciaModel) {
    this.dataAudiencia = audiencia;
    this.audienciaFinalizadaDialog = true;
    // this.formaAudiencia.reset();    

    // return Object.values(this.formaAudiencia.controls).forEach(control => control.markAsUntouched());    
  }
  
  hideDialogAudienciaFinalizada() {
    
    this.msgs = [];
    this.audienciaFinalizadaDialog = false;
    
  }
  //FIN MANEJO FORMULARIO DIALOG VER AUDIENCIA FINALIZADA................................................

  

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
