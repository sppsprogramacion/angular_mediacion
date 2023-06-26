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
    
    
    //INICIO LOGIN
    this.authService.loginUsuario(dataLogin)
      .subscribe({
        next: (resultado) => {
          let loginRes: UsuarioModel = resultado;
          
          this.dataUsuario = resultado;  
          console.log("USUARIO", this.dataUsuario);
          this.dataService.usuarioData = this.dataUsuario;
          globalConstants.usuarioLogin = this.dataUsuario;          
          globalConstants.ciudadanoLogin = null;
          if(this.dataUsuario.rol_id == 1){
            globalConstants.isAdministrador = true;
            this.router.navigateByUrl("admin/principal");
          }
          if(this.dataUsuario.rol_id == 2){
            globalConstants.isAdministrador = false;
            this.router.navigateByUrl("admin/tramites/nuevoslis");
          }
          
          Swal.fire('Exito',`El login se realizo con exito`,"success");
          
        }, 
        error: (err) => {
          Swal.fire('Error',`Error al realizar el login: ${err.error.message}`,"error") ;
        }           
      
      });         
    //FIN LOGIN....................................... 

  }    
  //FIN GUARDAR CIUDADANO............................................................


}
