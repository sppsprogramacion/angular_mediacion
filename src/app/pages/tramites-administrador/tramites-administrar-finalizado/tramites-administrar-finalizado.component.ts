import { Component, OnInit } from '@angular/core';
import { AudienciaModel } from 'src/app/models/audiencia.model';
import { ConvocadoModel } from 'src/app/models/convocado.model';
import { ResultadoAudienciaModel } from 'src/app/models/resultadoAudiencia.model';
import { TramiteModel } from 'src/app/models/tramite.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { UsuarioCentroModel } from 'src/app/models/usuario_centro.model ';
import { UsuarioTramiteModel } from 'src/app/models/usuario_tramite.model';
import { VinculadoModel } from 'src/app/models/vinculado.model';
import { AudienciasService } from 'src/app/service/audiencias.service';
import { CentrosMediacionService } from 'src/app/service/centros-mediacion.service';
import { DataService } from 'src/app/service/data.service';
import { FuncionTramiteService } from 'src/app/service/funcion-tramite.service';
import { ModalidadService } from 'src/app/service/modalidad.service';
import { ResultadosAudienciaService } from 'src/app/service/resultados-audiencia.service';
import { TiposAudienciaService } from 'src/app/service/tipos-audiencia.service';
import { TramitesService } from 'src/app/service/tramites.service';
import { UsuariosCentroService } from 'src/app/service/usuarios-centro.service';
import { UsuariosTramiteService } from 'src/app/service/usuarios-tramite.service';
import { UsuariosService } from 'src/app/service/usuarios.service';

@Component({
  selector: 'app-tramites-administrar-finalizado',
  templateUrl: './tramites-administrar-finalizado.component.html',
  styleUrls: ['./tramites-administrar-finalizado.component.scss']
})
export class TramitesAdministrarFinalizadoComponent implements OnInit {

  //MODELOS
  dataAudiencia: AudienciaModel = {};
  dataConvocado: ConvocadoModel = {};
  dataResultadoAudiencia: ResultadoAudienciaModel = {};
  dataTramite: TramiteModel= new TramiteModel;
  dataTramiteAux: TramiteModel= new TramiteModel;
  dataUsuarioTramite: UsuarioTramiteModel= {};
  dataVinculado: VinculadoModel = {};

  //listas
  listAudiencias: AudienciaModel[] = [];
  listAudienciasUsuario: AudienciaModel[] = [];
  listResultadosAudiencia: ResultadoAudienciaModel[]=[];
  listUsuarios: UsuarioModel[]=[];
  listUsuariosTramite: UsuarioTramiteModel[]=[];

  //booleans
  loadingAudiencia: boolean = true;
  loadingUsuariosTramite: boolean = true;

  
  audienciaFinalizadaDialog: boolean = false;
  convocadoDialog: boolean = false;  
  vinculadoDialog: boolean = false;



  constructor(
    public dataService: DataService,
    private audienciaService: AudienciasService,
    private centroMediacionService: CentrosMediacionService,
    private funcionTramiteService: FuncionTramiteService,
    private modalidadService: ModalidadService,
    private resultadosAudienciaService: ResultadosAudienciaService,
    private tiposAudienciaService: TiposAudienciaService,
    private tramiteService: TramitesService,   
    private usuariosCentroService: UsuariosCentroService,
    private usuarioService: UsuariosService,
    private usuarioTramiteService: UsuariosTramiteService,
  ) { }

  ngOnInit(): void {

    //obtener tramite    
    this.dataTramiteAux= this.dataService.tramiteData;
    this.buscarTramite();

    if(this.dataTramiteAux){      
      this.buscarAsignacionByNumTramiteActivo();
      this.buscarAudienciasByNumTramiteActivo(); 
      
    }   
    //fin obtener tramite

  }
  //FIN ONINIT........................................



  //BUSCAR TRAMITE X NUMERO TRAMITE ACTIVO
  buscarAsignacionByNumTramiteActivo(){
    this.usuarioTramiteService.buscarByNumTramiteActivo(this.dataService.tramiteData.numero_tramite)
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
  //FIN BUSCAR TRAMITE X NUMERO TRAMITE ACTIVO..................................................

  //BUSCAR AUDIENCIA POR NUMERO DE TRAMITE
  buscarAudienciasByNumTramiteActivo(){
    this.audienciaService.listarAudienciasByTramite(this.dataService.tramiteData.numero_tramite)
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
  //FIN BUSCAR MEDIADOR DEL TRAMITE X NUMERO TRAMITE ACTIVO...................................


  //BUSCAR TRAMITE 
  buscarTramite(){  
    this.dataTramite = {};  
    console.log("numero tramite finalizado", this.dataService.tramiteData.numero_tramite);
    console.log("tramite finalizado ", this.dataService.tramiteData);
    this.tramiteService.buscarTramiteNumTram(this.dataService.tramiteData.numero_tramite)
      .subscribe({
        next: (resultado) => {          
          this.dataTramite = {};
          this.dataTramite = resultado; 
          
          if(this.dataTramite.estado_tramite_id === 3) {
            this.buscarMediadorByNumTramiteActivo();
          }
        }
      });    
  }
  //FIN BUSCAR TRAMITE................................................................... 


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


  //MANEJO DE FORMULARIO DIALOG CONVOCADO
  openDialogConvocado(convocado: ConvocadoModel) {
    this.dataConvocado = convocado;
    this.convocadoDialog = true; 
    
  }
  
  hideDialogConvocado() {    
    this.convocadoDialog = false;    
  }    
  //FIN MANEJO FORMULARIO DIALOG CONVOCADO....................................

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

  //MANEJO FORMULARIO DIALOG VER AUDIENCIA FINALIZADA
  openDialogAudienciaFinalizada(audiencia: AudienciaModel) {
    this.dataAudiencia = audiencia;
    this.audienciaFinalizadaDialog = true;
    // this.formaAudiencia.reset();    

    // return Object.values(this.formaAudiencia.controls).forEach(control => control.markAsUntouched());    
  }
  
  hideDialogAudienciaFinalizada() {    
    
    this.audienciaFinalizadaDialog = false;
    
  }
  //FIN MANEJO FORMULARIO DIALOG VER AUDIENCIA FINALIZADA................................................


  


}
