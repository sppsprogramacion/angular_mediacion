import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CiudadanoModel } from 'src/app/models/ciudadano.model';
import { ConfigService } from 'src/app/service/app.config.service';
import { CiudadanosService } from 'src/app/service/ciudadanos.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-ciudadano-cambiar-password',
  templateUrl: './ciudadano-cambiar-password.component.html',
  styleUrls: ['./ciudadano-cambiar-password.component.scss']
})
export class CiudadanoCambiarPasswordComponent implements OnInit {

  //MODELOS
  ciudadanoData: CiudadanoModel = {};

  //FORMULARIOS
  formaContrasenia: FormGroup;  

  //VARIABLES
  validacionClaves: boolean = true;

  constructor(
    private fb: FormBuilder,
    public configService: ConfigService,
    private router: Router,

    private authService: AuthService,
    private ciudadanoService: CiudadanosService,
  ) {

    this.formaContrasenia = this.fb.group({
      clave1: ['',[Validators.required,  Validators.minLength(8),Validators.maxLength(16),Validators.pattern(/[^'"`=+\s]+$/)]],
      clave2: ['',[Validators.required]]
      
    });
  }
  //FIN CONSTRUCTOR....................................................

  //MENSAJES DE VALIDACIONES
  user_validation_messages = {
    //datos tramite
    'clave1': [
      { type: 'required', message: 'La contraseña es requerida' },
      { type: 'minlength', message: 'La contraseña debe tener al menos 8 caracteres.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 16.' },
      //{ type: 'pattern', message: 'Debe ingresar al menos un número, al menos'"`=+ una letra minuscula, almenos una letra mayuscula.\n Puede tener guiones bajo (_).\n No debe tener otros caracteres especiales.' },
      { type: 'pattern', message: 'Estos caracteres no están permitidos: comillas simples (\'), comillas dobles ("), comillas invertidas (`), signos de igualdad (=), signos de más (+) y los espacios.' },
    
    ],
    'clave2': [
      { type: 'required', message: 'La contraseña es requerida' }
    ]
  }
  //FIN MENSAJES DE VALIDACIONES...............................................................

  //VALIDACIONES DE FORMULARIO
  isValid(campo: string): boolean{     
    
    return this.formaContrasenia.get(campo)?.invalid && this.formaContrasenia.get(campo)?.touched;      
  }

  clavesValidationIguales(): boolean{
    return ((this.formaContrasenia.get('clave1').value === this.formaContrasenia.get('clave2').value))?  true: false;
        
  }
  //FIN VALIDACIONES FORMULARIO..............................................

  ngOnInit(): void {
    
    //cargar datos del ciudadano
    this.ciudadanoData = this.authService.currentCiudadanoLogin;

    //fin cargar datos del ciudadano
  }


  //GUARDAR CIUDADANO  
  submitFormCiudadano(){
    
    if(this.formaContrasenia.invalid){       
        
        Swal.fire('Formulario con errores',`Complete correctamente todos los campos del formulario`,"warning");
        return Object.values(this.formaContrasenia.controls).forEach(control => control.markAsTouched());
    }

    this.validacionClaves = this.clavesValidationIguales();
    if(!this.validacionClaves){
      return Object.values(this.formaContrasenia.controls).forEach(control => control.markAsTouched());
    }

    let dataRegistro: any;
    dataRegistro = {
     
      clave: this.formaContrasenia.get('clave1')?.value       
    };
    
    //GUARDAR EDICION CIUDADANO CONTRASEÑA
    this.ciudadanoService.guardarCambiarContrasenia(this.ciudadanoData.id_ciudadano, dataRegistro)
      .subscribe({
        next: (resultado) => {
          Swal.fire('Exito',`La contraseña se modificó con exito`,"success"); 
          location.reload();           
              
        },
        error: (error) => {
            Swal.fire('Error',`Error al realizar la modificación de la contraseña: ${error.error.message}`,"error") 
        }
      });         
    //FIN GUARDAR EDICION CIUDADANO CONTRASEÑA

  }    
  //FIN GUARDAR CIUDADANO............................................................

  //IR A REGISTRARME
  irAPrincipal(){
    this.router.navigateByUrl("ciudadano/tramites/nuevos");
  }
  //FIN IR A REGISTRARME
}
