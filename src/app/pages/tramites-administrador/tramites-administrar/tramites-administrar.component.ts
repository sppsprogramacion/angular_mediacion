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
import { CentroMediacionModel } from 'src/app/models/centro_mediacion.model';
import { CentrosMediacionService } from '../../../service/centros-mediacion.service';
import { UsuariosCentroService } from '../../../service/usuarios-centro.service';
import { UsuarioCentroModel } from '../../../models/usuario_centro.model ';
import { TramitesService } from 'src/app/service/tramites.service';
import { ModalidadModel } from 'src/app/models/modalidad.model';
import { TipoAudienciaModel } from 'src/app/models/tipo_audiencia.model';
import { TiposAudienciaService } from 'src/app/service/tipos-audiencia.service';
import { AudienciaModel } from 'src/app/models/audiencia.model';
import { AudienciasService } from '../../../service/audiencias.service';
import { ConvocadoModel } from 'src/app/models/convocado.model';
import { VinculadoModel } from 'src/app/models/vinculado.model';
import { Router } from '@angular/router';
import { DataMokeadaService } from 'src/app/service/data-mokeada.service';

@Component({
  selector: 'app-tramites-administrar',
  templateUrl: './tramites-administrar.component.html',
  providers: [MessageService, ConfirmationService,DatePipe],
  styleUrls: ['./tramites-administrar.component.scss']
})
export class TramitesAdministrarComponent implements OnInit {

  //MENSAJES
  msgs: Message[] = []; 
  
  //MODELOS
  dataAudiencia: AudienciaModel = new AudienciaModel;
  dataConvocado: ConvocadoModel = {};
  dataTramite: TramiteModel= new TramiteModel;
  dataTramiteAux: TramiteModel= new TramiteModel;
  dataUsuarioTramite: UsuarioTramiteModel= {};  
  dataVinculado: VinculadoModel = {};

  //listas
  listAudiencias: AudienciaModel[] = [];
  listAudienciasUsuario: AudienciaModel[] = [];
  listCentrosMediacion: CentroMediacionModel[]=[];
  listModalidad: ModalidadModel[] = [];
  listUsuarioCentrosMediacion: UsuarioCentroModel[]=[];
  listDepartamentos: DepartamentoModel[] = [];
  listFuncionTramite: FuncionTtramiteModel[] = [];
  listTipoAudiencia: TipoAudienciaModel[] = [];
  listUsuarios: UsuarioModel[]=[];
  listUsuariosCentro: UsuarioCentroModel[]=[];
  listUsuariosTramite: UsuarioTramiteModel[]=[];
  elementosCentroMediacion: ElementoModel[]=[];  
  elementosModalidad: ModalidadModel[] = [];
  elementosTipoAudiencia: TipoAudienciaModel[] = [];
  elementosUsuarios: ElementoModel[]=[];
  elementosUsuariosCentro: ElementoModel[]=[];

  //variables booleanas
  loadingAudiencia: boolean = true;
  loadingAudienciaUsuario: boolean = true;
  loadingUsuariosTramite: boolean = true;
  loadingMediadores: boolean = true;
  loadingFuncionTramite: boolean = true;
  audienciaDialog: boolean = false;
  audienciaUsuarioDialog: boolean = false;
  audienciaVerDialog: Boolean = false;  
  convocadoDialog: boolean = false;  
  usuarioTramiteDialog: boolean = false;
  vinculadoDialog: boolean = false;

  //FORMULARIOS
  formaMediadorAsignado: FormGroup;  
  formaAudiencia: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly datePipe: DatePipe,
    private router: Router,

    public dataService: DataService,
    private audienciaService: AudienciasService,
    private centroMediacionService: CentrosMediacionService,
    private dataMokeadaService: DataMokeadaService,
    private funcionTramiteService: FuncionTramiteService,
    private tiposAudienciaService: TiposAudienciaService,
    private tramiteService: TramitesService,
    private usuariosCentroService: UsuariosCentroService,
    private usuarioService: UsuariosService,
    private usuarioTramiteService: UsuariosTramiteService,
    
  ) { 
    //FIN CONSTRUCTOR
    
    //FORMULARIO 
    this.formaMediadorAsignado = this.fb.group({
      detalles: ['',[Validators.maxLength(200)]],     
      centro_mediacion_id: [0,[Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(1)]],         
      departamento_id_centro: [1,[Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(2)]],     
      funcion_tramite_id: [0,[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.min(1)]],
      usuario_id: [0,[Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(1)]]
    });

    this.formaAudiencia = this.fb.group({
      centro_mediacion_id: [0,[Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(1)]],
      detalles: ['',[Validators.maxLength(200)]], 
      fecha_inicio: [,[Validators.required]],   
      hora_inicio: [,[Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)]],     
      hora_fin: [,[Validators.required]],          
      modalidad_id: [1,[Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(2)]],     
      tipo_audiencia_id: [0,[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.min(1)]]
    });
  }
  //FIN CONSTRUCTOR................................................................................

  //MENSAJES DE VALIDACIONES
  user_validation_messages = {
    //datos tramite    
    'centro_mediacion_id': [
      { type: 'required', message: 'El centro de mediación es requerido.' },
      { type: 'pattern', message: 'Debe seleccionar un centro de mediación.' },
      { type: 'min', message: 'Debe seleccionar un centro de mediación.' },
    ],    
    'detalles': [
      { type: 'required', message: 'El detalle es requerido.' },
      { type: 'minlength', message: 'La cantidad mínima de caracteres es 5.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 200.' }
    ],  
    'departamento_id_centro': [
      { type: 'required', message: 'El departamento es requerido.' },
      { type: 'pattern', message: 'Debe seleccionar un departamento.' },
      { type: 'min', message: 'Debe seleccionar un departamento.' },
    ],
    'fecha_inicio': [
      { type: 'required', message: 'La fecha de inicio es requerida.' },
    ],  
    'funcion_tramite_id': [
      { type: 'required', message: 'La función en el tramite es requerida.' },
      { type: 'pattern', message: 'Debe seleccionar un una función.' },
      { type: 'min', message: 'Debe seleccionar una función.' },
    ],
    'hora_inicio': [
      { type: 'required', message: 'La hora  de inicio es requerida.' },
      { type: 'pattern', message: 'La hora  de inicio ingresada no es válida.' },
    ],  
    'hora_fin': [
      { type: 'required', message: 'La hora fin es requerida.' },
      { type: 'pattern', message: 'La hora fin ingresada no es válida.' },
    ],    
    'modalidad_id': [
      { type: 'required', message: 'La modalidad es requerida.' },
      { type: 'pattern', message: 'Debe seleccionar un una modalidad.' },
      { type: 'min', message: 'Debe seleccionar una modalidad.' },
    ],
    'tipo_audiencia_id': [
      { type: 'required', message: 'El tipo de audiencia es requerida.' },
      { type: 'pattern', message: 'Debe seleccionar el tipo de audiencia.' },
      { type: 'min', message: 'Debe seleccionar el tipo de audiencia.' },
    ],
    'usuario_id': [
      { type: 'required', message: 'El usuario es requerido.' },
      { type: 'pattern', message: 'Debe seleccionar un usuario.' },
      { type: 'min', message: 'Debe seleccionar un usuario.' },
    ],
  }
  //FIN MENSAJES DE VALIDACIONES...............................................................

  //VALIDACIONES DE FORMULARIO
  isValid(campo: string): boolean{     
    
    return this.formaMediadorAsignado.get(campo)?.invalid && this.formaMediadorAsignado.get(campo)?.touched;      
  }

  isValidAudiencia(campo: string): boolean{     
    
    return this.formaAudiencia.get(campo)?.invalid && this.formaAudiencia.get(campo)?.touched;      
  }

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

    this.dataMokeadaService.listarDepartamentos().subscribe(departamentos => {
      this.listDepartamentos = departamentos;
    });

    this.dataMokeadaService.listarModalidad().subscribe(modalidad => {
      this.listModalidad = modalidad;
    });
    //this.listModalidad = modalidad;

    this.listarMediadores();
    
  }
  //FIN ONINIT......................................................................................

  //GUARDAR USUARIO-TRAMITE  
  submitFormUsuarioTramite(){
    if(this.formaMediadorAsignado.invalid){
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: 'Datos inválidos', detail: 'Revise los datos cargados. ' });
      console.log("formulario enviado", this.formaMediadorAsignado.controls);
      return Object.values(this.formaMediadorAsignado.controls).forEach(control => control.markAsTouched());
    }

    let dataMediadorAsignado: Partial<UsuarioTramiteModel>;
    dataMediadorAsignado = {
      tramite_numero: this.dataTramite.numero_tramite,      
      usuario_id: parseInt(this.formaMediadorAsignado.get('usuario_id')?.value),
      detalles: this.formaMediadorAsignado.get('detalles')?.value,
      funcion_tramite_id: parseInt(this.formaMediadorAsignado.get('funcion_tramite_id')?.value),             
    };    
    
    //GUARDAR NUEVO USUARIO-TRAMITE
    this.usuarioTramiteService.guardarUsuarioTramite(dataMediadorAsignado)
      .subscribe({
        next: (resultado) => {
          let usuarioTramiteRes: UsuarioTramiteModel = resultado;
          this.hideDialogUsuarioTramite();
          this.buscarTramite();
          this.buscarAsignacionByNumTramiteActivo();
          Swal.fire('Exito',`La asignacion de usuario se realizo con exito`,"success");
        },
        error: (err) => {
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'Error al guardar', detail: ` ${err.error.message}` });
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

  //BUSCAR ASIGNACIONES DE USUARIOS X NUMERO TRAMITE ACTIVO
  buscarAsignacionByNumTramiteActivo(){
    this.usuarioTramiteService.buscarByNumTramiteActivo(this.dataService.tramiteData.numero_tramite)
      .subscribe({
        next: (resultado) => {
          this.listUsuariosTramite = resultado[0];  
          this.loadingUsuariosTramite = false;     
        },
        error: (err) => {
          this.dataUsuarioTramite= {};
          this.loadingUsuariosTramite = false;  
          //Swal.fire('Error',`Error al buscar tramite asignado: ${err.error.message}`,"error") 
        }
      });       
  }
  //FIN BUSCAR ASIGNACIONES DE USUARIOS X NUMERO TRAMITE ACTIVO.................................

  //BUSCAR MEDIADOR DEL TRAMITE X NUMERO TRAMITE ACTIVO
  buscarMediadorByNumTramiteActivo(){
    this.usuarioTramiteService.buscarMediadorByNumTramiteActivo(this.dataService.tramiteData.numero_tramite)
      .subscribe({
        next: (resultado) => {
          this.dataUsuarioTramite = resultado; 
          console.log("mediador del tramite", this.dataUsuarioTramite); 
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
          if(this.dataTramite.estado_tramite_id === 2) {
            this.buscarMediadorByNumTramiteActivo();
          }
        }
      });    
  }
  //FIN BUSCAR TRAMITE................................................................... 

  //BUSCAR AUDIENCIAS POR NUMERO DE TRAMITE
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
  //FIN BUSCAR AUDIENCIAS POR NUMERO DE TRAMITE...................................

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

  //CONFIRMAR DESHABILITACION USUARIO-TRAMITE
  confirmarDeshabilitarUsuario(dataUsuarioTramite:UsuarioTramiteModel){    
    Swal.fire({
      title: 'Deshabilitar este usuario del tramite?',
      text: 'No podrá deshacer esta acción luego de confirmar',
      icon: 'warning',
      showDenyButton: true,
      //showCancelButton: true,
      confirmButtonText: `Confirmar`,
      confirmButtonColor:"#3085d6",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.deshabilitarUsuarioTramite(dataUsuarioTramite)
      }
    })    
  }
  //FIN CONFIRMAR DESHABILITACION USUARIO-TRAMITE

  //DESHABILITAR USUARIO-CENTRO
  deshabilitarUsuarioTramite(dataUsuarioTramite:UsuarioTramiteModel){
    this.usuarioTramiteService.deshabilitarUsuarioTramite(dataUsuarioTramite.id_usuario_tramite)
    .subscribe({
      next: (resultado) => {
        let usuarioCentroRes: UsuarioTramiteModel = resultado[0];
        Swal.fire('Exito',`El usuario fue deshabilitado correctamente`,"success");
        this.buscarAsignacionByNumTramiteActivo();
      },
      error: (err) => {
        Swal.fire("El usuario no fue deshabilitado",`${err.error.message}`,"error");
      }
    });
  }
  //FIN DESHABILITAR USUARIO-CENTRO.................................................

  //LISTADO DE MEDIADORES
  listarMediadores(){    
    this.usuarioService.listarUsuariosTodos()
      .subscribe(respuesta => {
        this.listUsuarios= respuesta[0];
        this.loadingMediadores = false;  
        this.elementosUsuarios = this.listUsuarios.map(usuario => {
          return {
            clave: usuario.id_usuario,
            value: usuario.apellido + " " + usuario.nombre + " (" + usuario.dni + ")"
            }
        });

        //BUSCAR FUNCIONES
        this.funcionTramiteService.listarFuncionTramitesTodos()
          .subscribe(respuesta => {
            this.listFuncionTramite= respuesta[0];
            console.log("funciones", this.listFuncionTramite);
            this.loadingFuncionTramite = false;  
          
          });
    
      });
  }  
  //FIN LISTADO DE MEDIADORES............................

  //LISTADO DE TRAMITES
  listarFuncionTramite(){    
    this.funcionTramiteService.listarFuncionTramitesTodos().
        subscribe(respuesta => {
        this.listFuncionTramite= respuesta[0];
        console.log("funciones", this.listFuncionTramite);
        this.loadingFuncionTramite = false;  
    
    });
  }
  //FIN LISTADO DE TRAMITES............................

  //LISTADO DE TIPO AUDIENCIAS
  listarTiposAudiencia(){    
    this.tiposAudienciaService.listarTodos().
        subscribe(respuesta => {
        this.listTipoAudiencia= respuesta[0];
    
    });
  }
  //FIN LISTADO DE TIPO AUDIENCIAS............................

  
  onChangeDepartamentoParaCentros(){
    const id = this.formaMediadorAsignado.get('departamento_id_centro')?.value;
    if(id != null){               
        this.cargarCentrosMediacion(parseInt(id.toString()));        
    }
  }

  onChangeDepartamentoParaAudiencia(){
    const id = this.formaAudiencia.get('departamento_id_centro')?.value;
    if(id != null){               
        this.cargarCentrosMediacion(parseInt(id.toString()));        
    }
  }

  //CARGA DE CENTROS DE MEDIACION
  cargarCentrosMediacion(id_departamento: number){
    this.centroMediacionService.listarCentroMediacionXDepartamento(id_departamento)
    .subscribe({
      next: (respuesta) => {
        this.listCentrosMediacion= respuesta[0];
        this.elementosCentroMediacion = [];
        this.elementosCentroMediacion = this.listCentrosMediacion.map(centro => {
          return {
            clave: centro.id_centro_mediacion,
            value: centro.centro_mediacion + " (Municipio: " + centro.municipio.municipio + " - Barrio: " + centro.localidad_barrio + " - Dirección: " + centro.calle_direccion + " n° " + centro.numero_dom + ")"
          }
        });   
        if(this.elementosCentroMediacion.length > 0 ){
          let idCentroAux: number = this.elementosCentroMediacion[0].clave;
          console.log("value array", idCentroAux);            
          this.formaMediadorAsignado.get('centro_mediacion_id')?.setValue(idCentroAux);
          this.cargarUsuarios(idCentroAux)
        }
        
      },
      error: (err) => {
        Swal.fire('Error al listar los centros de mediacón',`${err.error.message}`,"error");
      } 
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
  //FI CARGA DE CENTROS DE MEDIACION.............................................

  onChangeCentroMediacion(formulario: string){
    let id: string;
    if(formulario == "usuario"){
      id = this.formaMediadorAsignado.get('centro_mediacion_id')?.value;
    }

    if(formulario == "audiencia"){
      id = this.formaAudiencia.get('centro_mediacion_id')?.value;
    }
    
    console.log("formulario usado", formulario);
    console.log("centro de mediacion onChange", id);
    if(id != null){               
        this.cargarUsuarios(parseInt(id.toString()));
        this.formaMediadorAsignado.get('usuario_id')?.setValue(0);               
        this.formaMediadorAsignado.get('usuario_id')?.reset();
        
    }
  }

  cargarUsuarios(id_centro_mediacion: number){
    
    this.usuariosCentroService.listarUsuariosActivosXCentro(id_centro_mediacion)
    .subscribe({
      next: (resultado) => {
        console.log("id centro cargar usuario", id_centro_mediacion);
        console.log("resultado", resultado);
        this.listUsuariosCentro = resultado[0]
        this.elementosUsuariosCentro = [];
        this.elementosUsuariosCentro = this.listUsuariosCentro.map(usuarioCentro => {
          return {
            clave: usuarioCentro.usuario_id,
            value: usuarioCentro.usuario.apellido +  " " + usuarioCentro.usuario.nombre + " (" + usuarioCentro.usuario.dni + ")"
            
          }
        });
        console.log("elementos usuqarios", this.listUsuariosCentro);
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

  //MANEJO DE FORMULARIO DIALOG
  openDialogUsuarioTramite() {
    //this.listarFuncionTramite();
    this.usuarioTramiteDialog = true;
    this.formaMediadorAsignado.reset();    
    return Object.values(this.formaMediadorAsignado.controls).forEach(control => control.markAsUntouched());
    
  }
  
  hideDialogUsuarioTramite() {
    this.elementosUsuarios = [];
    this.elementosCentroMediacion = [];
    this.msgs = [];
    this.usuarioTramiteDialog = false;
    
  }    

  //MANEJO DE FORMULARIO DIALOG AUDIENCIAS
  openDialogAudiencia() {
    if(!this.dataUsuarioTramite.id_usuario_tramite){
      Swal.fire('Tramite sin mediador',`El tramite no tiene un mediador asignado`,"warning");
      return
    }

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

  openDialogAudienciaUsuario() {
    this.buscarAudienciasByUsuario();
    this.audienciaUsuarioDialog = true;   
  }
  
  hideDialogAudienciaUsuario() {
    
    this.msgs = [];
    this.audienciaUsuarioDialog = false;    
  }

  openDialogAudienciaVer(audiencia: AudienciaModel) {
    this.dataAudiencia = audiencia;
    this.audienciaVerDialog = true;
  }
  
  hideDialogAudienciaVer() {
    
    this.audienciaVerDialog = false;    
  }
  //FIN MANEJO FORMULARIO DIALOG AUDIENCIAS....................................

  changeFormatoFechaGuardar(nuevaFecha: Date){
    let fechaAuxiliar:any = null;
    if(nuevaFecha != null){
      fechaAuxiliar = this.datePipe.transform(nuevaFecha,"yyyy-MM-dd")!;
      
    }
    return fechaAuxiliar;
  }
}
