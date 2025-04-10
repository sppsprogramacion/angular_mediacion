import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Table } from 'primeng/table';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

import { AuthService } from '../../../service/auth.service';
import { DataService } from 'src/app/service/data.service';
import { TotalesTramitesModel } from '../../../models/totales_tramites.model';
import { TramiteExcelModel } from 'src/app/models/tramite_excel.model';
import { TramiteModel } from '../../../models/tramite.model';
import { TramitesService } from '../../../service/tramites.service';

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
      let tramiteExcel: TramiteExcelModel = {};
      let listTramitesExcel: TramiteExcelModel[]=[];
      console.log("lista",this.listTramites);
      //definir lista para excel
      for (const tramite of this.listTramites){
        console.log("tramite",tramite);
        //let tramite: TramiteModel = elemento;
        tramiteExcel= {};

        tramiteExcel.id_tramite = tramite.id_tramite;
        tramiteExcel.numero_tramite = tramite.numero_tramite;
        tramiteExcel.id_ciudadano = tramite.ciudadano.id_ciudadano;
        tramiteExcel.dni = tramite.ciudadano.dni;
        tramiteExcel.apellido = tramite.ciudadano.apellido;
        tramiteExcel.nombre = tramite.ciudadano.nombre;
        tramiteExcel.id_sexo = tramite.ciudadano.sexo_id;
        tramiteExcel.sexo = tramite.ciudadano.sexo.sexo;     
        tramiteExcel.telefono = tramite.ciudadano.telefono;
        tramiteExcel.fecha_nac = tramite.ciudadano.fecha_nac;
        tramiteExcel.email = tramite.ciudadano.email; 
        tramiteExcel.id_provincia = tramite.provincia.id_provincia;
        tramiteExcel.provincia = tramite.provincia.provincia;
        tramiteExcel.id_departamento = tramite.departamento.id_departamento;
        tramiteExcel.departamento = tramite.departamento.departamento;
        tramiteExcel.id_municipio = tramite.municipio.id_municipio;
        tramiteExcel.municipio = tramite.municipio.municipio;
        tramiteExcel.localidad_barrio = tramite.localidad_barrio;
        tramiteExcel.calle_direccion = tramite.calle_direccion;
        tramiteExcel.numero_dom = tramite.numero_dom;
        tramiteExcel.id_centro_mediacion = tramite.centro_mediacion.id_centro_mediacion;
        tramiteExcel.centro_mediacion = tramite.centro_mediacion.centro_mediacion;       
        tramiteExcel.id_departamento_centro = tramite.departamento.id_departamento;
        tramiteExcel.departamento_centro = tramite.departamento.departamento;
        tramiteExcel.id_municipio_centro = tramite.municipio.id_municipio;
        tramiteExcel.municipio_centro = tramite.municipio.municipio;
        tramiteExcel.fecha_tramite = tramite.fecha_tramite;
        tramiteExcel.es_expediente = tramite.es_expediente;
        tramiteExcel.expediente = tramite.expediente;
        tramiteExcel.fecha_expediente = tramite.fecha_expediente;
        tramiteExcel.esta_asesorado = tramite.esta_asesorado;
        tramiteExcel.id_objeto = tramite.objeto.id_objeto;
        tramiteExcel.objeto = tramite.objeto.objeto;
        tramiteExcel.violencia_genero = tramite.violencia_genero;
        tramiteExcel.violencia_partes = tramite.violencia_partes;
        tramiteExcel.existe_denuncia = tramite.existe_denuncia;
        tramiteExcel.medida_cautelar = tramite.medida_cautelar;       
        tramiteExcel.id_modalidad = tramite.modalidad.id_modalidad;
        tramiteExcel.modalidad = tramite.modalidad.modalidad;
        tramiteExcel.id_variante = tramite.variante.id_variante;
        tramiteExcel.variante = tramite.variante.variante;
        tramiteExcel.id_estado_tramite = tramite.estado_tramite.id_estado_tramite;
        tramiteExcel.estado_tramite = tramite.estado_tramite.estado_tramite;       
        tramiteExcel.fecha_finalizacion = tramite.fecha_finalizacion;
        tramiteExcel.observacion_finalizacion = tramite.observacion_finalizacion;
        
        console.log("tramite excel",tramiteExcel);
        listTramitesExcel.push(tramiteExcel);
        console.log("lista tramite excel",listTramitesExcel);
      }

      //crear archivo excel para descargar
      // 1. Crear hoja de Excel
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(listTramitesExcel);
  
      // 2. Crear libro de Excel y añadir hoja
      const wb: XLSX.WorkBook = {
        Sheets: { 'Trámites': ws },
        SheetNames: ['Trámites']
      };

      // 3. Generar buffer
      const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
      // 4. Guardar archivo
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, `Tramites_${new Date().getTime()}.xlsx`);
  
      
    }
    //FIN DESCARGAR LISTA DE TRAMITES....................................................
  
    
   
    //LISTADO DE TRAMITES ADMINISTRADOR X FECHA
    listarTramitesAdministradorXFecha(fecha_ini: string, fecha_fin: string){    
      console.log("En metodo");
      this.tramitesService.listarTramitesFechaExcel(fecha_ini, fecha_fin).
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
