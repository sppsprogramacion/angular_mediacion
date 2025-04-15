import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

import { AuthService } from 'src/app/service/auth.service';
import { DataService } from 'src/app/service/data.service';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { TramiteModel } from 'src/app/models/tramite.model';
import { UsuarioTramiteModel } from 'src/app/models/usuario_tramite.model';
import { UsuariosTramiteService } from '../../../service/usuarios-tramite.service';
import { UsuarioTramiteExcelModel } from 'src/app/models/usuario_tramite_excel.model';

@Component({
  selector: 'app-descargas-tramites-asignados',
  templateUrl: './descargas-tramites-asignados.component.html',
  styleUrls: ['./descargas-tramites-asignados.component.scss']
})
export class DescargasTramitesAsignadosComponent implements OnInit {

  //PARA FILTRAR EN TABLA
  @ViewChild('dt') table: Table;
  @ViewChild('filter') filter: ElementRef;

  //iidiomas
  es: any = {}; 

  loading:boolean = false;

  //VARIABLES TRAMITE    
  tramite: TramiteModel;
  tramiteDialog: boolean;
  nuevoTramite: boolean;
  submitted: boolean;
  tituloPagina: string = "Usuario: Administrador";

  //LISTAS    
  listTramites: TramiteModel[]=[];
  listUsuariosTramites: UsuarioTramiteModel[]=[];
  listDepartamentos: DepartamentoModel[]=[];
  listMunicipios: MunicipioModel[]= [];
  listSexo: SexoModel[]=[];

  //FORMULARIOS
      formaBuscar: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private usuariosTramitesService: UsuariosTramiteService,
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

    this.listarTramitesAdministradorXFecha(fecha_ini, fecha_fin); 
    
  }
  //FIN BUSCAR TRAMITES....................................................

  //DESCARGAR LISTA DE TRAMITES
  descargarTramitesExcel(){
    let tramiteExcel: UsuarioTramiteExcelModel = {};
    let listTramitesExcel: UsuarioTramiteExcelModel[]=[];
    //definir lista para excel
    for (const tramite of this.listUsuariosTramites){
      tramiteExcel= {};
      //datos del usuario-tramite
      tramiteExcel.id_usuario_tramite = tramite.id_usuario_tramite,
      tramiteExcel.detalles = tramite.detalles,
      tramiteExcel.fecha_asignacion = tramite.fecha_asignacion,
      tramiteExcel.fecha_sece = tramite.fecha_sece,
      tramiteExcel.id_funcion_tramite = tramite.funcion_tramite.id_funcion_tramite,
      tramiteExcel.funcion_tramite = tramite.funcion_tramite.funcion_tramite,
      tramiteExcel.activo = tramite.activo,
      //datos del tramite
      tramiteExcel.numero_tramite = tramite.tramite.numero_tramite;
      tramiteExcel.fecha_tramite = tramite.tramite.fecha_tramite;
      tramiteExcel.es_expediente = tramite.tramite.es_expediente;
      tramiteExcel.expediente = tramite.tramite.expediente;
      tramiteExcel.fecha_expediente = tramite.tramite.fecha_expediente;      
      tramiteExcel.id_objeto = tramite.tramite.objeto.id_objeto;
      tramiteExcel.objeto = tramite.tramite.objeto.objeto;         
      tramiteExcel.id_estado_tramite = tramite.tramite.estado_tramite.id_estado_tramite;
      tramiteExcel.estado_tramite = tramite.tramite.estado_tramite.estado_tramite;       
      tramiteExcel.fecha_finalizacion = tramite.tramite.fecha_finalizacion;
      tramiteExcel.observacion_finalizacion = tramite.tramite.observacion_finalizacion;
      //datos del ciudadano
      tramiteExcel.id_ciudadano = tramite.tramite.ciudadano.id_ciudadano;
      tramiteExcel.dni_ciudadano = tramite.tramite.ciudadano.dni;
      tramiteExcel.apellido_ciudadano = tramite.tramite.ciudadano.apellido;
      tramiteExcel.nombre_ciudadano = tramite.tramite.ciudadano.nombre;
      tramiteExcel.id_sexo_ciudadano = tramite.tramite.ciudadano.sexo.id_sexo;
      tramiteExcel.sexo_ciudadano = tramite.tramite.ciudadano.sexo.sexo;     
      //datos del usuario
      tramiteExcel.id_usuario = tramite.usuario.id_usuario;
      tramiteExcel.dni_usuario = tramite.usuario.dni;
      tramiteExcel.apellido_usuario = tramite.usuario.apellido;
      tramiteExcel.nombre_usuario = tramite.usuario.nombre;      
      
      listTramitesExcel.push(tramiteExcel);
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
  listarTramitesAdministradorXFecha(fecha_ini: string, fecha_fin: string){   
    this.usuariosTramitesService.listarTramitesTodosFechaExcel(fecha_ini, fecha_fin).
      subscribe(respuesta => {
        this.listUsuariosTramites= respuesta[0];
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
