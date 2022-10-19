import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/api/appconfig';
import { CiudadanosService } from '../../service/ciudadanos.service';
import { CiudadanoModel } from '../../models/ciudadano.model';
import Swal from 'sweetalert2';
import { ConfigService } from 'src/app/service/app.config.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./registro.component.scss']
 

})

export class RegistroComponent implements OnInit {

  config: AppConfig;  
  subscription: Subscription;
  selectedState:any;

  msgs: Message[] = []; 

  //FORMULARIOS
  formaRegistro: FormGroup;  


  constructor(    
    private fb: FormBuilder,
    public configService: ConfigService,
    private serviceMensajes: MessageService,
    private ciudadanoService: CiudadanosService
    ){ 
      this.formaRegistro = this.fb.group({
        dni: ['',[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.minLength(5)]],
        apellido: ['',[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
        nombre:   ['',[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
        sexo_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
        departamento_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
        municipio_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
        localidad_barrio: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
        calle: [,[Validators.required, Validators.maxLength(100)]],
        departamento_dom: [,[Validators.required, Validators.maxLength(50)]],
        piso: [,[Validators.required, Validators.maxLength(10)]],
        numero_dom: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
        telefono: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
        fecha_nac: [,[Validators.required, Validators.maxLength(100)]],  
        email: ['',[Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],    
        clave1: ['',[Validators.required,  Validators.minLength(6)]],
        clave2: ['',[Validators.required,  Validators.minLength(6)]]
      
      });
    }

  ngOnInit(): void {
    this.config = this.configService.config;
    this.subscription = this.configService.configUpdate$.subscribe(config => {
      this.config = config;
    });
  }

  // ngOnDestroy(): void {
  //   if(this.subscription){
  //     this.subscription.unsubscribe();
  //   }
  // }

 

  //GUARDAR CIUDADANO  
  submitFormRegistro(){
    if(this.formaRegistro.invalid){                        
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: 'Errores en formulario', detail: 'Cargue correctamente los datos' });
        this.serviceMensajes.add({key: 'tst', severity: 'warn', summary: 'Errores en formulario', detail: 'Cargue correctamente los dato'});
        // Swal.fire(
            
        //     {target: document.getElementById('form-modal')},
        //     'Formulario Tramite con errores','Complete correctamente todos los campos del formulario',"warning"
        //     );
        return Object.values(this.formaRegistro.controls).forEach(control => control.markAsTouched());
    }

    let dataRegistro: Partial<CiudadanoModel>;
    dataRegistro = {

      dni: parseInt(this.formaRegistro.get('dni')?.value),
      apellido: this.formaRegistro.get('apellido')?.value,
      nombre:   this.formaRegistro.get('nombre')?.value,
      sexo_id: parseInt(this.formaRegistro.get('dni')?.value),
      departamento_id: parseInt(this.formaRegistro.get('dni')?.value),
      municipio_id: parseInt(this.formaRegistro.get('dni')?.value),
      localidad_barrio: this.formaRegistro.get('apellido')?.value,
      calle: this.formaRegistro.get('apellido')?.value,
      departamento_dom: this.formaRegistro.get('apellido')?.value,
      piso: this.formaRegistro.get('piso')?.value,
      numero_dom: parseInt(this.formaRegistro.get('numero_dom')?.value),
      telefono: this.formaRegistro.get('telefono')?.value,
      fecha_nac: new Date('2005-12-02'),  
      email: this.formaRegistro.get('email')?.value,    
      clave: this.formaRegistro.get('clave1')?.value,
       
    };
    
    //GUARDAR NUEVO CIUDADANO
    this.ciudadanoService.guardarCiudadano(dataRegistro)
        .subscribe(resultado => {
            let tramiteRes: CiudadanoModel = resultado;
            Swal.fire('Exito',`El registro se realizo con exito`,"success");
            
           
        },
        (error) => {
            Swal.fire('Error',`Error al realizar el regsistro: ${error.error.message}`,"error") 
        }
    );         
    //FIN GUARDAR NUEVO CIUDADANO 

  }    
  //FIN GUARDAR CIUDADANO............................................................

  isValid(campo: string): boolean{
    // if (this.formaRegistro.get(campo).invalid && this.form_submitted) {
    if (this.formaRegistro.get(campo).invalid ) {
      return true;
    }else{
      return false;
    }
  }

  clavesValidation(): boolean{
    return ((this.formaRegistro.get('clave1').value === this.formaRegistro.get('clave2').value))?  false: true;
        
  }

}
