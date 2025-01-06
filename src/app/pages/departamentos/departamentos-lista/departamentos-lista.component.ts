import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { opcionSiNo } from 'src/app/common/data-mokeada';
import { CentroMediacionModel } from 'src/app/models/centro_mediacion.model';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { FiltroBooleanModel } from 'src/app/models/filtro_boolean.model';
import { CentrosMediacionService } from 'src/app/service/centros-mediacion.service';
import { DepartamentosService } from 'src/app/service/departamentos.service';

@Component({
  selector: 'app-departamentos-lista',
  templateUrl: './departamentos-lista.component.html',
  styleUrls: ['./departamentos-lista.component.scss']
})
export class DepartamentosListaComponent implements OnInit {

  //PARA FILTRAR EN TABLA
    @ViewChild('dt') table: Table;
    @ViewChild('filter') filter: ElementRef;
  
    //VARIABLES
    loading:boolean = true;
  
    //VARIABLES CENTRO MEDIACION    
    centrosDialog: boolean;
    departamento: DepartamentoModel;
    id_departamento:number = 0;
    tituloDialog: string = "";
  
    //LISTAS    
    listCentrosMediacion: CentroMediacionModel[] = [];
    listDepartamentos: DepartamentoModel[]=[]; 
    filtroSiNoBoolean: FiltroBooleanModel[]=[];
  
    //FORMULARIOS
    formaObjeto: FormGroup;  
    
    constructor(
      private fb: FormBuilder,
      private router: Router,
      private departamentosService: DepartamentosService,
      private centrosMediacionService: CentrosMediacionService,
    ) { }
    
    ngOnInit(): void {
     //CARGAR CATEGORIAS
     this.listarDepartamentos();
     this.filtroSiNoBoolean = opcionSiNo.map(respuesta => {
        return {
          label: respuesta.respuesta_sino.toUpperCase(),
          value: respuesta.id_opcion_sino,
        }
      });
    }

    //MANEJO DE FORMULARIO DIALOG
    listarActualizarDepartamentos() {
      this.listDepartamentos = [];
      this.loading = true; 
      this.departamentosService.listarActualizarDepartamentosConCentros().
          subscribe(respuesta => {
          this.listDepartamentos= respuesta;
          this.loading = false;  
      
      });
    } 
  
        
    //LISTADO DE OBJETOS
    listarDepartamentos(){    
      this.departamentosService.listarDepartamentoTodos().
          subscribe(respuesta => {
          this.listDepartamentos= respuesta[0];
          this.loading = false;        
      });
    }
    //FIN LISTADO DE OBJETOS.......................................................

    //CARGA DE DROPDOWN CENTROS DE MEDIACION
    cargarCentrosMediacion(id_departamento: number){
      this.centrosMediacionService.listarCentroMediacionXDepartamento(id_departamento)
        .subscribe({
          next: (respuesta) => {
            this.listCentrosMediacion= respuesta[0];          
          }     
      });  
    }
  
    //MANEJO DE FORMULARIO DIALOG
    openDialogCentrosMediacion(departamento: DepartamentoModel) {
      this.cargarCentrosMediacion(departamento.id_departamento);
      this.tituloDialog= "Centros de mediación";
      this.centrosDialog = true;
    } 
    
    
    hideDialogCentrosMediacion() {
      this.listCentrosMediacion = [];
      this.centrosDialog = false;
    }      
    //FIN MANEJO FORMULARIO DIALOG....................................

  //LIMPIAR FILTROS
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  } 
  //FIN LIMPIAR FILTROS....................................................................................  


}
