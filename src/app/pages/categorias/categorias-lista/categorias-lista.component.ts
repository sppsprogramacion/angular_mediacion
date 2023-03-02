import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { FiltroModel } from 'src/app/models/filtro.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';
import { CategoriaModel } from '../../../models/categoria.model';
import { CategoriasService } from '../../../service/categorias.service';

@Component({
  selector: 'app-categorias-lista',
  templateUrl: './categorias-lista.component.html',
  providers: [MessageService],
  styleUrls: ['./categorias-lista.component.scss']
})
export class CategoriasListaComponent implements OnInit {

  //MENSAJES
  msgs: Message[] = [];   

  //PARA FILTRAR EN TABLA
  @ViewChild('dt') table: Table;
  @ViewChild('filter') filter: ElementRef;

  //VARIABLES
  loading:boolean = true;
  municipioInvalid: boolean=false;
  departamentoInvalid: boolean= false;

  //VARIABLES CENTRO MEDIACION    
  categoria: CategoriaModel;
  categoriaDialog: boolean;
  editarCategoria: boolean = false;
  id_categoria_editar:number = 0;
  tituloDialog: string = "";

  //LISTAS    
  listCategoria: CategoriaModel[]=[]; 

  //FORMULARIOS
  formaCategoria: FormGroup;  
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private serviceMensajes: MessageService,
    private readonly dataService: DataService,
    private categoriasService: CategoriasService,

  ) { 

    this.formaCategoria = this.fb.group({
      categoria: ['',[Validators.required, Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
    
    });

  }

  //MENSAJES DE VALIDACIONES
  user_validation_messages = {    
    
    'categoria': [
      { type: 'required', message: 'La categoría es requerida' },
      { type: 'pattern', message: 'Solo se pueden ingresar números, letras y espacios.' },
      { type: 'minlength', message: 'La cantidad mínima de caracteres es 2.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 100.' }

    ]
  }
  //FIN MENSAJES DE VALIDACIONES...............................................................

  //VALIDACIONES DE FORMULARIO
  isValid(campo: string): boolean{     
    
    return this.formaCategoria.get(campo)?.invalid && this.formaCategoria.get(campo)?.touched;      
  }
  //FIN VALIDACIONES DE FORMULARIO.......................................
  ngOnInit(): void {
   //CARGAR CATEGORIAS
   this.listarCategorias();
  }

  //GUARDAR CENTRO
  submitFormCategoria(){

    this.msgs = [];    
    
    if(this.formaCategoria.invalid){  
      this.msgs.push({ severity: 'error', summary: 'Datos inválidos', detail: 'Revise los datos cargados. ' });
      return Object.values(this.formaCategoria.controls).forEach(control => control.markAsTouched());
    }       

    let dataRegistro: Partial<CategoriaModel>;
    dataRegistro = {
      categoria: this.formaCategoria.get('categoria')?.value,
      
    };    
    
    //GUARDAR NUEVO CENTRO
    if(this.editarCategoria==false){
      this.categoriasService.guardarCategoria(dataRegistro)        
        .subscribe({
          next: (resultado) => {
            let centroRes: CategoriaModel = resultado;
            this.hideDialogCategoria();            
            Swal.fire('Exito',`El registro se realizó correctamente`,"success");
            this.listarCategorias();
          },
          error: (err) => {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error al guardar', detail: ` ${err.error.message}` });
          }
        });
    }
    //FIN GUARDAR NUEVO CENTRO 

    //GUARDAR EDICION CENTRO
    if(this.editarCategoria===true){
      this.categoriasService.guardarEdicionCategoria(this.id_categoria_editar, dataRegistro)        
        .subscribe({
          next: (resultado) => {
            let centroRes: CategoriaModel = resultado;
            this.hideDialogCategoria();            
            Swal.fire('Exito',`Se actualizó correctamente la categoría`,"success");
            this.listarCategorias();
          },
          error: (err) => {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error al actualizar', detail: ` ${err.error.message}` });
          }
        });
    }
    //FIN GUARDAR EDICION CENTRO 
    
  } 
  //FIN GUARDAR CENTRO.................................................

  
  //LISTADO DE CENTROS DE MEDIACION
  listarCategorias(){    
    this.categoriasService.listarCategoriasTodos().
        subscribe(respuesta => {
        this.listCategoria= respuesta[0];
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE CENTROS DE MEDIACION.......................................................

  //MANEJO DE FORMULARIO DIALOG
  openDialogCategoria() {
    this.tituloDialog= "Nueva categoria";
    this.categoriaDialog = true;
  }

  editDialogCategoria(data: CategoriaModel){
    this.tituloDialog="Editar categoria";
    this.id_categoria_editar= data.id_categoria;
    this.formaCategoria.get('categoria')?.setValue(data.categoria);

    this.editarCategoria = true;
    this.categoriaDialog = true;
  }
  
  hideDialogCategoria() {
    this.formaCategoria.reset();
    this.msgs = [];
    this.editarCategoria = false;  
    this.categoriaDialog = false;
  }      
  //FIN MANEJO FORMULARIO DIALOG....................................

}
