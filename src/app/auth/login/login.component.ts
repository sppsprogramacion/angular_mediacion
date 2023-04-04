import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../service/auth.service';
import { LoginModel } from '../../models/login.model';
import { UsuarioModel } from '../../models/usuario.model';
import { CiudadanoModel } from 'src/app/models/ciudadano.model';
import { DataService } from 'src/app/service/data.service';
import { globalConstants } from 'src/app/common/global-constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles:[`
    /* :host ::ng-deep .p-password input {
    width: 100%;
    padding:1rem;
    }

    :host ::ng-deep .pi-eye{
      transform:scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
    }

    :host ::ng-deep .pi-eye-slash{
      transform:scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
    } */
  `]
})
export class LoginComponent implements OnInit {

  //MODELOS
  dataCiudadano: CiudadanoModel= new CiudadanoModel;
  
  //FORMULARIOS
  formaLogin: FormGroup; 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dataService: DataService,
    private authService: AuthService

  ) { 
    this.formaLogin = this.fb.group({
      dni: ['',[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.minLength(5)]],
      password: ['',[Validators.required,  Validators.minLength(8),Validators.maxLength(16),Validators.pattern(/[^$%&|<>=# ]$/)]],
      
    
    });
  }
  //FIN CONSTRUCTOR...................

  ngOnInit(): void {
  }
  //FIN ONINIT........................

  //GUARDAR CIUDADANO  
  submitFormLogin(){
    
    if(this.formaLogin.invalid){                        
        // this.msgs = [];
        // this.msgs.push({ severity: 'warn', summary: 'Errores en formulario', detail: 'Cargue correctamente los datos' });
        // this.serviceMensajes.add({key: 'tst', severity: 'warn', summary: 'Errores en formulario', detail: 'Cargue correctamente los dato'});
        Swal.fire('Formulario con errores',`Complete correctamente todos los campos del formulario`,"warning");
        
        console.log("errores formulario");
        return Object.values(this.formaLogin.controls).forEach(control => control.markAsTouched());
    }    

    let dataLogin: Partial<LoginModel>;
    dataLogin = {
      dni: parseInt(this.formaLogin.get('dni')?.value),       
      clave: this.formaLogin.get('password')?.value,
       
    };
    
    
    //GUARDAR NUEVO CIUDADANO
    this.authService.loginCiudadano(dataLogin)
      .subscribe({
        next: (resultado) => {
          let loginRes: UsuarioModel = resultado;
          console.log("ciudadano", loginRes);
          this.dataCiudadano = resultado;  
          
          this.dataService.ciudadanoData = this.dataCiudadano;
          globalConstants.ciudadanoLogin = this.dataCiudadano;          
          globalConstants.usuarioLogin = null;
          globalConstants.isAdministrador = false;
          Swal.fire('Exito',`El login se realizo con exito`,"success");
          this.router.navigateByUrl("home/principal");
        }, 
        error: (err) => {
          Swal.fire('Error',`Error al realizar el login: ${err.error.message}`,"error") ;
        }           
      
      });         
    //FIN GUARDAR NUEVO CIUDADANO 

  }    
  //FIN GUARDAR CIUDADANO............................................................

}
