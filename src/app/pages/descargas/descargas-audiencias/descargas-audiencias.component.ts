import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

import { AudienciaModel } from 'src/app/models/audiencia.model';
import { AudienciaExcelModel } from 'src/app/models/audiencia_excel.model';
import { AudienciasService } from 'src/app/service/audiencias.service';
import { AuthService } from 'src/app/service/auth.service';
import { DataService } from 'src/app/service/data.service';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-descargas-audiencias',
  templateUrl: './descargas-audiencias.component.html',
  styleUrls: ['./descargas-audiencias.component.scss']
})
export class DescargasAudienciasComponent implements OnInit {

  //PARA FILTRAR EN TABLA
    @ViewChild('dt') table: Table;
    @ViewChild('filter') filter: ElementRef;
  
    //iidiomas
    es: any = {}; 
  
    loading:boolean = false;
  
    //VARIABLES TRAMITE    
    submitted: boolean;
    tituloPagina: string = "Usuario: Administrador";
  
    //LISTAS    
    listAudiencias: AudienciaModel[]=[];
  
    //FORMULARIOS
    formaBuscar: FormGroup;
  
    constructor(
      private authService: AuthService,
      private fb: FormBuilder,
      private audienciaService: AudienciasService,
      public dataService: DataService,
      private router: Router
    ) {
  
      this.formaBuscar = this.fb.group({        
        fecha_ini: ['',[Validators.required]],
        fecha_fin: ['',[Validators.required]],
  
      });
     }
  
    ngOnInit(): void {
  
      // if (this.authService.currentUserLogin.rol_id == "administrador") {
      //   this.tituloPagina ="Usuario: Administrador"
      //   this.listarTramitesUsuario();
      // }
  
      // if (this.authService.currentCiudadanoLogin) {
      //   this.tituloPagina ="Ciudadano: " + this.authService.currentCiudadanoLogin.apellido + " " + this.authService.currentCiudadanoLogin.nombre
      //   this.listarTramitesCiudadano();
      // }
      
      // if (this.authService.currentUserLogin && this.authService.currentUserLogin.rol_id != "administrador") {
  
      //   this.tituloPagina ="Usuario: " + this.authService.currentUserLogin.apellido + " " + this.authService.currentUserLogin.nombre
      //   this.listTramites = [];
      //   this.listarTramitesUsuario();
      // }
      
    }
    //FIN ONINIT...........................................................
  
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
  
      if(this.formaBuscar.invalid){    
  
        this.loading = false;
        Swal.fire('Formulario con errores',`Complete correctamente todos los campos del formulario`,"warning");
        return Object.values(this.formaBuscar.controls).forEach(control => control.markAsTouched());
      }      
      
      let fecha_ini = this.dataService.getchangeFormatoFechaGuardar(this.formaBuscar.get('fecha_ini')?.value)
      let fecha_fin = this.dataService.getchangeFormatoFechaGuardar(this.formaBuscar.get('fecha_fin')?.value);
  
      this.listarAudienciasAdministradorXFecha(fecha_ini, fecha_fin); 
      
    }
    //FIN BUSCAR TRAMITES....................................................
  
    //DESCARGAR LISTA DE Audiencias
    descargarAudienciasExcel(){
      let audienciaExcel: AudienciaExcelModel = {};
      let listAudienciaExcel: AudienciaExcelModel[]=[];
      //definir lista para excel
      for (const audiencia of this.listAudiencias){
        audienciaExcel= {};
        //datos de la audiencia
        audienciaExcel.id_audiencia= audiencia.id_audiencia,
        audienciaExcel.num_audiencia= audiencia.num_audiencia,
        audienciaExcel.tramite_numero= audiencia.tramite_numero,
        audienciaExcel.detalles= audiencia.detalles,
        audienciaExcel.fecha_inicio= audiencia.fecha_inicio,
        audienciaExcel.hora_inicio= audiencia.hora_inicio,
        audienciaExcel.hora_fin= audiencia.hora_fin,
        audienciaExcel.fecha_creacion= audiencia.fecha_creacion,
        audienciaExcel.esta_cerrada= audiencia.esta_cerrada,
        audienciaExcel.id_tipo_audiencia= audiencia.tipo_audiencia.id_tipo_audiencia,
        audienciaExcel.tipo_audiencia= audiencia.tipo_audiencia.tipo_audiencia,
        audienciaExcel.id_modalidad= audiencia.modalidad.id_modalidad,
        audienciaExcel.modalidad= audiencia.modalidad.modalidad,
        audienciaExcel.id_centro_mediacion= audiencia.centro_mediacion.id_centro_mediacion,
        audienciaExcel.centro_mediacion= audiencia.centro_mediacion.centro_mediacion,        
        audienciaExcel.id_departamento_centro= audiencia.centro_mediacion.departamento.id_departamento,
        audienciaExcel.departamento_centro= audiencia.centro_mediacion.departamento.departamento,
        audienciaExcel.id_municipio_centro= audiencia.centro_mediacion.municipio.id_municipio,
        audienciaExcel.municipio_centro= audiencia.centro_mediacion.municipio.municipio,        
        audienciaExcel.id_resultado_audiencia= audiencia.resultado_audiencia.id_resultado_audiencia,
        audienciaExcel.resultado_audiencia= audiencia.resultado_audiencia.resultado_audiencia,
        audienciaExcel.observacion_resultado= audiencia.observacion_resultado,
        //datos del tramite
        audienciaExcel.numero_tramite = audiencia.tramite.numero_tramite;
        audienciaExcel.fecha_tramite = audiencia.tramite.fecha_tramite;
        audienciaExcel.es_expediente = audiencia.tramite.es_expediente;
        audienciaExcel.expediente = audiencia.tramite.expediente;
        audienciaExcel.fecha_expediente = audiencia.tramite.fecha_expediente;      
        audienciaExcel.id_objeto = audiencia.tramite.objeto.id_objeto;
        audienciaExcel.objeto = audiencia.tramite.objeto.objeto;         
        audienciaExcel.id_estado_tramite = audiencia.tramite.estado_tramite.id_estado_tramite;
        audienciaExcel.estado_tramite = audiencia.tramite.estado_tramite.estado_tramite;       
        audienciaExcel.fecha_finalizacion = audiencia.tramite.fecha_finalizacion;
        audienciaExcel.observacion_finalizacion = audiencia.tramite.observacion_finalizacion;
        //datos del ciudadano
        audienciaExcel.id_ciudadano = audiencia.tramite.ciudadano.id_ciudadano;
        audienciaExcel.dni_ciudadano = audiencia.tramite.ciudadano.dni;
        audienciaExcel.apellido_ciudadano = audiencia.tramite.ciudadano.apellido;
        audienciaExcel.nombre_ciudadano = audiencia.tramite.ciudadano.nombre;
        audienciaExcel.id_sexo_ciudadano = audiencia.tramite.ciudadano.sexo.id_sexo;
        audienciaExcel.sexo_ciudadano = audiencia.tramite.ciudadano.sexo.sexo;     
        //datos del usuario
        audienciaExcel.id_usuario = audiencia.usuario.id_usuario;
        audienciaExcel.dni_usuario = audiencia.usuario.dni;
        audienciaExcel.apellido_usuario = audiencia.usuario.apellido;
        audienciaExcel.nombre_usuario = audiencia.usuario.nombre;      
        
        listAudienciaExcel.push(audienciaExcel);
      }
  
      //crear archivo excel para descargar
      // 1. Crear hoja de Excel
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(listAudienciaExcel);
  
      // 2. Crear libro de Excel y añadir hoja
      const wb: XLSX.WorkBook = {
        Sheets: { 'Trámites': ws },
        SheetNames: ['Trámites']
      };
  
      // 3. Generar buffer
      const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
      // 4. Guardar archivo
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
      const now = new Date();
      //utilizo tambien metodo
      const fechaFormateada = `${this.completarCeros(now.getDate())}${this.completarCeros(now.getMonth() + 1)}${now.getFullYear()}-${this.completarCeros(now.getHours())}${this.completarCeros(now.getMinutes())}`;
  
      FileSaver.saveAs(blob, `Tramites_con_usuario_${fechaFormateada}.xlsx`);
      
    }
    //FIN DESCARGAR LISTA DE TRAMITES....................................................
      
    //COMPETAR CON CEROS
    private completarCeros(n: number): string {
      return n < 10 ? '0' + n : n.toString();
    }
    //FIN COMPLETAR CON CEROS............................................................
        
  
    //LISTADO DE TRAMITES ADMINISTRADOR X FECHA
    listarAudienciasAdministradorXFecha(fecha_ini: string, fecha_fin: string){   
      this.audienciaService.listarAudienciasTodasFechaExcel(fecha_ini, fecha_fin).
        subscribe(respuesta => {
          this.listAudiencias= respuesta[0];
          this.loading=false;
      
        });
    }
    //FIN LISTADO DE TRAMITES ADMINISTRADOR X FECHA............................
  
    //LIMPIAR FILTROS
    clear(table: Table) {
      table.clear();
      this.filter.nativeElement.value = '';
    } 
    //FIN LIMPIAR FILTROS....................................................................................  
  
  

}
