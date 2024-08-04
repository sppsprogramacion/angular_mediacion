import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

import { DataService } from 'src/app/service/data.service';
import { TramiteModel } from '../../../models/tramite.model';
import { UsuarioModel } from '../../../models/usuario.model';
import { UsuarioTramiteModel } from '../../../models/usuario_tramite.model';
import { UsuariosTramiteService } from '../../../service/usuarios-tramite.service';
import { FuncionTramiteService } from '../../../service/funcion-tramite.service';
import { FuncionTtramiteModel } from 'src/app/models/funcion_tramite.model';
import { ElementoModel } from '../../../models/elemento.model';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { CentrosMediacionService } from '../../../service/centros-mediacion.service';
import { UsuariosCentroService } from '../../../service/usuarios-centro.service';
import { UsuarioCentroModel } from '../../../models/usuario_centro.model ';
import { TramitesService } from 'src/app/service/tramites.service';
import { ConvocadoModel } from 'src/app/models/convocado.model';
import { VinculadoModel } from 'src/app/models/vinculado.model';
import { AudienciasService } from 'src/app/service/audiencias.service';
import { AudienciaModel } from 'src/app/models/audiencia.model';
import { TiposAudienciaService } from 'src/app/service/tipos-audiencia.service';
import { TipoAudienciaModel } from 'src/app/models/tipo_audiencia.model';
import { ModalidadModel } from '../../../models/modalidad.model';
import { ModalidadService } from 'src/app/service/modalidad.service';
import { ResultadoAudienciaModel } from '../../../models/resultadoAudiencia.model';
import { ResultadosAudienciaService } from '../../../service/resultados-audiencia.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { DataMokeadaService } from '../../../service/data-mokeada.service';

@Component({
  selector: 'app-tramites-administrar-mediador',
  templateUrl: './tramites-administrar-mediador.component.html',
  providers: [MessageService, ConfirmationService,DatePipe],
  styleUrls: ['./tramites-administrar-mediador.component.scss']
})
export class TramitesAdministrarMediadorComponent implements OnInit {

  //MENSAJES
  msgs: Message[] = []; 
  msgsModificarConvocado: Message[] = []; 

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
  listCentrosMediacion: UsuarioCentroModel[]=[];
  listDepartamentos: DepartamentoModel[] = [];
  listFuncionTramite: FuncionTtramiteModel[] = [];
  listModalidad: ModalidadModel[] = [];
  listResultadosAudiencia: ResultadoAudienciaModel[]=[];
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
  convocadoModificarDialog: boolean = false;
  vinculadoDialog: boolean = false;

  //FORMULARIOS
  formaAudiencia: FormGroup;
  formaAudienciaCerrar: FormGroup;
  formaConvocado: FormGroup; 
  formaFinalizarTramite: FormGroup;
  formaMediadorAsignado: FormGroup; 

  posicion: string = "top";

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private readonly datePipe: DatePipe,
    private router: Router,
    public dataService: DataService,
    private audienciaService: AudienciasService,
    private dataMokeadaService: DataMokeadaService,
    private funcionTramiteService: FuncionTramiteService,
    private modalidadService: ModalidadService,
    private resultadosAudienciaService: ResultadosAudienciaService,
    private tiposAudienciaService: TiposAudienciaService,
    private tramiteService: TramitesService,   
    private usuariosCentroService: UsuariosCentroService,
    private usuarioTramiteService: UsuariosTramiteService,
    
  ) { 
    //OBTENER EL TRAMITE

    //FORMULARIO 
    
    this.formaAudiencia = this.fb.group({
      centro_mediacion_id: [0,[Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(1)]],
      detalles: ['',[Validators.required, Validators.minLength(1), Validators.maxLength(300)]], 
      fecha_inicio: [,[Validators.required]],   
      hora_inicio: [,[Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)]],     
      hora_fin: [,[Validators.required]],          
      modalidad_id: [1,[Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(1)]],     
      tipo_audiencia_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.min(1)]]
    });
    
    this.formaAudienciaCerrar = this.fb.group({
      resultado_audiencia_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],       
      observacion_resultado: ['',[Validators.required, Validators.minLength(1), Validators.maxLength(1000)]],      
      
    });

    this.formaConvocado = this.fb.group({
      apellido: ['',[Validators.required, Validators.pattern(/^[A-Za-zñÑ0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      nombre:   ['',[Validators.required, Validators.pattern(/^[A-Za-zñÑ0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      dni: ['',[Validators.pattern(/^[0-9]*$/), Validators.minLength(5)]],
      sexo_id: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],   
    });
    
    this.formaFinalizarTramite = this.fb.group({             
      observacion_finalizacion: ['',[Validators.required, Validators.nullValidator, Validators.minLength(1), Validators.maxLength(1000)]],      
      
    });

    this.formaMediadorAsignado = this.fb.group({
      detalles: ['',[Validators.required, Validators.minLength(1), Validators.maxLength(200)]],      
      funcion_tramite_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],       
      
    });
  }
  //FIN CONSTRUCTOR................................................................................
  
  ngOnInit(): void {
    
    //obtener tramite    
    this.dataTramiteAux= this.dataService.tramiteData;
    if(this.dataTramiteAux.numero_tramite){  
      
      this.buscarTramite();
      this.buscarAsignacionByNumTramiteActivo();
      this.buscarAudienciasByNumTramiteActivo();       
    }  
    else{

      this.router.navigateByUrl("admin/tramites/nuevoslis");
    }  
    //fin obtener tramite

    this.dataMokeadaService.listarModalidad().subscribe(modalidad => {
      this.listModalidad = modalidad;
    });

    this.dataMokeadaService.listarTipoAudiaencia().subscribe(tipoAudiencia => {
      this.listTipoAudiencia = tipoAudiencia;
    });
      
    
  }
  //FIN ONINIT......................................................................................

  //MENSAJES DE VALIDACIONES
  user_validation_messages = {
    //datos tramite 
    'apellido': [
      { type: 'required', message: 'El apellido es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números, letras y espacios.' },
      { type: 'minlength', message: 'La cantidad mínima de caracteres es 2.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 100.' }
    ],
    'dni': [
      { type: 'required', message: 'El dni es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' },
      { type: 'minlength', message: 'El número ingresado debe tener mas de 5 digitos.' }
    ],
    'detalles': [
      { type: 'required', message: 'El detalle es requerido.' },
      { type: 'minlength', message: 'La cantidad mínima de caracteres es 1.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 200.' }
    ],  
    'detalles_nueva_audiencia': [
      { type: 'required', message: 'El detalle es requerido.' },
      { type: 'minlength', message: 'La cantidad mínima de caracteres es 1.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 300.' }
    ],  
    'fecha_inicio': [
      { type: 'required', message: 'La fecha de inicio es requerida.' },
    ],
    'funcion_tramite_id': [
      { type: 'required', message: 'La función en el tramite es requerida.' },
      { type: 'pattern', message: 'Debe seleccionar un una función.' },
    ],
    'hora': [
      { type: 'required', message: 'La hora de inicio es requerida.' },
      { type: 'pattern', message: 'El formato de la hora no es correcto.' },
    ],    
    'modalidad_id': [
      { type: 'required', message: 'La modalidad es requerida.' },
      { type: 'pattern', message: 'Debe seleccionar una modalidad.' },
    ],
    'nombre': [
      { type: 'required', message: 'El nombre es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números, letras y espacios.' },
      { type: 'minlength', message: 'La cantidad mínima de caracteres es 2.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 100.' }
    ],
    'observacion_resultado': [
      { type: 'required', message: 'La observacion es requerida.' },
      { type: 'minlength', message: 'La cantidad mínima de caracteres es 1.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 1000.' }
    ],  
    'observacion_finalizacion': [
      { type: 'required', message: 'La observacion es requerida.' },
      { type: 'nullValidator', message: 'Debe ingresar caracteres no vacios.' },
      { type: 'minlength', message: 'La cantidad mínima de caracteres es 1.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 1000.' }
    ], 
    'resultado_audiencia_id': [
      { type: 'required', message: 'El resultado de la audiencia es requerido.' },
      { type: 'pattern', message: 'Debe seleccionar un resultado de la audiencia.' },
    ],
    'sexo_id': [
      { type: 'required', message: 'El sexo es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' }
    ],
    'tipo_audiencia_id': [
      { type: 'required', message: 'El tipo de audiencia es requerido.' },
      { type: 'pattern', message: 'Debe seleccionar un tipo de audiencia.' },
    ],

  }
  //FIN MENSAJES DE VALIDACIONES...............................................................

  //VALIDACIONES DE FORMULARIO
  

  isValidAudiencia(campo: string): boolean{     
    
    return this.formaAudiencia.get(campo)?.invalid && this.formaAudiencia.get(campo)?.touched;      
  }

  isValidAudienciaCerrar(campo: string): boolean{     
    
    return this.formaAudienciaCerrar.get(campo)?.invalid && this.formaAudienciaCerrar.get(campo)?.touched;      
  }

  isValidConvocado(campo: string): boolean{     
    
    return this.formaConvocado.get(campo)?.invalid && this.formaConvocado.get(campo)?.touched;      
  }

  isValidFinalizarTramite(campo: string): boolean{     
    
    return this.formaFinalizarTramite.get(campo)?.invalid && this.formaFinalizarTramite.get(campo)?.touched;      
  }

  isValidRecibirTramite(campo: string): boolean{     
    
    return this.formaMediadorAsignado.get(campo)?.invalid && this.formaMediadorAsignado.get(campo)?.touched;      
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
      usuario_id: this.authService.currentUserLogin.id_usuario,
      detalles: this.formaMediadorAsignado.get('detalles')?.value,
      funcion_tramite_id: parseInt(this.formaMediadorAsignado.get('funcion_tramite_id')?.value),             
    };
    
    
    //GUARDAR NUEVO USUARIO-TRAMITE
    this.usuarioTramiteService.guardarUsuarioTramite(dataMediadorAsignado)
      .subscribe({
        next: (resultado) => {
          let usuarioTramiteRes: UsuarioTramiteModel = resultado;
          this.buscarTramite();
          Swal.fire('Exito',`La asignacion de mediador se realizo con exito`,"success");

        },
        error: (err) => {
          Swal.fire('Error',`Error al realizar la asignacion: ${err.error.message}`,"error") 
        }
      });         
    //FIN GUARDAR NUEVO USUARIO-TRAMITE

  }    
  //FIN GUARDAR USUARIO-TRAMITE............................................................

  //GUARDAR NUEVA AUDIENCIA
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
  //GUARDAR NUEVA AUDIENCIA...............................................................

  //GUARDAR CERRAR AUDIENCIA
  submitFormAudienciaCerrar(){
    if(this.formaAudienciaCerrar.invalid){
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: 'Datos inválidos', detail: 'Revise los datos cargados. ' });
      return Object.values(this.formaAudienciaCerrar.controls).forEach(control => control.markAsTouched());
    }

    let dataAudienciaAux: Partial<AudienciaModel>;
    dataAudienciaAux = {      
      resultado_audiencia_id: parseInt(this.formaAudienciaCerrar.get('resultado_audiencia_id')?.value), 
      observacion_resultado: this.formaAudienciaCerrar.get('observacion_resultado')?.value,
      usuario_id: this.dataUsuarioTramite.usuario_id,
                  
    }; 

    //GUARDAR NUEVO AUDIENCIA
    this.audienciaService.guardarAudienciaCerrar(this.dataAudiencia.id_audiencia, dataAudienciaAux)
      .subscribe({
        next: (resultado) => {
          let audienciaRes: AudienciaModel = resultado;
          this.hideDialogAudienciaCerrar();
          this.buscarAudienciasByNumTramiteActivo();
          Swal.fire('Exito',`La audiencia se cerró con exito`,"success");
        },
        error: (err) => {
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'Error al guardar', detail: ` ${err.error.message}` });
        }
      });         
    //FIN GUARDAR NUEVO AUDIENCIA

  }
  //GUARDAR CERRAR AUDIENCIA...............................................................

  //GUARDAR FINALIZAR TRAMITE
  submitFormFinalizarTramite(){
    if(this.formaFinalizarTramite.invalid){
      Swal.fire('No se finalizó el tramite', "Error: complete correctamente los campos del formulario" ,"warning");
      return Object.values(this.formaFinalizarTramite.controls).forEach(control => control.markAsTouched());
    }

    let dataTramiteAux: Partial<TramiteModel>;
    dataTramiteAux = {     
      
      observacion_finalizacion: this.formaFinalizarTramite.get('observacion_finalizacion')?.value.trim(),
                  
    }; 

    //GUARDAR FINALIZAR TRAMITE
    this.tramiteService.guardarFinalizarTramite(this.dataTramite.numero_tramite, dataTramiteAux)
      .subscribe({
        next: (resultado) => {
          let tramite: TramiteModel = resultado;
          
          Swal.fire('Exito',`El tramite se finalizó con exito`,"success");
          this.irTramitesFinalizados();
        },
        error: (err) => {

          Swal.fire('No se finalizó el tramite', `Error: ${err.error.message}`,"error");
        }
      });         
    //FIN GUARDAR FINALIZAR TRAMITE

  }
  //FIN GUARDAR FINALIZAR TRAMITE...............................................................

  //GUARDAR MODIFICAR CONVOCADO
  submitFormConvocadoModificar(){
    //VAIDACIONES DE FORMULARIOS
    if(this.formaConvocado.invalid){        
      this.msgs = [];                
      this.msgs.push({ severity: 'warning', summary: 'Datos invalidos', detail: 'Revise los datos personales. ' });
      Object.values(this.formaConvocado.controls).forEach(control => control.markAsTouched());
    }
       
    //FIN VAIDACIONES DE FORMULARIOS

    
  }
  //FIN GUARDAR MODIFICAR CONVOCADO...................................................


  //BUSCAR TRAMITE 
  buscarTramite(){  
    this.dataTramite = {};  
    this.tramiteService.buscarTramiteNumTram(this.dataService.tramiteData.numero_tramite)
      .subscribe({
        next: (resultado) => {          
          this.dataTramite = {};
          this.dataTramite = resultado;  
          if(this.dataTramite.estado_tramite_id === 1){
      
            this.isNuevo = true;
            //cargar datos formulario recibir tramite
            this.cargarCentrosMediacion(this.authService.currentUserLogin.id_usuario);
            this.listarFuncionTramite();
          }  
          
          if(this.dataTramite.estado_tramite_id === 2) {
            this.isNuevo= false;
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
  listarResultadosAudiencia(){    
    this.resultadosAudienciaService.listarResultadoAudienciaTodos().
        subscribe(respuesta => {
        this.listResultadosAudiencia= respuesta[0];
    
    });
  }
  //FIN LISTADO DE TIPO AUDIENCIAS............................
  

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
    this.dataConvocado = {};
    this.convocadoDialog = false;    
  }    
  //FIN MANEJO FORMULARIO DIALOG CONVOCADO....................................

  //MANEJO DE FORMULARIO DIALOG MODIFICAR CONVOCADO
  openDialogModificarConvocado(convocado: ConvocadoModel) {
    this.formaConvocado.get('apellido')?.setValue(this.dataConvocado.apellido);
    this.formaConvocado.get('nombre')?.setValue(this.dataConvocado.nombre);
    this.formaConvocado.get('dni')?.setValue(this.dataConvocado.dni);
    this.formaConvocado.get('sexo_id')?.setValue(this.dataConvocado.sexo_id);  

    this.convocadoModificarDialog = true;     
  }
  
  hideDialogModificarConvocado() {    
    this.msgsModificarConvocado = [];
    this.formaConvocado.reset();  
    this.convocadoModificarDialog = false;    
  }    
  //FIN MANEJO FORMULARIO DIALOG MODIFICAR CONVOCADO....................................

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

    this.cargarCentrosMediacionXUsuario(this.dataUsuarioTramite.usuario_id);

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
    this.listarResultadosAudiencia();
    this.dataAudiencia = audiencia;
    this.audienciaCerrarDialog = true;
    this.formaAudienciaCerrar.reset();    

    return Object.values(this.formaAudienciaCerrar.controls).forEach(control => control.markAsUntouched());    
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

  //ACCEDER A TRAMITES FINALIZADOS
  irTramitesFinalizados(){
    this.router.navigateByUrl("admin/tramites/finalizados");    
  }
  //FIN ACCEDER A DATA SERVICE
  
}
