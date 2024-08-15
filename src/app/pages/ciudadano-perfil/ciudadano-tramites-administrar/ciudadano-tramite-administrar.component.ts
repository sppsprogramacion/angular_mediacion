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
import { Canvas, Img, PdfMakeWrapper, Rect, Txt, Table as TablaPdf, Cell } from 'pdfmake-wrapper';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ciudadano-tramite-administrar',
  templateUrl: './ciudadano-tramite-administrar.component.html',
  providers: [MessageService,],
  styleUrls: ['./ciudadano-tramite-administrar.component.scss']
})
export class CiudadanoTramitesAdministrarComponent implements OnInit {

  msgs: Message[] = []; 
  msgsEstadoTramite: Message[] = []; 
  msgsAudienciasTramite: Message[] = []; 
  
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
    private router: Router,
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

    if(this.dataTramiteAux.numero_tramite){
      this.buscarTramite();
      //this.buscarAudienciasByNumTramiteActivo();
      
    }
    else{
      this.irAPrincipal();
    }
    //fin obtener tramite
  }
  //FIN ONINIT......................................................................................


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

          this.msgsEstadoTramite = [];           
          
          if(this.dataTramite.estado_tramite_id === 2 ) {            
            
            this.msgsEstadoTramite.push({ severity: 'success', summary: 'Mediador', detail: 'El tramite tiene mediador asignado.' });
            
            if (this.dataTramite.es_expediente){
              this.msgsEstadoTramite.push({ severity: 'success', summary: 'Expediente', detail: 'Se generó el número de expediente para su tramite.' });
            }
            this.buscarMediadorByNumTramiteActivo();
          }

          if(this.dataTramite.estado_tramite_id === 3) {
            this.msgsEstadoTramite.push({ severity: 'warn', summary: 'Finalizado', detail: 'El tramite está finalizado.' });
            this.buscarMediadorByNumTramiteActivo();
            this.isTramiteFinalizado = true;
          }

          this.buscarAudienciasByNumTramiteActivo();
        }
      });    
  }
  //FIN BUSCAR TRAMITE................................................................... 

  //BUSCAR AUDIENCIA POR NUMERO DE TRAMITE
  buscarAudienciasByNumTramiteActivo(){
    this.audienciaService.listarAudienciasByTramite(this.dataTramiteAux.numero_tramite)
      .subscribe({
        next: (resultado) => {
          this.listAudiencias = resultado[0]; 

          this.msgsAudienciasTramite=[];
          if(this.listAudiencias.length > 0){
            let listAudienciasActivas: AudienciaModel[] = this.listAudiencias.filter(audiencia => audiencia.esta_cerrada === false);
            if(listAudienciasActivas.length > 0 ){
              this.msgsAudienciasTramite.push({ severity: 'success', summary: 'Audiencia', detail: 'Tiene una audiencia programada pendiente.' });

            }
          }
          else{
            console.log("audiencia numero", this.listAudiencias.length);
            this.msgsAudienciasTramite.push({ severity: 'warn', summary: 'Audiencia', detail: 'No tiene una audiencia programada' });
          
          }
  
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

  //CREAR PDF DEL TRAMITE
  async generarPdfTramite() {
    let meses_texto=["Enero", "Febrero","Marzo","Abril","Mayo","Junio", "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    
    //fecha completa
    let fecha_hoy: Date = new Date();
    let fecha_completa: string;
    let fecha: string;
    let anio:number= fecha_hoy.getFullYear(); 
    let mes: number= fecha_hoy.getMonth();
    let dia: number= fecha_hoy.getDate();
    fecha_completa = "Salta, " + dia + " de " + meses_texto[mes] + " de " +  anio;
    
    const pdf = new PdfMakeWrapper();


    //Rectangulos
    pdf.add(
      new Canvas([
        // Bottom
        new Rect([45, 60], [460, 155]).lineColor('#000000').end,
        new Rect([45, 215], [460, 70]).lineColor('#000000').end,
        
      ]).absolutePosition(0, 0).end
    );
    
    
    //agrega imagen
    pdf.add( await new Img('../../../assets/imagenes/general/logo-gobierno-salta.png').fit([120,120]).alignment('left').build());
    pdf.add(
      new Txt(fecha_completa).fontSize(11).alignment('right').end      
    );
    pdf.add(' ');


    //Encabezado
    pdf.add(
      new TablaPdf([
        [
          // new Cell (new Txt(this.movimientoTramite.sector.organismo.organismo.toUpperCase() + " S.P.P.S").bold().fontSize(14).alignment('left').end).end,
          // new Cell (new Txt(this.datePipe.transform(this.movimientoTramite.fecha_salida, "dd/MM/yyyy")).fontSize(11).alignment("right").end).end
        ],
        [
          // new Cell (new Txt(this.movimientoTramite.sector.sector.toUpperCase() + " S.P.P.S").bold().fontSize(11).alignment('left').end).end,
          // new Cell (new Txt(" ").bold().fontSize(13).alignment('left').end).end
        ]        

      ]).widths([365,70]).layout("noBorders").end
    );
    
    pdf.add(
      new Txt('Datos del tramite').bold().fontSize(12).alignment('center').end
    );
    pdf.add(' ');
    



    pdf.add(' ');


    pdf.add(
      new Txt('Nombre: '+this.dataTramite.ciudadano.apellido + this.dataTramite.ciudadano.nombre).fontSize(11).end
     
    );  

    pdf.add(
      new Txt('DNI N°: '+this.dataTramite.ciudadano.dni).fontSize(11).end
     
    ); 
     
    pdf.create().open();
                             
  }

  //FIN CREAR PDF DEL TRAMITE

  //IR A RPINCIPAL
  irAPrincipal(){
    this.router.navigateByUrl("ciudadano/tramites/nuevos");
  }
  //FIN IR A PRINCIPAL

}
