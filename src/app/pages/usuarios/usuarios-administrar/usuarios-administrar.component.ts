import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { UsuariosTramiteService } from '../../../service/usuarios-tramite.service';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { UsuarioTramiteModel } from 'src/app/models/usuario_tramite.model';
import { TramiteModel } from 'src/app/models/tramite.model';
import { globalConstants } from 'src/app/common/global-constants';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SexoModel } from 'src/app/models/sexo.model';
import { DataMokeadaService } from 'src/app/service/data-mokeada.service';
import { UsuariosService } from 'src/app/service/usuarios.service';
import Swal from 'sweetalert2';
import { Table } from 'primeng/table';
import { UsuariosCentroService } from 'src/app/service/usuarios-centro.service';
import { UsuarioCentroModel } from 'src/app/models/usuario_centro.model ';
import { ElementoModel } from 'src/app/models/elemento.model';
import { RolesService } from '../../../service/roles.service';
import { RolModel } from 'src/app/models/rol.model';
import { opcionSiNo } from 'src/app/common/data-mokeada';

@Component({
  selector: 'app-usuarios-administrar',
  templateUrl: './usuarios-administrar.component.html',
  styleUrls: ['./usuarios-administrar.component.scss']
})
export class UsuariosAdministrarComponent implements OnInit {

  //PARA FILTRAR EN TABLA
  @ViewChild('dt') table: Table;
  @ViewChild('filter') filter: ElementRef;
  
  loading:boolean = true;

  //MODELOS
  dataUsuario: UsuarioModel= new UsuarioModel;

  //listas
  listaAnios: number[] = [];
  listaAniosDropdown: { label: string, value: number }[] = [];
  listaSexo: SexoModel[] = [];
  listaSiNo: any[] = [];
  listaRoles: RolModel[] = [];
  listTramitesAsignados: UsuarioTramiteModel[]=[];
  listTramitesfinalizados: UsuarioTramiteModel[]=[];
  listUsuarioCentrosMediacion: UsuarioCentroModel[]=[]; 
  elementosCentroMediacion: ElementoModel[]=[];  

  //FORMULARIOS
  formaUsuario: FormGroup; 
  formaBusqueda: FormGroup;
  formaRolUsuario: FormGroup;
  formaResetPassword: FormGroup;
  
  //VARIABLES
  anioActual: number;

  constructor(
    private fb: FormBuilder,
    
    private authService: AuthService,
    
    private dataMokeadaService: DataMokeadaService,
    public dataService: DataService,    
    private rolesService: RolesService,
    private usuariosCentroService: UsuariosCentroService,
    private usuarioService: UsuariosService,
    private usuarioTramiteService: UsuariosTramiteService,
    private router: Router
  ) {    

    this.formaUsuario = this.fb.group({
      dni: ['',[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.minLength(5)]],
      apellido: ['',[Validators.required, Validators.pattern(/^[A-Za-zñÑ0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      nombre:   ['',[Validators.required, Validators.pattern(/^[A-Za-zñÑ0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      sexo_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      telefono: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      email: ['',[Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],    
      
    });

    this.formaBusqueda = this.fb.group({      
      anio: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      
    });

    this.formaResetPassword = this.fb.group({
      confirmacion: ['',[Validators.required]],         
    });

    this.formaRolUsuario = this.fb.group({
      rol_actual: ['',[Validators.required]],
      activo_actual: ['', [Validators.required]],
      rol_id: [,[Validators.required]],
      activo: [,[Validators.required]]
    });
    
  }
  //FIN CONSTRUCTOR..................................................

  //MENSAJES DE VALIDACIONES
  user_validation_messages = {
    //datos tramite
    'dni': [
      { type: 'required', message: 'El dni es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' },
      { type: 'minlength', message: 'El número ingresado debe tener mas de 5 digitos.' }
    ],
    'apellido': [
      { type: 'required', message: 'El apellido es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números, letras y espacios.' },
      { type: 'minlength', message: 'La cantidad mínima de caracteres es 2.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 100.' }
    ],
    'nombre': [
      { type: 'required', message: 'El nombre es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números, letras y espacios.' },
      { type: 'minlength', message: 'La cantidad mínima de caracteres es 2.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 100.' }
    ],
    'sexo_id': [
      { type: 'required', message: 'El sexo es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' }
    ],
    'telefono': [
      { type: 'required', message: 'El télefono es requerido.' },
        { type: 'minlength', message: 'La cantidad mínima de caracteres es 1.' },
        { type: 'maxlength', message: 'La cantidad máxima de caracteres es 100.' }
    ],
    'email': [
      { type: 'required', message: 'El e-mail es requerido' },
      { type: 'pattern', message: 'El formato del e-mail no es correcto.' }
    ],
    
  }
  //FIN MENSAJES DE VALIDACIONES...............................................................

  //VALIDACIONES DE FORMULARIO
  isValid(campo: string): boolean{     
    
    return this.formaUsuario.get(campo)?.invalid && this.formaUsuario.get(campo)?.touched;      
  }


  ngOnInit(): void {
    this.dataUsuario = this.dataService.usuarioData;
    if(this.dataUsuario.dni){
      this.cargarFormularioUsuario();
      this.cargarCentrosMediacionXUsuario(this.dataUsuario.id_usuario);
      this.listarRoles();
      this.listarTramitesAsignados();
      this.listaSiNo= opcionSiNo;

      //obtener anio actual para buscar por defecto los tramites del usuario de ese anio
      this.anioActual = new Date().getFullYear();
      this.listarTramitesUsuarioFinalizadosXAnio(this.anioActual);

      //cargar lista de años
      for (let anio = 2023; anio <= this.anioActual; anio++) {
        this.listaAnios.push(anio);
      }
      this.listaAniosDropdown = this.listaAnios.map(anio => ({
        label: anio.toString(),
        value: anio
      }));
      this.formaBusqueda.get('anio')?.setValue(this.anioActual);
    }
    else{
      this.router.navigateByUrl("admin/usuarios/lista");
    }    

    //CARGA DE LISTADOS DESDE DATA MOKEADA
    this.dataMokeadaService.listarSexo().subscribe(sexos => {
      this.listaSexo = sexos;
    });

  }
  //FIN ONINIT.......................................................

  //GUARDAR RESET PASS USUARIO  
  submitFormResetPass(){
    
    if(this.formaResetPassword.invalid){       
        
        Swal.fire('Formulario con errores',`Complete correctamente todos los campos del formulario`,"warning");
        return Object.values(this.formaUsuario.controls).forEach(control => control.markAsTouched());
    }

    console.log("confirmacion antes", this.formaResetPassword.get('confirmacion')?.value);

    if(this.formaResetPassword.get('confirmacion')?.value != "RESET"){       
      
      console.log("confirmacion", this.formaResetPassword.get('confirmacion')?.value);
      Swal.fire('Formulario con errores',`Debe tipear la palabra RESET para continuar`,"warning");
      return Object.values(this.formaResetPassword.controls).forEach(control => control.markAsTouched());
  }

    let dataRegistro: Partial<UsuarioModel>;
    dataRegistro = {     
      clave: this.dataUsuario.dni.toString()
    };
    
    //GUARDAR EDICION USUARIO
    this.usuarioService.guardarCambiarContrasenia(this.dataUsuario.id_usuario, dataRegistro)
      .subscribe({
        next: (resultado) => {
            Swal.fire('Exito',`Se modificó los datos con exito`,"success");   
        },
        error: (error) => {
            Swal.fire('Error',`Error al realizar la modificación: ${error.error.message}`,"error") 
        }
      });         
    //FIN GUARDAR EDICION USUARIO 

  }    
  //FIN GUARDAR RESET PASS USUARIO............................................................

  //GUARDAR MODIFICAR ESTADO USUARIO  
  submitFormModificarEstadoUsuario(){
    
    if(this.formaRolUsuario.invalid){       
        
        Swal.fire('Formulario con errores',`Complete correctamente todos los campos del formulario`,"warning");
        return Object.values(this.formaRolUsuario.controls).forEach(control => control.markAsTouched());
    }

    let dataRegistro: Partial<UsuarioModel>;
    dataRegistro = {
      rol_id: this.formaRolUsuario.get('rol_id')?.value,
      activo: this.formaRolUsuario.get('activo')?.value,     
    };
    
    //GUARDAR EDICION USUARIO
    this.usuarioService.guardarEdicionEstado(this.dataUsuario.id_usuario, dataRegistro)
      .subscribe({
        next: (resultado) => {
            Swal.fire('Exito',`Se modificó los datos con exito`,"success");   
        },
        error: (error) => {
            Swal.fire('Error',`Error al realizar la modificación: ${error.error.message}`,"error") 
        }
      });         
    //FIN GUARDAR EDICION USUARIO 

  }    
  //FIN GUARDAR MODIFICAR ESTADO USUARIO............................................................

  //GUARDAR MODIFICAR USUARIO  
  submitFormUsuario(){
    
    if(this.formaUsuario.invalid){       
        
        Swal.fire('Formulario con errores',`Complete correctamente todos los campos del formulario`,"warning");
        return Object.values(this.formaUsuario.controls).forEach(control => control.markAsTouched());
    }

    let dataRegistro: Partial<UsuarioModel>;
    dataRegistro = {

      dni: parseInt(this.formaUsuario.get('dni')?.value),
      apellido: this.formaUsuario.get('apellido')?.value,
      nombre: this.formaUsuario.get('nombre')?.value,
      sexo_id: parseInt(this.formaUsuario.get('sexo_id')?.value),
      telefono: this.formaUsuario.get('telefono')?.value,
      email: this.formaUsuario.get('email')?.value,           
    };
    
    //GUARDAR EDICION USUARIO
    this.usuarioService.guardarEdicionPerfil(this.dataUsuario.id_usuario, dataRegistro)
      .subscribe({
        next: (resultado) => {
            Swal.fire('Exito',`Se modificó los datos con exito`,"success");   
        },
        error: (error) => {
            Swal.fire('Error',`Error al realizar la modificación: ${error.error.message}`,"error") 
        }
      });         
    //FIN GUARDAR EDICION USUARIO 

  }    
  //FIN GUARDAR MODIFICAR USUARIO............................................................

  //LISTADO DE TRAMITES ASIGNADOS
  listarTramitesAsignados(){    
    this.usuarioTramiteService.listarTramitesAsignadosXUsuario(this.dataUsuario.id_usuario).
        subscribe(respuesta => {
        this.listTramitesAsignados= respuesta[0];
        this.loading = false;  
        console.log("tramites asignados", this.listTramitesAsignados);
    });
  }
  //FIN LISTADO DE TRAMITES ASIGNADOS.......................................................

  //LISTADO DE TRANITES USUARIO
  listarTramitesUsuarioFinalizados(){
    let id_usuario: number = this.dataUsuario.id_usuario;

    //REVISAR PARA LISTAR TRAMITES FINALIZADOS
    this.usuarioTramiteService.listarTramitesFinalizadosXUsuario(id_usuario).
      subscribe(respuesta => {
        this.listTramitesfinalizados= respuesta[0];
        this.loading = false;  
    
      });
  }
  //FIN LISTADO DE TRAMITES USUARIO.......................................................

  //LISTADO DE TRANITES USUARIO
  listarTramitesUsuarioFinalizadosXAnio(anio: number){
    let id_usuario: number = this.dataUsuario.id_usuario;    

    //REVISAR PARA LISTAR TRAMITES FINALIZADOS
    this.usuarioTramiteService.listarTramitesFinalizadosXUsuarioXAnio(id_usuario, anio).
      subscribe(respuesta => {
        this.listTramitesfinalizados= respuesta[0];
        this.loading = false;  
      });
  }
  //FIN LISTADO DE TRAMITES USUARIO.......................................................

  //TRAMITES FINALIZADOS POR AÑO
  buscarFinalizadosXAnio(){
    let anio = parseInt(this.formaBusqueda.get('anio')?.value);
    this.listarTramitesUsuarioFinalizadosXAnio(anio);
  }
  //FIN TRAMITES FINALIZADOS POR AÑO

  //CARGA DE ROLES
  listarRoles(){
    this.rolesService.listarRolesTodos().
      subscribe(respuesta => {
        this.listaRoles= respuesta[0];    
    });  
  }
  //FIN CARGA DE ROLES.............................................

  //CARGA DE CENTROS DE MEDIACION
  cargarCentrosMediacionXUsuario(id_usuario: number){
    this.usuariosCentroService.listarCentrosActivosXUsuario(id_usuario).
      subscribe(respuesta => {
        this.listUsuarioCentrosMediacion= respuesta[0];
        this.elementosCentroMediacion = this.listUsuarioCentrosMediacion.map(centro => {
          return {
            clave: centro.centro_mediacion.id_centro_mediacion,
            value: centro.centro_mediacion.centro_mediacion + " (Municipio: " + centro.centro_mediacion.municipio.municipio + " - Barrio: " + centro.centro_mediacion.localidad_barrio + " - Dirección: " + centro.centro_mediacion.calle_direccion + " n°" + centro.centro_mediacion.numero_dom + ")"
            }
        });        
    
    });  
  }
  //FIN CARGA DE CENTROS DE MEDIACION.............................................

  //CARGAR FORMULARIO USUARIO
  cargarFormularioUsuario(){
    this.formaUsuario.get('dni')?.setValue(this.dataUsuario.dni);
    this.formaUsuario.get('apellido')?.setValue(this.dataUsuario.apellido);
    this.formaUsuario.get('nombre')?.setValue(this.dataUsuario.nombre);
    this.formaUsuario.get('sexo_id')?.setValue(this.dataUsuario.sexo_id);
    this.formaUsuario.get('telefono')?.setValue(this.dataUsuario.telefono);
    this.formaUsuario.get('email')?.setValue(this.dataUsuario.email);

    this.formaRolUsuario.get('activo_actual')?.setValue(this.dataUsuario.activo?"SI":"NO");
    this.formaRolUsuario.get('rol_actual')?.setValue(this.dataUsuario.rol.rol);
    this.formaRolUsuario.get('rol_id')?.setValue(this.dataUsuario.rol.id_rol);
    this.formaRolUsuario.get('activo')?.setValue(this.dataUsuario.activo);
  }
  //FIN CARGAR FORMULARIO USUARIO......................

  //ACCEDER A DATA SERVICE
  administrarTramite(data: TramiteModel){
    this.dataService.tramiteData = data;
    if (this.authService.currentUserLogin) {
      if(data.estado_tramite_id == 3){
        this.router.navigateByUrl("admin/tramites/administrar-finalizado");
      }
      else{
        this.router.navigateByUrl("admin/tramites/administrar");
  
      }
      
    }
    else{
      this.router.navigateByUrl("ciudadano/tramites/administrar");
    }
    
  }
  //FIN ACCEDER A DATA SERVICE

  //CANCELAR MODIFICACION DATOS USUARIO
  cancelarModificacionUsuario(){
    this.cargarFormularioUsuario();
    Swal.fire('Operación ancelada','Se canceló la modificación de los datos del usuario',"info") 
        
  }
  //CANCELAR MODIFICACION DATOS USUARIO.................

  //LIMPIAR FILTROS
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  } 
  //FIN LIMPIAR FILTROS....................................................................................  

  //IR A PRINCIPAL
  irAPrincipal(){
    this.router.navigateByUrl("admin/usuarios/lista");
  }
  //FIN IR A PRINCIPAL

}
