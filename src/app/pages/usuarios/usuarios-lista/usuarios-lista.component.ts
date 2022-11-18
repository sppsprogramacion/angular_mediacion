import { Component, OnInit } from '@angular/core';
import { CiudadanoModel } from 'src/app/models/ciudadano.model';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { CiudadanosService } from 'src/app/service/ciudadanos.service';
import { UsuarioModel } from '../../../models/usuario.model';
import { UsuariosService } from '../../../service/usuarios.service';
import { departamentos, municipios, sexo } from '../../../common/data-mokeada';
import { FiltroModel } from '../../../models/filtro.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from 'src/app/service/app.config.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-usuarios-lista',
  templateUrl: './usuarios-lista.component.html',
  styleUrls: ['./usuarios-lista.component.scss']
})
export class UsuariosListaComponent implements OnInit {

  loading:boolean = true;

  //VARIABLES TRAMITE    
  usuario: UsuarioModel;
  usuarioDialog: boolean;
  nuevoUsuario: boolean;
  submitted: boolean;

  //LISTAS    
  listUsuarios: UsuarioModel[]=[];
  listDepartamentos: DepartamentoModel[]=[];
  listMunicipios: MunicipioModel[]= [];
  listSexo: FiltroModel[]=[];

  //FORMULARIOS
  formaUsuario: FormGroup;  

  constructor(
    private fb: FormBuilder,
    public configService: ConfigService,
    private readonly datePipe: DatePipe,
    private serviceMensajes: MessageService,
    private usuariosService: UsuariosService

  ) { 

    this.formaUsuario = this.fb.group({
      dni: ['',[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.minLength(5)]],
      apellido: ['',[Validators.required, Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      nombre:   ['',[Validators.required, Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      sexo_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      departamento_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      municipio_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      localidad_barrio: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      calle_direccion: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],        
      numero_dom: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      telefono: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      fecha_nac: [,[Validators.required, Validators.maxLength(100)]],  
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
    'departamento_id': [
      { type: 'required', message: 'El sexo es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' }
    ],
    'municipio_id': [
      { type: 'required', message: 'El sexo es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' }
    ],
    'localidad_barrio': [
        { type: 'required', message: 'La localidad/barrio es requerido.' },
        { type: 'minlength', message: 'La cantidad mínima de caracteres es 1.' },
        { type: 'maxlength', message: 'La cantidad máxima de caracteres es 100.' }
    ],
    'calle_direccion': [
        { type: 'required', message: 'La calle/direccion es requerida' },
        { type: 'minlength', message: 'La cantidad mínima de caracteres es 1.' },
        { type: 'maxlength', message: 'La cantidad máxima de caracteres es 100.' }
    ],
    'numero_dom': [
      { type: 'required', message: 'El número de domicilio es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' }
    ],
    'telefono': [
      { type: 'required', message: 'El télefono es requerido.' },
        { type: 'minlength', message: 'La cantidad mínima de caracteres es 1.' },
        { type: 'maxlength', message: 'La cantidad máxima de caracteres es 100.' }
    ],
    'fecha_nac': [
      { type: 'required', message: 'La fecha de nacimiento es requerida.' },
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
    //this.listSexo = sexo;
    this.listSexo = sexo.map(respuesta => {
      return {
        label: respuesta.sexo.toLowerCase(),
        value: respuesta.sexo,
       }
    });

    this.listDepartamentos = departamentos;
    //this.cargarMunicipios(1);
    
  }


  //LISTADO DE CIUDADANOS
  listarUsuarios(){    
    this.usuariosService.listarUsuariosTodos().
        subscribe(respuesta => {
        this.listUsuarios= respuesta[0];
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE CIUDADANOS....................................................... 

  //MANEJO DE FORMULARIO DIALOG
  openDialogUsuario() {
    this.usuario = {};
    this.submitted = false;
    this.usuarioDialog = true;
    this.nuevoUsuario=true;
  }
  
  hideDialogUsuario() {
      this.usuarioDialog = false;
      this.submitted = false;
      this.nuevoUsuario=false;
  }    
  //FIN MANEJO FORMULARIO DIALOG....................................


  cargarMunicipios(id_departamento: number){
    this.listMunicipios=municipios.filter(municipio => {      
      return municipio.id_municipio == 1 || municipio.departamento_id == id_departamento;
    });    
  }

  onChangeDepartamento(){
    const id = this.formaUsuario.get('departamento_id')?.value;
    if(id != null){               
        this.cargarMunicipios(parseInt(id.toString()));
        this.formaUsuario.get('municipio_id')?.setValue(1);               
        this.formaUsuario.get('municipio_id')?.markAsUntouched();
        
    }
  }
}


