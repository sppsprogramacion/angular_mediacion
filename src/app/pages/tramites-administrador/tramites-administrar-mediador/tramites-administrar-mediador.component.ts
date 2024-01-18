import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

import { DataService } from 'src/app/service/data.service';
import { TramiteModel } from '../../../models/tramite.model';
import { UsuariosService } from '../../../service/usuarios.service';
import { UsuarioModel } from '../../../models/usuario.model';
import { UsuarioTramiteModel } from '../../../models/usuario_tramite.model';
import { UsuariosTramiteService } from '../../../service/usuarios-tramite.service';
import { FuncionTramiteService } from '../../../service/funcion-tramite.service';
import { FuncionTtramiteModel } from 'src/app/models/funcion_tramite.model';
import { ElementoModel } from '../../../models/elemento.model';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { departamentos } from 'src/app/common/data-mokeada';
import { CentroMediacionModel } from 'src/app/models/centro_mediacion.model';
import { CentrosMediacionService } from '../../../service/centros-mediacion.service';
import { UsuariosCentroService } from '../../../service/usuarios-centro.service';
import { UsuarioCentroModel } from '../../../models/usuario_centro.model ';
import { TramitesService } from 'src/app/service/tramites.service';
import { globalConstants } from '../../../common/global-constants';
import { ConvocadoModel } from 'src/app/models/convocado.model';
import { VinculadoModel } from 'src/app/models/vinculado.model';
import { AudienciasService } from 'src/app/service/audiencias.service';
import { AudienciaModel } from 'src/app/models/audiencia.model';
import { TiposAudienciaService } from 'src/app/service/tipos-audiencia.service';
import { TipoAudienciaModel } from 'src/app/models/tipo_audiencia.model';

@Component({
  selector: 'app-tramites-administrar-mediador',
  templateUrl: './tramites-administrar-mediador.component.html',
  providers: [MessageService, ConfirmationService,DatePipe],
  styleUrls: ['./tramites-administrar-mediador.component.scss']
})
export class TramitesAdministrarMediadorComponent implements OnInit {

  //MENSAJES
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
  listAudienciasUsuario: AudienciaModel[] = [];
  listCentrosMediacion: UsuarioCentroModel[]=[];
  listDepartamentos: DepartamentoModel[] = [];
  listFuncionTramite: FuncionTtramiteModel[] = [];
  listModalidad: FuncionTtramiteModel[] = [];
  listTipoAudiencia: TipoAudienciaModel[] = [];
  listUsuarios: UsuarioModel[]=[];
  listUsuariosCentro: UsuarioCentroModel[]=[];
  listUsuarioCentrosMediacion: UsuarioCentroModel[]=[];
  listUsuariosTramite: UsuarioTramiteModel[]=[];
  elementosCentroMediacion: ElementoModel[]=[];  


  
  elementosUsuarios: ElementoModel[]=[];
  elementosUsuariosCentro: ElementoModel[]=[];

  //variables
  loadingAudiencia: boolean = true;
  loadingAudienciaUsuario: boolean = true;
  loadingMediadores: boolean = true;
  loadingFuncionTramite: boolean = true;
  loadingUsuariosTramite: boolean = true;
  audienciaDialog: boolean = false;
  audienciaCerrarDialog: boolean = false;
  audienciaFinalizadaDialog: boolean = false;
  audienciaUsuarioDialog: boolean = false;
  

  //booleans
  isNuevo: boolean = false;
  convocadoDialog: boolean = false;  
  vinculadoDialog: boolean = false;

  //FORMULARIOS
  formaMediadorAsignado: FormGroup;  
  formaAudiencia: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly datePipe: DatePipe,
    public dataService: DataService,
    private audienciaService: AudienciasService,
    private centroMediacionService: CentrosMediacionService,
    private funcionTramiteService: FuncionTramiteService,
    private tiposAudienciaService: TiposAudienciaService,
    private tramiteService: TramitesService,
    private usuariosCentroService: UsuariosCentroService,
    private usuarioService: UsuariosService,
    private usuarioTramiteService: UsuariosTramiteService,
    
  ) { 
    //OBTENER EL TRAMITE

    //FORMULARIO 
    this.formaMediadorAsignado = this.fb.group({
      detalles: ['',[Validators.required, Validators.minLength(1), Validators.maxLength(200)]],      
      funcion_tramite_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],       
      
    });

    this.formaAudiencia = this.fb.group({
      centro_mediacion_id: [0,[Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(1)]],
      detalles: ['',[Validators.required, Validators.minLength(5), Validators.maxLength(200)]], 
      fecha_inicio: [,[Validators.required]],   
      hora_inicio: [,[Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)]],     
      hora_fin: [,[Validators.required]],          
      modalidad_id: [1,[Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(2)]],     
      tipo_audiencia_id: [0,[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.min(1)]]
    });
  }
  //FIN CONSTRUCTOR................................................................................

  ngOnInit(): void {
    //obtener tramite
    this.dataTramiteAux= this.dataService.tramiteData;
    this.buscarTramite();
    console.log("tramite recibido onini", this.dataService.tramiteData);
    console.log("tramite encontrado onini", this.dataTramite);

    if(this.dataTramiteAux){
      this.buscarAsignacionByNumTramiteActivo();
      this.buscarAudienciasByNumTramiteActivo(); 
      
    }   
    console.log("estado tramite", this.dataTramite.estado_tramite_id);
    
    
  }
  //FIN ONINIT......................................................................................

  //MENSAJES DE VALIDACIONES
  user_validation_messages = {
    //datos tramite 
    'funcion_tramite_id': [
      { type: 'required', message: 'La función en el tramite es requerida.' },
      { type: 'pattern', message: 'Debe seleccionar un una función.' },
    ],
    'detalles': [
      { type: 'required', message: 'El detalle es requerido.' },
      { type: 'minlength', message: 'La cantidad mínima de caracteres es 1.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 200.' }
    ],  
  }
  //FIN MENSAJES DE VALIDACIONES...............................................................

  //VALIDACIONES DE FORMULARIO
  isValidRecibirTramite(campo: string): boolean{     
    
    return this.formaMediadorAsignado.get(campo)?.invalid && this.formaMediadorAsignado.get(campo)?.touched;      
  }

  isValidAudiencia(campo: string): boolean{     
    
    return this.formaAudiencia.get(campo)?.invalid && this.formaAudiencia.get(campo)?.touched;      
  }
  //FIN VALIDACIONES DE FORMULARIO...............................................

  //GUARDAR USUARIO-TRAMITE  
  submitFormUsuarioTramite(){
    if(this.formaMediadorAsignado.invalid){     
        
        console.log("formulario", this.formaMediadorAsignado);
        console.log("errores formulario");
        Swal.fire('Formulario incompleto',`Complete correctamente todos los campos del formulario`,"error");
        return Object.values(this.formaMediadorAsignado.controls).forEach(control => control.markAsTouched());
    }

    let dataMediadorAsignado: Partial<UsuarioTramiteModel>;

    dataMediadorAsignado = {
      tramite_numero: this.dataTramite.numero_tramite,
      usuario_id: globalConstants.usuarioLogin.id_usuario,
      detalles: this.formaMediadorAsignado.get('detalles')?.value,
      funcion_tramite_id: parseInt(this.formaMediadorAsignado.get('funcion_tramite_id')?.value),             
    };
    
    
    //GUARDAR NUEVO USUARIO-TRAMITE
    this.usuarioTramiteService.guardarUsuarioTramite(dataMediadorAsignado)
      .subscribe({
        next: (resultado) => {
          let usuarioTramiteRes: UsuarioTramiteModel = resultado;
          Swal.fire('Exito',`La asignacion de mediador se realizo con exito`,"success");
        },
        error: (err) => {
          Swal.fire('Error',`Error al realizar la asignacion: ${err.error.message}`,"error") 
        }
      });         
    //FIN GUARDAR NUEVO USUARIO-TRAMITE

  }    
  //FIN GUARDAR USUARIO-TRAMITE............................................................

  //GUARDEAR NUEVA AUDIENCIA
  submitFormAudiencia(){
    if(this.formaAudiencia.invalid){
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: 'Datos inválidos', detail: 'Revise los datos cargados. ' });
      console.log("formulario Audiencia", this.formaAudiencia.controls);
      return Object.values(this.formaAudiencia.controls).forEach(control => control.markAsTouched());
    }

    let dataAudiencia: Partial<AudienciaModel>;
    dataAudiencia = {
      tramite_numero: this.dataTramite.numero_tramite,

      fecha_inicio: this.changeFormatoFechaGuardar(this.formaAudiencia.get('fecha_inicio')?.value),
      hora_inicio: this.formaAudiencia.get('hora_inicio')?.value,
      hora_fin: this.formaAudiencia.get('hora_fin')?.value,
      tipo_audiencia_id: parseInt(this.formaAudiencia.get('tipo_audiencia_id')?.value), 
      modalidad_id: parseInt(this.formaAudiencia.get('modalidad_id')?.value), 
      centro_mediacion_id: parseInt(this.formaAudiencia.get('centro_mediacion_id')?.value), 
      detalles: this.formaAudiencia.get('detalles')?.value,
      usuario_id: this.dataUsuarioTramite.usuario_id,
                  
    }; 

    //GUARDAR NUEVO AUDIENCIA
    this.audienciaService.guardarAudiencia(dataAudiencia)
      .subscribe({
        next: (resultado) => {
          let audienciaRes: AudienciaModel = resultado;
          this.hideDialogAudiencia();
          this.buscarAudienciasByNumTramiteActivo();
          Swal.fire('Exito',`La audiencia se generó con exito`,"success");
        },
        error: (err) => {
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'Error al guardar', detail: ` ${err.error.message}` });
        }
      });         
    //FIN GUARDAR NUEVO AUDIENCIA

  }
  //GUARDEAR NUEVA AUDIENCIA...............................................................

  //BUSCAR TRAMITE 
  buscarTramite(){  
    this.dataTramite = {};  
    this.tramiteService.buscarTramiteNumTram(this.dataService.tramiteData.numero_tramite)
      .subscribe({
        next: (resultado) => {          
          this.dataTramite = {};
          this.dataTramite = resultado[0];  
          if(this.dataTramite.estado_tramite_id === 1){
      
            this.isNuevo = true;
            //cargar datos formulario recibir tramite
            this.cargarCentrosMediacion(globalConstants.usuarioLogin.id_usuario);
            this.listarFuncionTramite();
          }  
          
          if(this.dataTramite.estado_tramite_id === 2) {
            this.buscarMediadorByNumTramiteActivo();
          }
        }
      });    
  }
  //FIN BUSCAR TRAMITE................................................................... 

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

  //BUSCAR AUDIENCIAS ABIERTAS POR USUARIO
  buscarAudienciasByUsuario(){
    this.audienciaService.listarAudienciasAbiertasByUsuario(this.dataUsuarioTramite.usuario_id)
      .subscribe({
        next: (resultado) => {
          this.listAudienciasUsuario = resultado[0]; 
          this.loadingAudienciaUsuario = false;     
        },
        error: (err) => {
          this.listAudienciasUsuario = [];
          this.loadingAudienciaUsuario = false;  
          //Swal.fire('Error',`Error al buscar tramite asignado: ${err.error.message}`,"error") 
        }
      });       
  }
  //FIN BUSCAR AUDIENCIAS ABIERTAS POR USUARIO...................................
  

  //LISTADO DE FUNCIONES TRAMITES
  listarFuncionTramite(){    
    this.funcionTramiteService.listarFuncionTramitesTodos().
        subscribe(respuesta => {
        this.listFuncionTramite= respuesta[0];
        this.loadingFuncionTramite = false;  
    
    });
  }
  //FIN LISTADO DE FUNCIONES TRAMITES............................

  //LISTADO DE TIPO AUDIENCIAS
  listarModalidad(){    
    this.tiposAudienciaService.listarTodos().
        subscribe(respuesta => {
        this.listTipoAudiencia= respuesta[0];
    
    });
  }
  //FIN LISTADO DE TIPO AUDIENCIAS............................

  //LISTADO DE TIPO AUDIENCIAS
  listarTiposAudiencia(){    
    this.tiposAudienciaService.listarTodos().
        subscribe(respuesta => {
        this.listTipoAudiencia= respuesta[0];
    
    });
  }
  //FIN LISTADO DE TIPO AUDIENCIAS............................


  // cargarCentrosMediacion(id_departamento: number){
  //   this.centroMediacionService.listarCentroMediacionXDepartamento(id_departamento).
  //     subscribe(respuesta => {
  //       this.listCentrosMediacion= respuesta[0];
  //       this.elementosCentroMediacion = this.listCentrosMediacion.map(centro => {
  //         return {
  //           clave: centro.id_centro_mediacion,
  //           value: centro.centro_mediacion + " (" + centro.municipio.municipio + " - " + centro.localidad_barrio + " - " + centro.calle_direccion + " " + centro.numero_dom + ")"
  //           }
  //       });        
    
  //   });  
  // }

  cargarCentrosMediacion(id_usuario: number){
    this.usuariosCentroService.listarCentrosActivosXUsuario(id_usuario).
      subscribe(respuesta => {
        this.listCentrosMediacion= respuesta[0];
        this.elementosCentroMediacion = this.listCentrosMediacion.map(centro => {
          return {
            clave: centro.centro_mediacion.id_centro_mediacion,
            value: centro.centro_mediacion.centro_mediacion + " (Municipio: " + centro.centro_mediacion.municipio.municipio + " - Barrio: " + centro.centro_mediacion.localidad_barrio + " - Dirección: " + centro.centro_mediacion.calle_direccion + " n°" + centro.centro_mediacion.numero_dom + ")"
            }
        });        
    
    });  
  }

  cargarCentrosMediacionXUsuario(id_usuario: number){
    this.usuariosCentroService.listarCentrosActivosXUsuario(id_usuario).
      subscribe(respuesta => {
        this.listUsuarioCentrosMediacion= respuesta[0];
        this.elementosCentroMediacion = this.listUsuarioCentrosMediacion.map(centro => {
          return {
            clave: centro.centro_mediacion.id_centro_mediacion,
            value: centro.centro_mediacion.centro_mediacion + " (Municipio: " + centro.centro_mediacion.municipio.municipio + " - Barrio: " + centro.centro_mediacion.localidad_barrio + " - Dirección: " + centro.centro_mediacion.calle_direccion + " n°" + centro.centro_mediacion.numero_dom + ")"
            }
        });        
    
    });  
  }


  cargarUsuarios(id_centro_mediacion: number){
    this.usuariosCentroService.listarUsuariosActivosXCentro(id_centro_mediacion)
    .subscribe({
      next: (resultado) => {
        this.listUsuariosCentro = resultado[0]
        this.elementosUsuariosCentro = this.listUsuariosCentro.map(usuarioCentro => {
          return {
            clave: usuarioCentro.usuario_id,
            value: usuarioCentro.usuario.apellido +  " " + usuarioCentro.usuario.nombre + " (" + usuarioCentro.usuario.dni + ")"
            
          }
        });
      },
      error: (err) => {
        Swal.fire('Error al listar los usuarios',`${err.error.message}`,"error");
      } 
    })   
       
  }

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

  //MANEJO DE FORMULARIO DIALOG AUDIENCIAS
  openDialogAudiencia() {
    if(!this.dataUsuarioTramite.id_usuario_tramite){
      Swal.fire('Tramite sin mediador',`El tramite no tiene un mediador asignado`,"warning");
      return
    }

    console.log("usuariotramite", this.dataUsuarioTramite);

    this.cargarCentrosMediacionXUsuario(this.dataUsuarioTramite.usuario_id);
    //this.listarTiposAudiencia()
    this.audienciaDialog = true;
    this.formaAudiencia.reset();    

    return Object.values(this.formaAudiencia.controls).forEach(control => control.markAsUntouched());    
  }
  
  hideDialogAudiencia() {
    this.elementosUsuarios = [];
    this.elementosCentroMediacion = [];
    this.msgs = [];
    this.audienciaDialog = false;
    
  }
  //FIN MANEJO FORMULARIO DIALOG AUDIENCIAS....................................

  //MANEJO FORMULARIO DIALOG AUDIENCIAS DEL USUARIO
  openDialogAudienciaUsuario() {
    this.buscarAudienciasByUsuario();
    this.audienciaUsuarioDialog = true;
    // this.formaAudiencia.reset();    

    // return Object.values(this.formaAudiencia.controls).forEach(control => control.markAsUntouched());    
  }
  
  hideDialogAudienciaUsuario() {
    
    this.msgs = [];
    this.audienciaUsuarioDialog = false;
    
  }
  //FIN MANEJO FORMULARIO DIALOG AUDIENCIAS DEL USUARIO....................................

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

  //MANEJO FORMULARIO DIALOG CERRAR AUDIENCIA
  openDialogAudienciaCerrar(audiencia: AudienciaModel) {
    this.dataAudiencia = audiencia;
    this.audienciaCerrarDialog = true;
    // this.formaAudiencia.reset();    

    // return Object.values(this.formaAudiencia.controls).forEach(control => control.markAsUntouched());    
  }
  
  hideDialogAudienciaCerrar() {
    
    this.msgs = [];
    this.audienciaCerrarDialog = false;
    
  }
  //FIN MANEJO FORMULARIO DIALOG CERRAR AUDIENCIA................................................

  changeFormatoFechaGuardar(nuevaFecha: Date){
    let fechaAuxiliar:any = null;
    if(nuevaFecha != null){
      fechaAuxiliar = this.datePipe.transform(nuevaFecha,"yyyy-MM-dd")!;
      
    }
    return fechaAuxiliar;
  }
  
}
