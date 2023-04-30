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
  dataTramite: TramiteModel= new TramiteModel;
  dataUsuarioTramite: UsuarioTramiteModel= {};
  //listas
  listCentrosMediacion: CentroMediacionModel[]=[];
  listDepartamentos: DepartamentoModel[] = [];
  listFuncionTramite: FuncionTtramiteModel[] = [];
  listUsuarios: UsuarioModel[]=[];
  listUsuariosCentro: UsuarioCentroModel[]=[];
  listUsuariosTramite: UsuarioTramiteModel[]=[];
  elementosCentroMediacion: ElementoModel[]=[];  
  elementosUsuarios: ElementoModel[]=[];
  elementosUsuariosCentro: ElementoModel[]=[];

  //variables
  loadingUsuariosTramite: boolean = true;
  loadingMediadores: boolean = true;
  loadingFuncionTramite: boolean = true;
  usuarioTramiteDialog: boolean = false;

  //FORMULARIOS
  formaMediadorAsignado: FormGroup;  

  constructor(
    private fb: FormBuilder,
    private readonly datePipe: DatePipe,
    public dataService: DataService,
    private usuarioService: UsuariosService,
    private centroMediacionService: CentrosMediacionService,
    private usuariosCentroService: UsuariosCentroService,
    private usuarioTramiteService: UsuariosTramiteService,
    private funcionTramiteService: FuncionTramiteService
    
  ) { 
    //FIN CONSTRUCTOR
    
    console.log("tramite recibido", this.dataTramite);

    //FORMULARIO 
    this.formaMediadorAsignado = this.fb.group({
      centro_mediacion_id: [0,[Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(1)]],
      detalles: ['',[Validators.required, Validators.minLength(1), Validators.maxLength(200)]],        
      departamento_id_centro: [1,[Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(2)]],     
      funcion_tramite_id: [0,[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.min(1)]],
      usuario_id: [0,[Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(1)]]
      //departamento_id_centro: [1,[Validators.required, Validators.pattern(/^(?!1)\d+$/)]],
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
      { type: 'minlength', message: 'La cantidad mínima de caracteres es 1.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 200.' }
    ],  
    'departamento_id_centro': [
      { type: 'required', message: 'El departamento es requerido.' },
      { type: 'pattern', message: 'Debe seleccionar un departamento.' },
      { type: 'min', message: 'Debe seleccionar un departamento.' },
    ],
    'funcion_tramite_id': [
      { type: 'required', message: 'La función en el tramite es requerida.' },
      { type: 'pattern', message: 'Debe seleccionar un una función.' },
      { type: 'min', message: 'Debe seleccionar una función.' },
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

  ngOnInit(): void {
    //obtener tramite
    this.dataTramite= this.dataService.tramiteData;
    if(this.dataTramite){
      this.buscarAsignacionByNumTramiteActivo();      
    }    
    this.listDepartamentos = departamentos;
    this.listarMediadores();
    this.listarFuncionTramite();
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
          this.loadingUsuariosTramite = false;  
          //Swal.fire('Error',`Error al buscar tramite asignado: ${err.error.message}`,"error") 
        }
      });       
  }

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
    
    });
  }  
  //FIN LISTADO DE MEDIADORES............................

  //LISTADO DE TRAMITES
  listarFuncionTramite(){    
    this.funcionTramiteService.listarFuncionTramitesTodos().
        subscribe(respuesta => {
        this.listFuncionTramite= respuesta[0];
        this.loadingFuncionTramite = false;  
    
    });
  }
  //FIN LISTADO DE TRAMITES............................

  
  onChangeDepartamentoParaCentros(){
    const id = this.formaMediadorAsignado.get('departamento_id_centro')?.value;
    if(id != null){               
        this.cargarCentrosMediacion(parseInt(id.toString()));        
    }
  }

  cargarCentrosMediacion(id_departamento: number){
    this.centroMediacionService.listarCentroMediacionXDepartamento(id_departamento)
    .subscribe({
      next: (respuesta) => {
        this.listCentrosMediacion= respuesta[0];
        this.elementosCentroMediacion = [];
        this.elementosCentroMediacion = this.listCentrosMediacion.map(centro => {
          return {
            clave: centro.id_centro_mediacion,
            value: centro.centro_mediacion + " (municipio: " + centro.municipio.municipio + " - dirección: " + centro.localidad_barrio + " - " + centro.calle_direccion + " n° " + centro.numero_dom + ")"
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

  onChangeCentroMediacion(){
    const id = this.formaMediadorAsignado.get('centro_mediacion_id')?.value;
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
        this.listUsuariosCentro = resultado[0]
        this.elementosUsuariosCentro = [];
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

  

  //MANEJO DE FORMULARIO DIALOG
  openDialogUsuarioTramite() {
    this.usuarioTramiteDialog = true;
    this.formaMediadorAsignado.reset();    
    console.log("formulario abrir", this.formaMediadorAsignado.controls);
    return Object.values(this.formaMediadorAsignado.controls).forEach(control => control.markAsUntouched());
    
  }
  
  hideDialogUsuarioTramite() {
    this.elementosUsuarios = [];
    this.elementosCentroMediacion = [];
    this.msgs = [];
    console.log("formulario reset", this.formaMediadorAsignado.controls);
    this.usuarioTramiteDialog = false;
    
  }    
  //FIN MANEJO FORMULARIO DIALOG....................................
}
