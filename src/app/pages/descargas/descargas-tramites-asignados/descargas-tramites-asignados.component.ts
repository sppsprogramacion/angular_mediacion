import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { globalConstants } from 'src/app/common/global-constants';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { TramiteModel } from 'src/app/models/tramite.model';
import { UsuarioTramiteModel } from 'src/app/models/usuario_tramite.model';
import { DataService } from 'src/app/service/data.service';
import { TramitesService } from 'src/app/service/tramites.service';
import { UsuariosTramiteService } from '../../../service/usuarios-tramite.service';
import { AuthService } from 'src/app/service/auth.service';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

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
  //FIN BUSCAR TRAMITES....................................................

  //LISTADO DE TRAMITES ADMINISTRADOR X FECHA
  listarTramitesAdministradorXFecha(fecha_ini: string, fecha_fin: string){    
    console.log("En metodo");
    this.usuariosTramitesService.listarTramitesTodosFecha(fecha_ini, fecha_fin).
      subscribe(respuesta => {
        this.listUsuariosTramites= respuesta[0];
        this.loading=false;
    
      });
  }
  //FIN LISTADO DE TRAMITES ADMINISTRADOR X FECHA............................

  //LISTADO DE TRAMITES ADMINISTRADOR ASIGNADOS
  listarTramitesAdministrador(){    
    
    this.usuariosTramitesService.listarTramitesAsignadosXCiudadano(0)
      .subscribe({
        next: (respuesta) => {
          this.listUsuariosTramites= respuesta[0];
          this.loading = false; 
        }     
      });
  }
  //FIN LISTADO DE TRAMITES ADMINISTRADOR ASIGNADOS....................................................... 
   

  //LIMPIAR FILTROS
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  } 
  //FIN LIMPIAR FILTROS....................................................................................  


  //ACCEDER A DATA SERVICE
  administrarTramite(data: UsuarioTramiteModel){
    this.dataService.tramiteData = data.tramite;
    if( this.authService.currentUserLogin.rol_id == "administrador" ){
      this.router.navigateByUrl("admin/tramites/administrar");
    }

    //verificacion si el usuario tiene la funcion de administrativo en el tramite
    if( this.authService.currentUserLogin.rol_id == "supervisor" || data.funcion_tramite_id == 1 ){
      this.router.navigateByUrl("admin/tramites/administrar-visor");
    }
    
    //verificacion si el usuario tiene la funcion de mediador en el tramite
    if( this.authService.currentUserLogin.rol_id == "mediador" && data.funcion_tramite_id == 2 ){
      this.router.navigateByUrl("admin/tramites/administrar-med");
    }
  }

}
