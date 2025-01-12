import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { Table } from 'primeng/table';
import { ObjetoModel } from 'src/app/models/objeto.model';
import { ObjetosService } from 'src/app/service/objetos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-objetos',
  templateUrl: './objetos.component.html',
  styleUrls: ['./objetos.component.scss']
})
export class ObjetosComponent implements OnInit {

  //MENSAJES
  msgs: Message[] = [];   

  //PARA FILTRAR EN TABLA
  @ViewChild('dt') table: Table;
  @ViewChild('filter') filter: ElementRef;

  //VARIABLES
  loading:boolean = true;

  //VARIABLES CENTRO MEDIACION    
  objeto: ObjetoModel;
  objetoDialog: boolean;
  editarObjeto: boolean = false;
  id_objeto_editar:number = 0;
  tituloDialog: string = "";

  //LISTAS    
  listObjetos: ObjetoModel[]=[]; 

  //FORMULARIOS
  formaObjeto: FormGroup;  
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private objetosService: ObjetosService,

  ) { 

    this.formaObjeto = this.fb.group({
      objeto: ['',[Validators.required, Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
    
    });

  }

  //MENSAJES DE VALIDACIONES
  user_validation_messages = {    
    
    'objeto': [
      { type: 'required', message: 'El objeto es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números, letras y espacios.' },
      { type: 'minlength', message: 'La cantidad mínima de caracteres es 2.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 100.' }

    ]
  }
  //FIN MENSAJES DE VALIDACIONES...............................................................

  //VALIDACIONES DE FORMULARIO
  isValid(campo: string): boolean{     
    
    return this.formaObjeto.get(campo)?.invalid && this.formaObjeto.get(campo)?.touched;      
  }
  //FIN VALIDACIONES DE FORMULARIO.......................................
  ngOnInit(): void {
   //CARGAR CATEGORIAS
   this.listarObjetos();
  }

  //GUARDAR CENTRO
  submitFormObjeto(){

    this.msgs = [];    
    
    if(this.formaObjeto.invalid){  
      this.msgs.push({ severity: 'error', summary: 'Datos inválidos', detail: 'Revise los datos cargados. ' });
      return Object.values(this.formaObjeto.controls).forEach(control => control.markAsTouched());
    }       

    let dataRegistro: Partial<ObjetoModel>;
    dataRegistro = {
      objeto: this.formaObjeto.get('objeto')?.value,
      
    };    
    
    //GUARDAR NUEVO
    if(this.editarObjeto==false){
      this.objetosService.guardarObjeto(dataRegistro)        
        .subscribe({
          next: (resultado) => {
            let centroRes: ObjetoModel = resultado;
            this.hideDialogObjeto();////            
            Swal.fire('Exito',`El registro se realizó correctamente`,"success");
            this.listarObjetos();
          },
          error: (err) => {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error al guardar', detail: ` ${err.error.message}` });
          }
        });
    }
    //FIN GUARDAR NUEVO 

    //GUARDAR EDICION
    if(this.editarObjeto===true){
      this.objetosService.guardarEdicionObjeto(this.id_objeto_editar, dataRegistro)        
        .subscribe({
          next: (resultado) => {
            let objetoRes: ObjetoModel = resultado;
            this.hideDialogObjeto();            
            Swal.fire('Exito',`Se actualizó correctamente el Objeto`,"success");
            this.listarObjetos();
          },
          error: (err) => {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error al actualizar', detail: ` ${err.error.message}` });
          }
        });
    }
    //FIN GUARDAR EDICION  
    
  } 
  //FIN GUARDAR.................................................

  
  //LISTADO DE OBJETOS
  listarObjetos(){    
    this.objetosService.listarObjetoTodos().
        subscribe(respuesta => {
        this.listObjetos= respuesta[0];
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE OBJETOS.......................................................

  //MANEJO DE FORMULARIO DIALOG
  openDialogObjeto() {
    this.tituloDialog= "Nuevo Objeto";
    this.objetoDialog = true;
  }

  editDialogObjeto(data: ObjetoModel){
    this.tituloDialog="Editar objeto";
    this.id_objeto_editar= data.id_objeto;
    this.formaObjeto.get('objeto')?.setValue(data.objeto);

    this.editarObjeto = true;
    this.objetoDialog = true;
  }
  
  hideDialogObjeto() {
    this.formaObjeto.reset();
    this.msgs = [];
    this.editarObjeto = false;  
    this.objetoDialog = false;
  }      
  //FIN MANEJO FORMULARIO DIALOG....................................


}
