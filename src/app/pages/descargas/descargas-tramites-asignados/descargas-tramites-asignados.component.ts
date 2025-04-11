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
  // buscarTramites(){
  //   this.loading = true;

  //   if(this.formaBuscar.invalid){    

  //     this.loading = false;
  //     Swal.fire('Formulario con errores',`Complete correctamente todos los campos del formulario`,"warning");
  //     return Object.values(this.formaBuscar.controls).forEach(control => control.markAsTouched());
  //   }      
    
  //   let fecha_ini = this.dataService.getchangeFormatoFechaGuardar(this.formaBuscar.get('fecha_ini')?.value)
  //   let fecha_fin = this.dataService.getchangeFormatoFechaGuardar(this.formaBuscar.get('fecha_fin')?.value);

  //   this.listarTramitesAdministradorXFecha(fecha_ini, fecha_fin); 
    
  // }
  //FIN BUSCAR TRAMITES....................................................

  //DESCARGAR LISTA DE TRAMITES
  // descargarTramitesExcel(){
  //   let tramiteExcel: TramiteExcelModel = {};
  //   let listTramitesExcel: TramiteExcelModel[]=[];
  //   //definir lista para excel
  //   for (const tramite of this.listTramites){
  //     tramiteExcel= {};

  //     tramiteExcel.id_tramite = tramite.id_tramite;
  //     tramiteExcel.numero_tramite = tramite.numero_tramite;
  //     tramiteExcel.id_ciudadano = tramite.ciudadano.id_ciudadano;
  //     tramiteExcel.dni = tramite.ciudadano.dni;
  //     tramiteExcel.apellido = tramite.ciudadano.apellido;
  //     tramiteExcel.nombre = tramite.ciudadano.nombre;
  //     tramiteExcel.id_sexo = tramite.ciudadano.sexo_id;
  //     tramiteExcel.sexo = tramite.ciudadano.sexo.sexo;     
  //     tramiteExcel.telefono = tramite.ciudadano.telefono;
  //     tramiteExcel.fecha_nac = tramite.ciudadano.fecha_nac;
  //     tramiteExcel.email = tramite.ciudadano.email; 
  //     tramiteExcel.id_provincia = tramite.provincia.id_provincia;
  //     tramiteExcel.provincia = tramite.provincia.provincia;
  //     tramiteExcel.id_departamento = tramite.departamento.id_departamento;
  //     tramiteExcel.departamento = tramite.departamento.departamento;
  //     tramiteExcel.id_municipio = tramite.municipio.id_municipio;
  //     tramiteExcel.municipio = tramite.municipio.municipio;
  //     tramiteExcel.localidad_barrio = tramite.localidad_barrio;
  //     tramiteExcel.calle_direccion = tramite.calle_direccion;
  //     tramiteExcel.numero_dom = tramite.numero_dom;
  //     tramiteExcel.id_centro_mediacion = tramite.centro_mediacion.id_centro_mediacion;
  //     tramiteExcel.centro_mediacion = tramite.centro_mediacion.centro_mediacion;       
  //     tramiteExcel.id_departamento_centro = tramite.departamento.id_departamento;
  //     tramiteExcel.departamento_centro = tramite.departamento.departamento;
  //     tramiteExcel.id_municipio_centro = tramite.municipio.id_municipio;
  //     tramiteExcel.municipio_centro = tramite.municipio.municipio;
  //     tramiteExcel.fecha_tramite = tramite.fecha_tramite;
  //     tramiteExcel.es_expediente = tramite.es_expediente;
  //     tramiteExcel.expediente = tramite.expediente;
  //     tramiteExcel.fecha_expediente = tramite.fecha_expediente;
  //     tramiteExcel.esta_asesorado = tramite.esta_asesorado;
  //     tramiteExcel.id_objeto = tramite.objeto.id_objeto;
  //     tramiteExcel.objeto = tramite.objeto.objeto;
  //     tramiteExcel.violencia_genero = tramite.violencia_genero;
  //     tramiteExcel.violencia_partes = tramite.violencia_partes;
  //     tramiteExcel.existe_denuncia = tramite.existe_denuncia;
  //     tramiteExcel.medida_cautelar = tramite.medida_cautelar;     
  //     tramiteExcel.id_estado_tramite = tramite.estado_tramite.id_estado_tramite;
  //     tramiteExcel.estado_tramite = tramite.estado_tramite.estado_tramite;       
  //     tramiteExcel.fecha_finalizacion = tramite.fecha_finalizacion;
  //     tramiteExcel.observacion_finalizacion = tramite.observacion_finalizacion;
      
  //     listTramitesExcel.push(tramiteExcel);
  //   }

  //   //crear archivo excel para descargar
  //   // 1. Crear hoja de Excel
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(listTramitesExcel);

  //   // 2. Crear libro de Excel y añadir hoja
  //   const wb: XLSX.WorkBook = {
  //     Sheets: { 'Trámites': ws },
  //     SheetNames: ['Trámites']
  //   };

  //   // 3. Generar buffer
  //   const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  //   // 4. Guardar archivo
  //   const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  //   const now = new Date();
  //   //utilizo tambien metodo
  //   const fechaFormateada = `${this.completarCeros(now.getDate())}${this.completarCeros(now.getMonth() + 1)}${now.getFullYear()}-${this.completarCeros(now.getHours())}${this.completarCeros(now.getMinutes())}`;

  //   FileSaver.saveAs(blob, `Tramites_${fechaFormateada}.xlsx`);
    
  // }
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
