import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { UsuarioModel } from '../../../models/usuario.model';
import { UsuariosService } from '../../../service/usuarios.service';
import { FiltroModel } from '../../../models/filtro.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from 'src/app/service/app.config.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { DataService } from '../../../service/data.service';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { DataMokeadaService } from '../../../service/data-mokeada.service';
import { AuthService } from 'src/app/service/auth.service';
import { RolModel } from 'src/app/models/rol.model';
import { opcionSiNo } from 'src/app/common/data-mokeada';
import { FiltroBooleanModel } from 'src/app/models/filtro_boolean.model';

@Component({
  selector: 'app-usuarios-lista',
  templateUrl: './usuarios-lista.component.html',
  providers: [MessageService,DatePipe],
  styleUrls: ['./usuarios-lista.component.scss'],
 
})
export class UsuariosListaComponent implements OnInit {

  loading:boolean = true;

  //PARA FILTRAR EN TABLA
  @ViewChild('dt') table: Table;
  @ViewChild('filter') filter: ElementRef;

  //CANTIDADES
  cantEnEspera: number = 0;
  cantRecibidos: number = 0;
  cantEnviados: number = 0;

  //VARIABLES TRAMITE    
  usuario: UsuarioModel;
  usuarioDialog: boolean;
  validacionClaves: boolean = true;

  //LISTAS    
  listRoles: RolModel[]=[];
  listSexo: SexoModel[]=[];
  listUsuarios: UsuarioModel[]=[];  
  filtroRoles: FiltroModel[]=[];
  filtroSexo: FiltroModel[]=[];
  filtroSiNoBoolean: FiltroBooleanModel[]=[];

  //FORMULARIOS
  formaUsuario: FormGroup;  

  constructor(
    private fb: FormBuilder,
    public configService: ConfigService,
    private readonly datePipe: DatePipe,
    private authService: AuthService,
    private readonly dataService: DataService,
    private dataMokeadaService: DataMokeadaService,
    private usuariosService: UsuariosService,
    private router: Router

  ) { 

    this.formaUsuario = this.fb.group({
      dni: ['',[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.minLength(5)]],
      apellido: ['',[Validators.required, Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      nombre:   ['',[Validators.required, Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      sexo_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],      
      telefono: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      email: ['',[Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],    
      // clave1: ['',[Validators.required,  Validators.minLength(8),Validators.maxLength(16),Validators.pattern(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{0,17}$/)]],
      clave1: ['',[Validators.required,  Validators.minLength(8),Validators.maxLength(16),Validators.pattern(/[^$%&|<>=# ]$/)]],
      clave2: ['',[Validators.required,  Validators.minLength(8)]]
    
    });
  }

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
    'clave1': [
      { type: 'required', message: 'La contraseña es requerida' },
      { type: 'minlength', message: 'La contraseña debe tener al menos 8 caracteres.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 16.' },
      //{ type: 'pattern', message: 'Debe ingresar al menos un número, al menos una letra minuscula, almenos una letra mayuscula.\n Puede tener guiones bajo (_).\n No debe tener otros caracteres especiales.' },
      { type: 'pattern', message: 'Estos caracteres no están permitidos ($,%,&,|,<,>,=,#,) y tampoco espacios.' },
    
    ],
    'clave2': [
      { type: 'required', message: 'La contraseña es requerida' },
      { type: 'minlength', message: 'La contraseña debe tener al menos 8 caracteres.' },        
    ],
    
  }
  //FIN MENSAJES DE VALIDACIONES...............................................................

  //VALIDACIONES DE FORMULARIO
  isValid(campo: string): boolean{     
    
    return this.formaUsuario.get(campo)?.invalid && this.formaUsuario.get(campo)?.touched;      
  }

  clavesValidationIguales(): boolean{
    return ((this.formaUsuario.get('clave1').value === this.formaUsuario.get('clave2').value))?  true: false;
        
  }
  //FIN VALIDACIONES DE FORMULARIO

  ngOnInit(): void {
    this.listarUsuarios();

    //CARGA DE LISTADOS DESDE DATA MOKEADA
    // this.dataMokeadaService.listarDepartamentos().subscribe(departamentos => {
    //   this.listDepartamentos = departamentos;
    // });

    // this.dataMokeadaService.listarMunicipios().subscribe(municipios => {
    //   this.listMunicipiosCompleto= municipios;
    // });

    this.dataMokeadaService.listarRoles().subscribe(roles => {
      this.listRoles = roles;
      
      this.filtroRoles = this.listRoles.map(respuesta => {
        return {
          label: respuesta.rol.toLowerCase(),
          value: respuesta.rol,
         }
      });

    });

    this.dataMokeadaService.listarSexo().subscribe(sexos => {
      this.listSexo = sexos;
      
      this.filtroSexo = this.listSexo.map(respuesta => {
        return {
          label: respuesta.sexo.toLowerCase(),
          value: respuesta.sexo,
         }
      });

    });
    
    this.filtroSiNoBoolean = opcionSiNo.map(respuesta => {
      return {
        label: respuesta.respuesta_sino.toUpperCase(),
        value: respuesta.id_opcion_sino,
       }
    });
   
    
  }
  //FIN ONINIT...................................................
  //...............................................................

  //GUARDAR USUAEIO
  submitFormUsuario(){
    
    if(this.formaUsuario.invalid){                        
        // this.msgs = [];
        // this.msgs.push({ severity: 'warn', summary: 'Errores en formulario', detail: 'Cargue correctamente los datos' });
        // this.serviceMensajes.add({key: 'tst', severity: 'warn', summary: 'Errores en formulario', detail: 'Cargue correctamente los dato'});
        Swal.fire('Formulario con errores',`Complete correctamente todos los campos del formulario`,"warning");
        
        let fechaAuxiliar = this.datePipe.transform(this.formaUsuario.get('fecha_nac')?.value,"yyyy-MM-dd")!;
                
        return Object.values(this.formaUsuario.controls).forEach(control => control.markAsTouched());
    }
    this.validacionClaves = this.clavesValidationIguales();
    if(!this.validacionClaves){
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
      clave: this.formaUsuario.get('clave1')?.value,
       
    };
    
    
    //GUARDAR NUEVO CIUDADANO
    this.usuariosService.guardarUsuario(dataRegistro)
        .subscribe(resultado => {
            let usuarioRes: UsuarioModel = resultado;
            this.hideDialogUsuario();            
            Swal.fire('Exito',`El registro se realizo con exito`,"success");
            this.listarUsuarios();
           
        },
        (error) => {
            Swal.fire('Error',`Error al realizar el regsistro: ${error.error.message}`,"error") 
        }
    );         
    //FIN GUARDAR NUEVO CIUDADANO 

  } 
  //FIN GUARDAR USUAEIO.................................................

  //LISTADO DE USUARIOS
  listarUsuarios(){    
    this.usuariosService.listarUsuariosTodos().
        subscribe(respuesta => {
        this.listUsuarios= respuesta[0];        
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE USUARIOS....................................................... 

  //MANEJO DE FORMULARIO DIALOG
  openDialogUsuario() {
    this.usuarioDialog = true;
  }
  
  hideDialogUsuario() {
    this.formaUsuario.reset();
    this.usuarioDialog = false;
  }    
  //FIN MANEJO FORMULARIO DIALOG....................................
  

  //VERIFICAR ADMINISTRADOR
  isAdminCuenta(): boolean{
    if(this.authService.currentUserLogin.rol_id === "admincuentas"){
      return true;
    }

    return false;
  }
  //FIN VERIFICAR ADMINISTRADOR

  //LIMPIAR FILTROS
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  } 
  //FIN LIMPIAR FILTROS....................................................................................  

  //ACCEDER A ADMINSTRAR USUARIO
  administrarUsuario(data: UsuarioModel){
    this.dataService.usuarioData = data;
    this.router.navigateByUrl("admin/usuarios/administrar");
  }
  //FIN ACCEDER A ADMINSTRAR USUARIO

}


