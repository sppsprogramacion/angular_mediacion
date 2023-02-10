import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ElementoModel } from 'src/app/models/elemento.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { DataService } from 'src/app/service/data.service';
import { UsuariosService } from 'src/app/service/usuarios.service';
import Swal from 'sweetalert2';
import { CentroMediacionModel } from '../../../models/centro_mediacion.model';
import { UsuarioCentroModel } from '../../../models/usuario_centro.model ';
import { UsuariosCentroService } from '../../../service/usuarios-centro.service';

@Component({
  selector: 'app-centro-administrar',
  templateUrl: './centro-mediacion-administrar.component.html',
  providers: [MessageService],
  styleUrls: ['./centro-mediacion-administrar.component.scss']
})
export class CentroAdministrarComponent implements OnInit {
  loading: boolean = true

  //MENSAJES
  msgs: Message[] = []; 

  //MODELOS
  dataCentroMediacion: CentroMediacionModel= new CentroMediacionModel;
  dataUsuarioCentro: UsuarioCentroModel= new UsuarioCentroModel;

  //PARA FILTRAR EN TABLA
  @ViewChild('dt') table: Table;
  @ViewChild('filter') filter: ElementRef;

  //LISTAS    
  listUsuarios: UsuarioModel[]=[];
  listUsuariosCentro: UsuarioCentroModel[]=[];
  elementosUsuarios: ElementoModel[]=[];
  elementosSiNo: ElementoModel[]=[];
  // filtroDepartamentos: FiltroModel[]=[];
  // filtroMunicipios: FiltroModel[]=[];

  //VARIABLES CENTRO
  usuarioCentroDialog: boolean;

  //FORMULARIOS
  formaUsuarioCentroMediacion: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private readonly datePipe: DatePipe,
    public dataService: DataService,
    private usuariosCentrosService: UsuariosCentroService,
    private usuarioService: UsuariosService   
    
  ) {
    //FORMULARIOS
    this.formaUsuarioCentroMediacion = this.fb.group({
      
      //centro_mediacion_id: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      dni_usuario: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      detalles: [,[Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
      
    });
    //FIN FORMULARIOS.................

    //OBTENER EL TRAMITE
    this.dataCentroMediacion= dataService.centroMediacionData;

  }

  //MENSAJES DE VALIDACIONES
  user_validation_messages = {   
             
    'centro_mediacion_id': [
      { type: 'required', message: 'El centro de mediación es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' }
    ],
    'dni_usuario': [
      { type: 'required', message: 'Debe seleccionar un usuario, el DNI del usuario es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' }
    ],
    'detalles': [
        { type: 'required', message: 'El detalle es requerido.' },
        { type: 'minlength', message: 'La cantidad mínima de caracteres es 1.' },
        { type: 'maxlength', message: 'La cantidad máxima de caracteres es 200.' }
    ]    
  }
  //FIN MENSAJES DE VALIDACIONES...............................................................

  //VALIDACIONES DE FORMULARIO
  isValid(campo: string): boolean{     
    
    return this.formaUsuarioCentroMediacion.get(campo)?.invalid && this.formaUsuarioCentroMediacion.get(campo)?.touched;      
  }
  //FIN VALIDACIONES DE FORMULARIO.......................................

  ngOnInit(): void {
    this.listarMediadores();
    this.listarUsuariosActivosCentroMediacion();
  }
  //FIN ONINIT................................................

  //GUARDAR USUARIO-CENTRO  
  submitFormUsuarioCentro(){
    if(this.formaUsuarioCentroMediacion.invalid){
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: 'Datos inválidos', detail: 'Revise los datos cargados. ' });
      return Object.values(this.formaUsuarioCentroMediacion.controls).forEach(control => control.markAsTouched());
    }

    let dataRegistro: Partial<UsuarioCentroModel>;
    dataRegistro = {
      centro_mediacion_id: this.dataCentroMediacion.id_centro_mediacion,
      dni_usuario: parseInt(this.formaUsuarioCentroMediacion.get('dni_usuario')?.value),
      detalles: this.formaUsuarioCentroMediacion.get('detalles')?.value
    };
    //GUARDAR NUEVO USUARIO-CENTRO
    this.usuariosCentrosService.guardarUsuarioCentro(dataRegistro)
      .subscribe({
        next: (resultado) => {
          let usuarioCentroRes: UsuarioCentroModel = resultado[0];
          this.hideDialogUsuarioCentro();
          Swal.fire('Exito',`El registro se realizó correctamente`,"success");
          this.listarUsuariosActivosCentroMediacion();
        },
        error: (err) => {
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'Error al guardar', detail: ` ${err.error.message}` });
        }
      });
      
    //FIN GUARDAR NUEVO USUARIO-CENTRO   

  }
  //FIN GUARDAR USUARIO-CENTRO..................................................  

  //CONFIRMAR DESHABILITACION USUARIO-CENTRO
  confirmarDeshabilitarUsuario(dataUsuarioCentro:UsuarioCentroModel){    
    Swal.fire({
      title: 'Deshabilitar este usuario del centro de mediación?',
      text: 'No podrá deshacer esta acción luego de confirmar',
      icon: 'warning',
      showDenyButton: true,
      //showCancelButton: true,
      confirmButtonText: `Aceptar`,
      confirmButtonColor:"#3085d6",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.deshabilitarUsuarioCentro(dataUsuarioCentro)
      }
    })    
  }
  //FIN CONFIRMAR DESHABILITACION USUARIO-CENTRO

  //DESHABILITAR USUARIO-CENTRO
  deshabilitarUsuarioCentro(dataUsuarioCentro:UsuarioCentroModel){
    this.usuariosCentrosService.deshabilitarUsuarioCentro(dataUsuarioCentro.id_usuario_centro)
    .subscribe({
      next: (resultado) => {
        let usuarioCentroRes: UsuarioCentroModel = resultado[0];
        Swal.fire('Exito',`El usuario fue deshabilitado correctamente`,"success");
        this.listarUsuariosActivosCentroMediacion();
      },
      error: (err) => {
        Swal.fire('Fallo ',`El usuario no fue deshabilitado`,"error");
        // this.msgs = [];
        // this.msgs.push({ severity: 'error', summary: 'Error al guardar', detail: ` ${err.error.message}` });
      }
    });
  }
  //FIN DESHABILITAR USUARIO-CENTRO.................................................

  //LISTADO DE MEDIADORES
  listarMediadores(){    
    this.usuarioService.listarUsuariosTodos().
        subscribe(respuesta => {
        this.listUsuarios= respuesta[0];
        //this.loadingMediadores = false;  
        this.elementosUsuarios = this.listUsuarios.map(usuario => {
          return {
            clave: usuario.dni,
            value: usuario.apellido + " " + usuario.nombre + " (" + usuario.sexo.sexo + ")"
           }
        });    
    });
  }
  
  //FIN LISTADO DE MEDIADORES............................

  //LISTADO DE USUARIOS - CENTRO DE MEDIACION
  listarUsuariosCentroMediacion(){        
    this.usuariosCentrosService.listarUsuariosXCentro(this.dataCentroMediacion.id_centro_mediacion).
      subscribe({
        next: (resultado) => {
          this.listUsuariosCentro = resultado[0]
          this.loading = false
        },
        error: (err) => {
          Swal.fire('Error al listar los usuarios',`${err.error.message}`,"error");
        } 
      })      
  }
  //FIN LISTADO DE USUARIOS - CENTROS DE MEDIACION.......................................................

  //LISTADO DE USUARIOS ACTIVOS - CENTRO DE MEDIACION
  listarUsuariosActivosCentroMediacion(){        
    this.usuariosCentrosService.listarUsuariosActivosXCentro(this.dataCentroMediacion.id_centro_mediacion).
      subscribe({
        next: (resultado) => {
          this.listUsuariosCentro = resultado[0]
          this.loading = false
        },
        error: (err) => {
          Swal.fire('Error al listar los usuarios',`${err.error.message}`,"error");
        } 
      })      
  }
  //FIN LISTADO DE USUARIOS ACTIVOS - CENTRO DE MEDIACION.......................................................


  //MANEJO DE FORMULARIO DIALOG
  openDialogUsuarioCentro() {
    this.usuarioCentroDialog = true;
  }
  
  hideDialogUsuarioCentro() {
    this.formaUsuarioCentroMediacion.reset();
    this.msgs = [];
    this.usuarioCentroDialog = false;
  }    
  //FIN MANEJO FORMULARIO DIALOG....................................

  //LIMPIAR FILTROS
  clear(table: Table) {    
    table.clear();
    this.filter.nativeElement.value = '';
  } 
  //FIN LIMPIAR FILTROS....................................................................................  

}
