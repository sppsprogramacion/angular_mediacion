import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { DataService } from 'src/app/service/data.service';
import { TramiteModel } from '../../../models/tramite.model';
import { TramitesService } from '../../../service/tramites.service';
import { TotalesTramitesModel } from '../../../models/totales_tramites.model';
import { globalConstants } from '../../../common/global-constants';
import { UsuariosTramiteService } from '../../../service/usuarios-tramite.service';
import { UsuarioTramiteModel } from '../../../models/usuario_tramite.model';
import { AuthService } from '../../../service/auth.service';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tiposBusquedaTramites } from 'src/app/common/data-mokeada';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tramites-principal',
  templateUrl: './tramites-principal.component.html',
  styleUrls: ['./tramites-principal.component.scss']
})
export class TramitesPrincipalComponent implements OnInit {

  //PARA FILTRAR EN TABLA
  @ViewChild('dt') table: Table;
  @ViewChild('filter') filter: ElementRef;

  //iidiomas
  es: any = {};

  
  //VARIABLES TRAMITE    
  tramite: TramiteModel;
  tramiteDialog: boolean;
  nuevoTramite: boolean;
  submitted: boolean;
  urlTramite: string = 'tramites/administrar';
  totalTramite: number= 0;
  totalesTramites: TotalesTramitesModel= {};
  tituloPagina: string ="Usuario: Administrador"
  
  //LISTAS    
  listTramites: TramiteModel[]=[];
  listUsuariosTramites: UsuarioTramiteModel[]=[];
  listDepartamentos: DepartamentoModel[]=[];
  listMunicipios: MunicipioModel[]= [];
  listSexo: SexoModel[]=[];  
  listTiposBusqueda: any[] = [];
  
  //booleanas
  loading:boolean = true;
  isFecha: boolean = false;
  
  //FORMULARIOS
  formaBuscar: FormGroup;

  constructor(
    private fb: FormBuilder,
    
    private authService: AuthService,
    private dataService: DataService,
    private tramitesService: TramitesService,
    private usuariosTramitesService: UsuariosTramiteService,
    private router: Router
  ) { 
    this.formaBuscar = this.fb.group({
      id_tipo_busqueda: [,[Validators.required]],
      buscar: ['',[Validators.required]],
      fecha_ini: ['',[Validators.required]],
      fecha_fin: ['',[Validators.required]],

    });
  }

  ngOnInit(): void {
    if (this.authService.currentUserLogin.rol_id == "administrador" || this.authService.currentUserLogin.rol_id == "supervisor") {
      this.tituloPagina ="Usuario: Administrador";
      this.listarTramitesAdministrador();
    }

    if (this.authService.currentCiudadanoLogin) {
      this.tituloPagina ="Ciudadano: " + this.authService.currentCiudadanoLogin.apellido + " " + this.authService.currentCiudadanoLogin.nombre;
      this.listTramites = [];
      this.loading = false;
      //this.listarTramitesCiudadano();
    }
    
    if (this.authService.currentUserLogin) {
      this.tituloPagina ="Usuario: " + this.authService.currentUserLogin.apellido + " " + this.authService.currentUserLogin.nombre;
      this.listTramites = [];
      this.loading = false;
    }

    this.contarTramitesXEstado();
    
    this.listTiposBusqueda = tiposBusquedaTramites;
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
    'id_tipo_busqueda': [
      { type: 'required', message: 'El tipo de busqueda es requerido' },
    ],
    'buscar': [
      { type: 'required', message: 'El dato a buscar es requerido' },
    ],
    'fecha_ini': [
      { type: 'required', message: 'La fecha inicio es requerida' },
    ],
    'fecha_fin': [
      { type: 'required', message: 'La fecha fin es requerida' },
    ],
  }
  //FIN MENSAJES DE VALIDACIONES...............................................................

  //BUSCAR CIUDADANOS
  buscarTramites(){
    this.loading = true;

    if(this.formaBuscar.invalid){    

      this.loading = false;
      //Swal.fire('Formulario con errores',`Complete correctamente todos los campos del formulario`,"warning");
      return Object.values(this.formaBuscar.controls).forEach(control => control.markAsTouched());
    }
    
    const dato = this.formaBuscar.get('buscar')?.value;
    
    if(this.formaBuscar.get('id_tipo_busqueda')?.value === "apellido"){
      this.listarTramitesAdministradorXApellidoCiudadano(dato);
    }

    if(this.formaBuscar.get('id_tipo_busqueda')?.value === "dni"){
      
      if(Number.isInteger(Number(dato))){

        this.listarTramitesAdministradorXDniCiudadano(+dato);
      }
      else{
        this.loading = false;
        Swal.fire('Error en busqueda',`El DNI debe ser un número`,"warning");
      }
    }

    if(this.formaBuscar.get('id_tipo_busqueda')?.value === "expediente"){
      this.listarTramitesAdministradorXExpediente(dato);
    }

    if(this.formaBuscar.get('id_tipo_busqueda')?.value === "numtramite"){
      
      if(Number.isInteger(Number(dato))){

        this.listarTramitesAdministradorXNumeroTramite(+dato);
      }
      else{
        this.loading = false;
        Swal.fire('Error en busqueda',`El número de trámite debe ser un número`,"warning");
      }
    }

    if(this.formaBuscar.get('id_tipo_busqueda')?.value === "fecha"){
      let fecha_ini = this.dataService.getchangeFormatoFechaGuardar(this.formaBuscar.get('fecha_ini')?.value)
      let fecha_fin = this.dataService.getchangeFormatoFechaGuardar(this.formaBuscar.get('fecha_fin')?.value);

      this.listarTramitesAdministradorXFecha(fecha_ini, fecha_fin);
      //seguir
    }

      
    
  }

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


  onChangeTipoBusqueda(){
    const id = this.formaBuscar.get('id_tipo_busqueda')?.value;
    if(id == "fecha"){  
        this.isFecha = true;
        this.formaBuscar.get('buscar')?.setValue("en fecha");
        this.formaBuscar.get('fecha_ini')?.setValue(null);
        this.formaBuscar.get('fecha_fin')?.setValue(null);
         
    }
    else{
      this.isFecha = false;
      this.formaBuscar.get('buscar')?.setValue("");
      this.formaBuscar.get('fecha_ini')?.setValue("01/01/2024");
      this.formaBuscar.get('fecha_fin')?.setValue(this.dataService.getchangeFormatoFechaRetornar(new Date));
    }
  }

  //LISTADO DE TRAMITES ADMINISTRADOR PAELLIDO
  listarTramitesAdministradorXApellidoCiudadano(apellido: string){    
    this.tramitesService.listarTramitesTodosApellidoCiudadano(apellido).
      subscribe(respuesta => {
        this.listTramites= respuesta[0];
        this.totalTramite = respuesta[1];
        this.loading=false;
    
      });
  }
  //FIN LISTADO DE TRAMITES ADMINISTRADOR APELLIDO............................

  //LISTADO DE TRAMITES ADMINISTRADOR
  listarTramitesAdministradorXDniCiudadano(dni: number){    
    this.tramitesService.listarTramitesTodosDniCiudadano(dni).
      subscribe(respuesta => {
        this.listTramites= respuesta[0];
        this.totalTramite = respuesta[1];
        this.loading=false;
    
      });
  }
  //FIN LISTADO DE TRAMITES ADMINISTRADOR............................

  //LISTADO DE TRAMITES ADMINISTRADOR ExPEDIENTE
  listarTramitesAdministradorXExpediente(expediente: string){    
    this.tramitesService.listarTramitesTodosExpediente(expediente).
      subscribe(respuesta => {
        this.listTramites= respuesta[0];
        this.totalTramite = respuesta[1];
        this.loading=false;
    
      });
  }
  //FIN LISTADO DE TRAMITES ADMINISTRADOR EXPEDIENTE............................

  //LISTADO DE TRAMITES ADMINISTRADOR ExPEDIENTE
  listarTramitesAdministradorXFecha(fecha_ini: string, fecha_fin: string){    
    this.tramitesService.listarTramitesTodosFecha(fecha_ini, fecha_fin).
      subscribe(respuesta => {
        this.listTramites= respuesta[0];
        this.totalTramite = respuesta[1];
        this.loading=false;
    
      });
  }
  //FIN LISTADO DE TRAMITES ADMINISTRADOR EXPEDIENTE............................

  //LISTADO DE TRAMITES ADMINISTRADOR
  listarTramitesAdministradorXNumeroTramite(numeroTramite: number){    
    this.tramitesService.listarTramitesTodosNumeroTramite(numeroTramite).
      subscribe(respuesta => {
        this.listTramites= respuesta[0];
        this.totalTramite = respuesta[1];
        this.loading=false;
    
      });
  }
  //FIN LISTADO DE TRAMITES ADMINISTRADOR............................
  
  //LISTADO DE TRANITES USUARIO
  listarTramitesUsuario(){
    let id_usuario: number = 0;
    id_usuario = this.authService.currentUserLogin.id_usuario;

    this.usuariosTramitesService.listarTramitesAsignadosXUsuario(id_usuario).
        subscribe(respuesta => {
        this.listUsuariosTramites= respuesta[0];
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE TRAMITES USUARIO.......................................................

  //LISTADO DE TRAMITES CIUDADANOS
  listarTramitesCiudadano(){    
    this.tramitesService.listarTramitesTodos().
        subscribe(respuesta => {
        this.listTramites= respuesta[0];
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE TRAMITES CIUDADANOS.......................................................

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


  //ACCEDER A DATA SERVICE
  administrarTramite(data: TramiteModel){
    this.dataService.tramiteData = data;
    this.dataService.getTramiteData(data);

    if( this.authService.currentUserLogin.rol_id == "administrador" && data.estado_tramite_id != 3){
      this.router.navigateByUrl("admin/tramites/administrar");
    }    

    //verificacion si el usuario tiene la funcion de administrativo en el tramite
    if( this.authService.currentUserLogin.rol_id == "supervisor" && data.estado_tramite_id != 3 ){
      this.router.navigateByUrl("admin/tramites/administrar-visor");
    }
    
    //verificacion si el usuario tiene la funcion de mediador en el tramite
    if( this.authService.currentUserLogin.rol_id == "mediador" && data.estado_tramite_id != 3){
      this.router.navigateByUrl("admin/tramites/administrar-med" );
    }


    if(data.estado_tramite_id == 3){
      this.router.navigateByUrl("admin/tramites/administrar-finalizado");
    }
    
    
  }
  //FIN ACCEDER A DATA SERVICE

}
