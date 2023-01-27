import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { DataService } from 'src/app/service/data.service';
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
  listUsuariosCentro: UsuarioCentroModel[]=[];
  // filtroDepartamentos: FiltroModel[]=[];
  // filtroMunicipios: FiltroModel[]=[];

  //FORMULARIOS
  formaUsuarioCentroMediacion: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private readonly datePipe: DatePipe,
    public dataService: DataService,
    private usuariosCentrosService: UsuariosCentroService
  ) {
    //FORMULARIOS
    this.formaUsuarioCentroMediacion = this.fb.group({
      
      centro_mediacion_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
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
      { type: 'required', message: 'El departamento es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' }
    ],
    'dni_usuario': [
      { type: 'required', message: 'El DNI del usuario es requerido' },
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
    this.listarUsuariosActivosCentroMediacion();
  }
  //FIN ONINIT................................................

  //GUARDAR USUARIO-TRAMITE  
  submitFormUsuarioCentro(){

  }

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

  //LIMPIAR FILTROS
  clear(table: Table) {    
    table.clear();
    this.filter.nativeElement.value = '';
  } 
  //FIN LIMPIAR FILTROS....................................................................................  

}
