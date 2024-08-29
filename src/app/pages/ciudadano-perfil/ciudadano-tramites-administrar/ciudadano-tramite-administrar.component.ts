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
import { Canvas, Img, PdfMakeWrapper, Rect, Txt, Table as TablaPdf, Cell, Ul } from 'pdfmake-wrapper';
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
  listAudienciasActivas: AudienciaModel[] = [];
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
            this.listAudienciasActivas = this.listAudiencias.filter(audiencia => audiencia.esta_cerrada === false);
            if(this.listAudienciasActivas.length > 0 ){
              this.msgsAudienciasTramite.push({ severity: 'success', summary: 'Audiencia', detail: 'Tiene una audiencia programada pendiente.' });

            }
          }
          else{
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
    pdf.pageMargins([45,40])

    //Rectangulos
    pdf.add(
      new Canvas([
        // Bottom
        new Rect([35, 170], [510, 600]).lineColor('#000000').end,
        new Rect([40, 195], [500, 25]).lineColor('#000000').end,
        new Rect([40, 245], [500, 55]).lineColor('#000000').end,
        new Rect([40, 330], [500, 55]).lineColor('#000000').end,
        new Rect([40, 415], [500, 120]).lineColor('#000000').end,
      ]).absolutePosition(0, 0).end
    );
    
    
    //agrega imagen
    pdf.add( await new Img('../../../assets/imagenes/general/logo-gobierno-salta.png').fit([120,120]).alignment('left').build());
    pdf.add(
      new Txt(fecha_completa).fontSize(11).alignment('right').end      
    );

    pdf.add(' ');

    pdf.add(
      new Txt('Solicitud de mediación').bold().fontSize(14).alignment('center').end
    );

    pdf.add(' ');
    
    pdf.add(
      new Txt('Datos principales').bold().fontSize(12).alignment('left').end
    );

    pdf.add(' ');

    pdf.add({      
      columns: [
        new Cell (new Txt( 'Tramite N°: ').bold().fontSize(11).end).width(60).end,
        new Cell (new Txt( this.dataTramite.numero_tramite.toString() ).fontSize(11).end).width(90).end,
        new Cell (new Txt('Fecha inicia: ').bold().fontSize(11).end).width(65).end,
        new Cell (new Txt( this.datePipe.transform(this.dataTramite.fecha_tramite, "dd/MM/yyyy") ).fontSize(11).end).width(90).end,
        new Cell (new Txt('Expediente: ').bold().fontSize(11).end).width(60).end,
        new Cell (new Txt( this.dataTramite.expediente ).fontSize(11).end).width(150).end
      ]
    });    

    pdf.add(' ');

    //solicitante
    pdf.add(
      new Txt('Solicitante').bold().fontSize(12).alignment('left').end
    );

    pdf.add(' ');

    pdf.add({
      columns: [
        new Cell (new Txt('Nombre: ').bold().fontSize(11).end).width(45).end,
        new Cell (new Txt(this.dataTramite.ciudadano.apellido + ' ' + this.dataTramite.ciudadano.nombre).fontSize(11).end).width(310).end,
        new Cell (new Txt('DNI: ').bold().fontSize(11).end).width(25).end,
        new Cell (new Txt( this.dataTramite.ciudadano.dni.toString()).fontSize(11).end).width(85).end
      ]
    });    

    pdf.add(' ');
    
    pdf.add({      
      columns: [
        new Cell (new Txt('Sexo: ').bold().fontSize(11).end).width(30).end,
        new Cell (new Txt( this.dataTramite.ciudadano.sexo.sexo ).fontSize(11).end).width(80).end,
        new Cell (new Txt('Teléfono: ').bold().fontSize(11).end).width(50).end,
        new Cell (new Txt( this.dataTramite.ciudadano.telefono.toString() ).fontSize(11).end).width(90).end,
        new Cell (new Txt('Email: ').bold().fontSize(11).end).width(35).end,
        new Cell (new Txt( this.dataTramite.ciudadano.email.toString() ).fontSize(11).end).border([true]).width(210).end
      ]
    });    

    pdf.add(' ');

    //motivo
    pdf.add(
      new Txt('Motivo de la solicitud').bold().fontSize(12).alignment('left').end
    );

    pdf.add(' ');

    let existe_violencia: string = "NO";
    let existe_violencia_genero: string = "NO";
    let existe_denuncia: string = "NO";
    let existe_cautelar: string = "NO";
    if (this.dataTramite.violencia_partes){
      existe_violencia = "SI";
    }
    if (this.dataTramite.violencia_genero){
      existe_violencia_genero = "SI";
    }
    if (this.dataTramite.existe_denuncia){
      existe_denuncia = "SI";
    }
    if (this.dataTramite.medida_cautelar){
      existe_cautelar = "SI";
    }
      
    pdf.add({
      columns: [
        new Cell (new Txt('Motivo: ').bold().fontSize(11).end).width(40).end,
        new Cell (new Txt(this.dataTramite.objeto.objeto ).fontSize(11).end).width(300).end,    
        new Cell (new Txt('Existe violencia: ').bold().fontSize(11).end).width(85).end,
        new Cell (new Txt( existe_violencia ).fontSize(11).end).width(30).end    
      ]
    });    
    pdf.add(' ');

    pdf.add({
      columns: [
        new Cell (new Txt( 'Existe violencia de género: ').bold().fontSize(11).end).width(135).end,
        new Cell (new Txt( existe_violencia_genero ).fontSize(11).end).width(50).end,
        new Cell (new Txt( 'Existe denuncia: ').bold().fontSize(11).end).width(85).end,
        new Cell (new Txt( existe_denuncia ).fontSize(11).end).width(50).end,
        new Cell (new Txt( 'Existe cautelar: ').bold().fontSize(11).end).width(80).end,
        new Cell (new Txt( existe_cautelar ).fontSize(11).end).width(50).end        
      ]
    });    

    pdf.add(' ');    

    //audiencia
    pdf.add(
      new Txt('Audiencia').bold().fontSize(12).alignment('left').end
    );

    pdf.add(' ');
    console.log("audiencia", this.listAudienciasActivas);
    if(this.listAudienciasActivas.length > 0){

      pdf.add({
        columns: [
          new Cell (new Txt( 'N° audiencia: ').bold().fontSize(11).end).width(70).end,
          new Cell (new Txt( this.listAudienciasActivas[0].num_audiencia.toString() ).fontSize(11).end).width(80).end,
          new Cell (new Txt( 'Fecha: ').bold().fontSize(11).end).width(35).end,
          new Cell (new Txt( this.datePipe.transform(this.listAudienciasActivas[0].fecha_inicio, "dd/MM/yyyy") ).fontSize(11).end).width(80).end,
          new Cell (new Txt( 'Hora: ').bold().fontSize(11).end).width(35).end,
          new Cell (new Txt( this.listAudienciasActivas[0].hora_inicio.toString() ).fontSize(11).end).width(80).end        
        ]
      });    

      pdf.add(' ');
      
      pdf.add({
        columns: [
          new Cell (new Txt('Centro de mediación: ').bold().fontSize(11).end).width(110).end,
          new Cell (new Txt( this.listAudienciasActivas[0].centro_mediacion.centro_mediacion ).fontSize(11).end).width(200).end,    
          
        ]
      });    

      pdf.add(' ');
  
      pdf.add({
        columns: [
          new Cell (new Txt('Departamento: ').bold().fontSize(11).end).width(75).end,
          new Cell (new Txt( this.listAudienciasActivas[0].centro_mediacion.departamento.departamento ).fontSize(11).end).width(170).end,    
          new Cell (new Txt('Municipio: ').bold().fontSize(11).end).width(55).end,
          new Cell (new Txt( this.listAudienciasActivas[0].centro_mediacion.municipio.municipio ).fontSize(11).end).width(150).end    
        ]
      });  
      pdf.add(' ');
  
      pdf.add({
        columns: [
          new Cell (new Txt('Domicilio: ').bold().fontSize(11).end).width(55).end,
          new Cell (new Txt( 
            'Barrio: ' + this.listAudienciasActivas[0].centro_mediacion.localidad_barrio +
            ' - Calle/Direccion: ' + this.listAudienciasActivas[0].centro_mediacion.calle_direccion +
            ' - N°: ' + this.listAudienciasActivas[0].centro_mediacion.numero_dom 
          
          ).fontSize(11).end).width(400).end    
        ]
      });    
  
      
    }
    else{
      pdf.add(
        new Txt('No tiene una audiencia programada').fontSize(11).alignment('left').end
      );
      pdf.add(' ');
      pdf.add(' ');
      pdf.add(' ');
      pdf.add(' ');
      pdf.add(' ');
      pdf.add(' ');
    }

    pdf.add(' ');
    pdf.add(' ');

    //convocados
    pdf.add(
      new Txt('Convocados').bold().fontSize(12).alignment('left').end
    );
    
    let misConvocados: string[] = [];
    let miConvocado: string;
    this.dataTramite.convocados.forEach(convocado => {
      miConvocado = "Apellido y nombre: " + convocado.apellido + " " + convocado.nombre;
      misConvocados.push(miConvocado);
    });

    pdf.add(
      {
        ul: misConvocados
      }
    );

    pdf.add(' ');
    pdf.add(' ');


    pdf.add(' ');
     
    pdf.create().open();
                             
  }

  //FIN CREAR PDF DEL TRAMITE

  //IR A RPINCIPAL
  irAPrincipal(){
    this.router.navigateByUrl("ciudadano/tramites/nuevos");
  }
  //FIN IR A PRINCIPAL

}
