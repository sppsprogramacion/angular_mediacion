import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { globalConstants } from 'src/app/common/global-constants';
import { LoginModel } from 'src/app/models/login.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/service/auth.service';

import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-usuario',
  templateUrl: './login-usuario.component.html',
  styleUrls: ['./login-usuario.component.scss']
})
export class LoginUsuarioComponent implements OnInit {

  //MODELOS
  dataUsuario: UsuarioModel= new UsuarioModel;
  
  //FORMULARIOS
  formaLogin: FormGroup; 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dataService: DataService,
    private authService: AuthService

  ) { 
    this.formaLogin = this.fb.group({
      dni: ['',[Validators.required, Validators.pattern(/^[0-9]*$/)]],
      password: ['',[Validators.required]],
          
    });
  }
  //FIN CONSTRUCTOR...................

  //MENSAJES DE VALIDACIONES
  user_validation_messages = {
    //datos tramite
    'dni': [
      { type: 'required', message: 'El dni es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' }
    ],
    'password': [
      { type: 'required', message: 'La contraseña es requerida' },
     
    ],
  }
  //MENSAJES DE VALIDACIONES

  //VALIDACIONES DE FORMULARIO
  isValid(campo: string): boolean{     
    
    return this.formaLogin.get(campo)?.invalid && this.formaLogin.get(campo)?.touched;      
  }
  //FIN VALIDACIONES DE FORMULARIO......................................................

  ngOnInit(): void {
    
  }
  //FIN ONINIT........................

  //GUARDAR CIUDADANO  
  submitFormLogin(){
    
    if(this.formaLogin.invalid){                        
        
        console.log("errores formulario");
        return Object.values(this.formaLogin.controls).forEach(control => control.markAsTouched());
    }    

    let dataLogin: Partial<LoginModel>;
    dataLogin = {
      dni: parseInt(this.formaLogin.get('dni')?.value),       
      clave: this.formaLogin.get('password')?.value,
       
    };
    
    
    //INICIO LOGIN
    this.authService.loginUsuario(dataLogin)
      .subscribe({
        next: (resultado) => {
          
          this.dataUsuario = resultado;            
          if(this.dataUsuario.rol_id == "administrador"){
            this.router.navigateByUrl("admin/principal");
          }
          if(this.dataUsuario.rol_id == "admincuentas"){
            this.router.navigateByUrl("usuarios/lista");
          }
          if(this.dataUsuario.rol_id == "mediador"){
            this.router.navigateByUrl("admin/tramites/nuevoslis");
          }
          
          Swal.fire('Exito',`El login se realizo con exito`,"success");
          
        }, 
        error: (err) => {
          console.log("error", err);
          Swal.fire('Error',`Error al realizar el login: ${err.error.message}`,"error") ;
        }           
      
      });         
    //FIN LOGIN....................................... 

  }    
  //FIN GUARDAR CIUDADANO............................................................


}
