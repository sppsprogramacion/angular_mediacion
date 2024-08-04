import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CiudadanoModel } from 'src/app/models/ciudadano.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { ConfigService } from 'src/app/service/app.config.service';
import { CiudadanosService } from 'src/app/service/ciudadanos.service';
import Swal from 'sweetalert2';
import { DataService } from '../../../service/data.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { DataMokeadaService } from '../../../service/data-mokeada.service';

@Component({
  selector: 'app-ciudadano-datospersonales',
  templateUrl: './ciudadano-datospersonales.component.html',
  styleUrls: ['./ciudadano-datospersonales.component.scss']
})
export class CiudadanoDatospersonalesComponent implements OnInit {

  //MODELOS
  ciudadanoData: CiudadanoModel = {};

  //listas
  listaSexo: SexoModel[] = [];

  //iidiomas
  //es: any = {};

  //FORMULARIOS
  formaCiudadano: FormGroup;  

  constructor(
    private fb: FormBuilder,
    public configService: ConfigService,
    private readonly datePipe: DatePipe,
    private router: Router,

    private authService: AuthService,
    private dataService: DataService,    
    private dataMokeadaService: DataMokeadaService,
    private ciudadanoService: CiudadanosService,
  ) {

    this.formaCiudadano = this.fb.group({
      dni: ['',[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.minLength(5)]],
      apellido: ['',[Validators.required, Validators.pattern(/^[A-Za-zñÑ0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      nombre:   ['',[Validators.required, Validators.pattern(/^[A-Za-zñÑ0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      sexo_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      telefono: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      fecha_nac: [,[Validators.required]],  
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
    'fecha_nac': [
      { type: 'required', message: 'La fecha de nacimiento es requerida.' },
    ],
    'email': [
      { type: 'required', message: 'El e-mail es requerido' },
      { type: 'pattern', message: 'El formato del e-mail no es correcto.' }
    ],
    
  }
  //FIN MENSAJES DE VALIDACIONES...............................................................

  //VALIDACIONES DE FORMULARIO
  isValid(campo: string): boolean{     
    
    return this.formaCiudadano.get(campo)?.invalid && this.formaCiudadano.get(campo)?.touched;      
  }

  ngOnInit(): void {
    
    //cargar datos del ciudadano en el formulario
    this.ciudadanoData = this.authService.currentCiudadanoLogin;

    this.cargarFormularioCiudadano();

    //fin cargar datos del ciudadano en el formulario

    //CARGA DE LISTADOS DESDE DATA MOKEADA
    this.dataMokeadaService.listarSexo().subscribe(sexo => {
      this.listaSexo = sexo;
    });

  }


  //GUARDAR CIUDADANO  
  submitFormCiudadano(){
    
    if(this.formaCiudadano.invalid){       
        
        Swal.fire('Formulario con errores',`Complete correctamente todos los campos del formulario`,"warning");
        return Object.values(this.formaCiudadano.controls).forEach(control => control.markAsTouched());
    }
    
    

    let dataRegistro: Partial<CiudadanoModel>;
    dataRegistro = {

      dni: parseInt(this.formaCiudadano.get('dni')?.value),
      apellido: this.formaCiudadano.get('apellido')?.value,
      nombre: this.formaCiudadano.get('nombre')?.value,
      sexo_id: parseInt(this.formaCiudadano.get('sexo_id')?.value),
      telefono: this.formaCiudadano.get('telefono')?.value,
      fecha_nac: this.dataService.getchangeFormatoFechaGuardar(this.formaCiudadano.get('fecha_nac')?.value),  
      email: this.formaCiudadano.get('email')?.value,    
       
    };
    
    //GUARDAR EDICION CIUDADANO
    this.ciudadanoService.guardarEdicionCiudadano(this.ciudadanoData.id_ciudadano, dataRegistro)
      .subscribe({
        next: (resultado) => {
            location.reload();
            this.buscarCiudadano();
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
  cargarFormularioCiudadano(){
    console.log("fecha nacimiento", this.dataService.getchangeFormatoFechaRetornar(this.ciudadanoData.fecha_nac));
    console.log("fecha nacimiento", this.ciudadanoData.fecha_nac);
    
    this.formaCiudadano.get('dni')?.setValue(this.ciudadanoData.dni);
    this.formaCiudadano.get('apellido')?.setValue(this.ciudadanoData.apellido);
    this.formaCiudadano.get('nombre')?.setValue(this.ciudadanoData.nombre);
    this.formaCiudadano.get('sexo_id')?.setValue(this.ciudadanoData.sexo_id);
    this.formaCiudadano.get('fecha_nac')?.setValue(this.dataService.getchangeFormatoFechaRetornar(this.ciudadanoData.fecha_nac));
    this.formaCiudadano.get('telefono')?.setValue(this.ciudadanoData.telefono);
    this.formaCiudadano.get('email')?.setValue(this.ciudadanoData.email);
  }
  //FIN CARGAR FORMULARIO CIUDADANO......................
  
  //BUSCAR CIUDADANO
  buscarCiudadano(){
    this.ciudadanoData = {};  
    this.ciudadanoService.buscarXDni(parseInt(this.formaCiudadano.get('dni')?.value))
      .subscribe({
        next: (resultado) => {          
          this.ciudadanoData = {};
          this.ciudadanoData = resultado;  
          this.dataService.ciudadanoData = this.ciudadanoData;
          this.cargarFormularioCiudadano();
        }
      });    
  }
  //FIN BUSCAR CIUDADANO

  //IR A PRINCIPAL
  irAPrincipal(){
    this.router.navigateByUrl("ciudadano/tramites/nuevos");
  }
  //FIN IR A PRINCIPAL

}
