import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { TramiteModel } from '../../../models/tramite.model';
import { TramitesService } from '../../../service/tramites.service';
import { TotalesTramitesModel } from '../../../models/totales_tramites.model';
import { AuthService } from '../../../service/auth.service';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-descargas-tramites',
  templateUrl: './descargas-tramites.component.html',
  styleUrls: ['./descargas-tramites.component.scss']
})
export class DescargasTramitesComponent implements OnInit {
  
  //PARA FILTRAR EN TABLA
    @ViewChild('dt') table: Table;
    @ViewChild('filter') filter: ElementRef;
  
    //iidiomas
    es: any = {};  
    
    //VARIABLES TRAMITE        
    totalTramite: number= 0;
    tramiteDialog: boolean;
    submitted: boolean;
    totalesTramites: TotalesTramitesModel= {};
    tituloPagina: string ="Usuario: Administrador"
    
    //LISTAS    
    listTramites: TramiteModel[]=[];
    
    //booleanas
    loading:boolean = true;
    
    //FORMULARIOS
    formaBuscar: FormGroup;
  
    constructor(
      private fb: FormBuilder,
      private readonly datePipe: DatePipe,
      
      private authService: AuthService,
      private dataService: DataService,
      private tramitesService: TramitesService,
    ) { 
      this.formaBuscar = this.fb.group({        
        fecha_ini: ['',[Validators.required]],
        fecha_fin: ['',[Validators.required]],
  
      });
    }
  
    ngOnInit(): void {
      if (this.authService.currentUserLogin.rol_id == "administrador" || this.authService.currentUserLogin.rol_id == "supervisor") {
        this.tituloPagina ="Usuario: Administrador";
      }
  
      if (this.authService.currentCiudadanoLogin) {
        this.tituloPagina ="Ciudadano: " + this.authService.currentCiudadanoLogin.apellido + " " + this.authService.currentCiudadanoLogin.nombre;
        this.listTramites = [];
        this.loading = false;
      }
      
      if (this.authService.currentUserLogin) {
        this.tituloPagina ="Usuario: " + this.authService.currentUserLogin.apellido + " " + this.authService.currentUserLogin.nombre;
        this.listTramites = [];
        this.loading = false;
      }    
      
      
    }
    //FIN ONINIT.........................................
  
    //VALIDACIONES DE FORMULARIO
    isValid(campo: string): boolean{     
      
      return this.formaBuscar.get(campo)?.invalid && this.formaBuscar.get(campo)?.touched;      
    }
    //FIN VALIDACIONES DE FORMULARIO............................................................
  
    //MENSAJES DE VALIDACIONES
    user_validation_messages = {
      //datos tramite
      
      'fecha_ini': [
        { type: 'required', message: 'La fecha inicio es requerida' },
      ],
      'fecha_fin': [
        { type: 'required', message: 'La fecha fin es requerida' },
      ],
    }
    //FIN MENSAJES DE VALIDACIONES...............................................................
  
    //BUSCAR TRAMITES
    buscarTramites(){
      this.loading = true;
      console.log("en buscar");

      if(this.formaBuscar.invalid){    
  
        this.loading = false;
        Swal.fire('Formulario con errores',`Complete correctamente todos los campos del formulario`,"warning");
        return Object.values(this.formaBuscar.controls).forEach(control => control.markAsTouched());
      }  
      
      
      let fecha_ini = this.dataService.getchangeFormatoFechaGuardar(this.formaBuscar.get('fecha_ini')?.value)
      let fecha_fin = this.dataService.getchangeFormatoFechaGuardar(this.formaBuscar.get('fecha_fin')?.value);

      this.listarTramitesAdministradorXFecha(fecha_ini, fecha_fin); 
      
    }
    //FIN BUSCAR TRAMITES....................................

    //DESCARGAR LISTA DE TRAMITES
    descargarTramitesExcel(){
      let listTramitesExcel: any;
      
    }
    //FIN DESCARGAR LISTA DE TRAMITES....................................................
  
    //LISTADO DE TRAMITES ADMINISTRADOR
    listarTramitesAdministrador(){    
      this.tramitesService.listarTramitesTodos().
        subscribe(respuesta => {
          this.listTramites= respuesta[0];
          this.totalTramite = respuesta[1];
          this.loading=false;
      
        });
    }
    //FIN LISTADO DE TRAMITES............................
   
    //LISTADO DE TRAMITES ADMINISTRADOR X FECHA
    listarTramitesAdministradorXFecha(fecha_ini: string, fecha_fin: string){    
      console.log("En metodo");
      this.tramitesService.listarTramitesTodosFecha(fecha_ini, fecha_fin).
        subscribe(respuesta => {
          this.listTramites= respuesta[0];
          this.totalTramite = respuesta[1];
          this.loading=false;
      
        });
    }
    //FIN LISTADO DE TRAMITES ADMINISTRADOR X FECHA............................
      
    //CONTAR TRAMITES
    contarTramitesXEstado(){    
      this.tramitesService.contarTotalesTramitesXEstado().
          subscribe(respuesta => {
          this.totalesTramites = respuesta;    
      });
    }
    //FIN CONTAR TRAMITES............................
  
    
  
    //LIMPIAR FILTROS
    clear(table: Table) {
      table.clear();
      this.filter.nativeElement.value = '';
    } 
    //FIN LIMPIAR FILTROS....................................................................................  
  
}
