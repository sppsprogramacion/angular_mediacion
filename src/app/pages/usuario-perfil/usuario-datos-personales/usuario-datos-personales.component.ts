
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataMokeada } from 'src/app/common/data-mokeada';
import { CiudadanoModel } from 'src/app/models/ciudadano.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { ConfigService } from 'src/app/service/app.config.service';
import { CiudadanosService } from 'src/app/service/ciudadanos.service';
import Swal from 'sweetalert2';
import { DataService } from '../../../service/data.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { UsuariosService } from 'src/app/service/usuarios.service';

@Component({
  selector: 'app-usuario-datos-personales',
  templateUrl: './usuario-datos-personales.component.html',
  styleUrls: ['./usuario-datos-personales.component.scss']
})
export class UsuarioDatosPersonalesComponent implements OnInit {

  //MODELOS
  usuarioData: UsuarioModel = {};

  //listas
  listaSexo: SexoModel[] = [];

  //iidiomas
  //es: any = {};

  //FORMULARIOS
  formaUsuario: FormGroup;  

  constructor(
    private fb: FormBuilder,
    public configService: ConfigService,
    private readonly datePipe: DatePipe,
    private router: Router,

    private authService: AuthService,
    private dataService: DataService,    
    private usuarioService: UsuariosService,
  ) {

    this.formaUsuario = this.fb.group({
      dni: ['',[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.minLength(5)]],
      apellido: ['',[Validators.required, Validators.pattern(/^[A-Za-zñÑ0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      nombre:   ['',[Validators.required, Validators.pattern(/^[A-Za-zñÑ0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      sexo_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      telefono: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      email: ['',[Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],    
      
    });
  }
  //FIN CONSTRUCTOR....................................................

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
    
    //cargar datos del ciudadano en el formulario
    this.usuarioData = this.authService.currentUserLogin;

    this.cargarFormularioUsuario();

    //fin cargar datos del ciudadano en el formulario

    //CARGA DE LISTADOS DESDE DATA MOKEADA
    this.listaSexo = DataMokeada.sexos;
  }


  //GUARDAR CIUDADANO  
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
    
    //GUARDAR EDICION CIUDADANO
    this.usuarioService.guardarEdicionPerfil(this.usuarioData.id_usuario, dataRegistro)
      .subscribe({
        next: (resultado) => {
            location.reload();
            this.buscarUsuario();
            Swal.fire('Exito',`Se modificó los datos con exito`,"success");   
        },
        error: (error) => {
            Swal.fire('Error',`Error al realizar la modificación: ${error.error.message}`,"error") 
        }
      });         
    //FIN GUARDAR EDICION CIUDADANO 

  }    
  //FIN GUARDAR CIUDADANO............................................................

  //CARGAR FORMULARIO CIUDADANO
  cargarFormularioUsuario(){
    this.formaUsuario.get('dni')?.setValue(this.usuarioData.dni);
    this.formaUsuario.get('apellido')?.setValue(this.usuarioData.apellido);
    this.formaUsuario.get('nombre')?.setValue(this.usuarioData.nombre);
    this.formaUsuario.get('sexo_id')?.setValue(this.usuarioData.sexo_id);
    this.formaUsuario.get('telefono')?.setValue(this.usuarioData.telefono);
    this.formaUsuario.get('email')?.setValue(this.usuarioData.email);
  }
  //FIN CARGAR FORMULARIO CIUDADANO......................
  
  //BUSCAR CIUDADANO
  buscarUsuario(){
    this.usuarioData = {};  
    this.usuarioService.buscarXDni(parseInt(this.formaUsuario.get('dni')?.value))
      .subscribe({
        next: (resultado) => {          
          this.usuarioData = {};
          this.usuarioData = resultado;  
          this.dataService.usuarioData = this.usuarioData;
          this.cargarFormularioUsuario();
        }
      });    
  }
  //FIN BUSCAR CIUDADANO

  //IR A PRINCIPAL
  irAPrincipal(){
    this.router.navigateByUrl("admin/tramites/nuevoslis");
  }
  //FIN IR A PRINCIPAL

}
