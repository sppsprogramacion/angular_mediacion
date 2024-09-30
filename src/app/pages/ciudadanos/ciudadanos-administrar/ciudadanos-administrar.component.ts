import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { globalConstants } from 'src/app/common/global-constants';
import { DataService } from 'src/app/service/data.service';
import { UsuariosTramiteService } from 'src/app/service/usuarios-tramite.service';
import { CiudadanoModel } from '../../../models/ciudadano.model';
import { TramiteModel } from '../../../models/tramite.model';
import { UsuarioTramiteModel } from '../../../models/usuario_tramite.model';
import { TramitesService } from '../../../service/tramites.service';
import { AuthService } from 'src/app/service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { CiudadanosService } from '../../../service/ciudadanos.service';

@Component({
  selector: 'app-ciudadanos-administrar',
  templateUrl: './ciudadanos-administrar.component.html',
  styleUrls: ['./ciudadanos-administrar.component.scss']
})
export class CiudadanosAdministrarComponent implements OnInit {
  loading:boolean = true;

  //MODELOS
  dataCiudadano: CiudadanoModel = new CiudadanoModel;

  //FORMULARIOS
  formaCiudadano: FormGroup;  
  formaResetPassword: FormGroup;

  //LISTAS    
  listTramites: TramiteModel[]=[];
  listTramitesNuevos: TramiteModel[]=[];
  listTramitesAsignados: UsuarioTramiteModel[]=[];

  constructor(
    private authService: AuthService,
    private readonly datePipe: DatePipe,
    private fb: FormBuilder,
    private router: Router,

    public dataService: DataService,
    private ciudadanosService: CiudadanosService,
    private tramiteService: TramitesService,
  ) { 
    

    this.formaCiudadano = this.fb.group({
      dni: ['',],
      apellido: ['',],
      nombre:   ['',],
      sexo: ['',],
      telefono: [,],
      fecha_nac: [,],  
      email: ['',],    
      
    });

    this.formaResetPassword = this.fb.group({
      confirmacion: ['',[Validators.required]],         
    });
  }

  //MENSAJES DE VALIDACIONES
  user_validation_messages = {
    //datos tramite
    'confirmacion': [
      { type: 'required', message: 'Debe escribir la palabra.' },
    ],
    
  }
  //FIN MENSAJES DE VALIDACIONES...............................................................


  isValidReset(campo: string): boolean{     
    
    return this.formaResetPassword.get(campo)?.invalid && this.formaResetPassword.get(campo)?.touched;      
  }

  ngOnInit(): void {
    //recuperar ciudadano seleccioando
    this.dataCiudadano = this.dataService.ciudadanoData;
    
    if(this.dataCiudadano.dni){

      this.cargarFormularioCiudadano();      
      this.listarTramites();
    }
    else{
      this.router.navigateByUrl("admin/ciudadanos/buscar");
    }
  }

  //GUARDAR RESET PASS CIUDADANO  
  submitFormResetPass(){
    
    if(this.formaResetPassword.invalid){       
        
        Swal.fire('Formulario reset con errores',`Complete correctamente todos los campos del formulario`,"warning");
        return Object.values(this.formaResetPassword.controls).forEach(control => control.markAsTouched());
    }

    if(this.formaResetPassword.get('confirmacion')?.value != "RESET"){             
      Swal.fire('Formulario reset con errores',`Debe tipear la palabra RESET para continuar`,"warning");
      return Object.values(this.formaResetPassword.controls).forEach(control => control.markAsTouched());
    }

    let dataRegistro: Partial<CiudadanoModel>;
    dataRegistro = {
      clave: this.dataCiudadano.dni.toString(),     
    };
        
    //GUARDAR EDICION CIUDADANO
    this.ciudadanosService.guardarCambiarContrasenia(this.dataCiudadano.id_ciudadano, dataRegistro)
      .subscribe({
        next: (resultado) => {
            Swal.fire('Exito',`Se modificó los datos con exito`,"success");   
        },
        error: (error) => {
            Swal.fire('Error',`Error al realizar la modificación: ${error.error.message}`,"error") 
        }
      });         
    //FIN GUARDAR EDICION CIUDADANO 

  }    
  //FIN GUARDAR RESET PASS CIUDADANO............................................................

  //LISTADO DE TRAMITES ASIGNADOS
  listarTramites(){    
    this.tramiteService.listarTramitesXCiudadano(this.dataCiudadano.id_ciudadano)
        .subscribe({
          next: (respuesta) => {
            this.listTramites= respuesta[0];
            this.loading = false;  
          }
    });
  }
  //FIN LISTADO DE TRAMITES ASIGNADOS.......................................................

  //VERIFICAR ADMINISTRADOR
  isAdmin(): boolean{
    if(this.authService.currentUserLogin.rol_id === "administrador"){
      return true;
    }

    return false;
  }
  //FIN VERIFICAR ADMINISTRADOR

  //CARGAR FORMULARIO CIUDADANO
  cargarFormularioCiudadano(){
    this.formaCiudadano.get('dni')?.setValue(this.dataCiudadano.dni);
    this.formaCiudadano.get('apellido')?.setValue(this.dataCiudadano.apellido);
    this.formaCiudadano.get('nombre')?.setValue(this.dataCiudadano.nombre);
    this.formaCiudadano.get('sexo')?.setValue(this.dataCiudadano.sexo.sexo);
    this.formaCiudadano.get('fecha_nac')?.setValue(this.datePipe.transform(this.dataCiudadano.fecha_nac, 'dd/MM/yyyy'));
    this.formaCiudadano.get('telefono')?.setValue(this.dataCiudadano.telefono);
    this.formaCiudadano.get('email')?.setValue(this.dataCiudadano.email);
  }
  //FIN CARGAR FORMULARIO CIUDADANO......................

  //ABRIR NUEVO TRAMITE
  abrirNuevoTramite(){
    this.router.navigateByUrl("admin/ciudadanos/tramites/nuevo");
  }
  //FIN ABRIR NUEVO TRAMITE

  //ACCEDER A DATA SERVICE
  administrarTramite(data: TramiteModel){
    this.dataService.tramiteData = data;

    if (this.authService.currentCiudadanoLogin) {
      this.router.navigateByUrl("ciudadano/tramites/administrar");
    }
    if(this.authService.currentUserLogin){
      if(this.authService.currentUserLogin.rol_id === "administrador"){
        this.router.navigateByUrl("admin/tramites/administrar");
      }
      
    }
    
  }
  //FIN ACCEDER A DATA SERVICE



}
