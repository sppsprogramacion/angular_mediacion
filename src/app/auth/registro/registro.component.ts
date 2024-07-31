import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/api/appconfig';
import Swal from 'sweetalert2';
import { ConfigService } from 'src/app/service/app.config.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { CiudadanosService } from '../../service/ciudadanos.service';
import { CiudadanoModel } from '../../models/ciudadano.model';
import { DepartamentoModel } from '../../models/departamento.model';
import { DataMokeada, departamentos } from 'src/app/common/data-mokeada';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { municipios } from '../../common/data-mokeada';
import { SexoModel } from 'src/app/models/sexo.model';
import { DataMokeadaService } from '../../service/data-mokeada.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  providers: [MessageService, ConfirmationService,DatePipe],
  styleUrls: ['./registro.component.scss']
 

})

export class RegistroComponent implements OnInit {

  //config: AppConfig;  
  subscription: Subscription;
  selectedState:any;
  

  msgs: Message[] = []; 
  
  //iidiomas
  es: any = {};

  //listas
  listaSexo: SexoModel[] = [];
  listaMunicipios: MunicipioModel[] = [];
  listaDepartamentos: DepartamentoModel[] = [];  

  //variables registro  
  formRegistroDialog: boolean= false;
  validacionClaves: boolean = true;

  //FORMULARIOS
  formaRegistro: FormGroup;  


  constructor(    
    private fb: FormBuilder,
    public configService: ConfigService,
    private readonly datePipe: DatePipe,
    private router: Router,
    private ciudadanoService: CiudadanosService,
    private dataMokeadaService: DataMokeadaService
    
  ){ 
    this.formaRegistro = this.fb.group({
      dni: ['',[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.minLength(5)]],
      apellido: ['',[Validators.required, Validators.pattern(/^[A-Za-zñÑ0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      nombre:   ['',[Validators.required, Validators.pattern(/^[A-Za-zñÑ0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      sexo_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      telefono: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      fecha_nac: [,[Validators.required]],  
      email: ['',[Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],    
      clave1: ['',[Validators.required,  Validators.minLength(8),Validators.maxLength(16),Validators.pattern(/[^'"`=+\s]+$/)]],
      clave2: ['',[Validators.required,  Validators.minLength(8)]]
    
    });
    
  }
  //FIN CONSTRUCTOR..............................................................

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
    'clave1': [
      { type: 'required', message: 'La contraseña es requerida' },
      { type: 'minlength', message: 'La contraseña debe tener al menos 8 caracteres.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 16.' },
      //{ type: 'pattern', message: 'Debe ingresar al menos un número, al menos'"`=+ una letra minuscula, almenos una letra mayuscula.\n Puede tener guiones bajo (_).\n No debe tener otros caracteres especiales.' },
      { type: 'pattern', message: 'Estos caracteres no están permitidos: comillas simples (\'), comillas dobles ("), comillas invertidas (`), signos de igualdad (=), signos de más (+) y los espacios.' },
    
    ],
    'clave2': [
      { type: 'required', message: 'La contraseña es requerida' },
      { type: 'minlength', message: 'La contraseña debe tener al menos 8 caracteres.' },        
    ],
    
  }
  //FIN MENSAJES DE VALIDACIONES...............................................................

  //VALIDACIONES DE FORMULARIO
  isValid(campo: string): boolean{     
    
    return this.formaRegistro.get(campo)?.invalid && this.formaRegistro.get(campo)?.touched;      
  }

  clavesValidationIguales(): boolean{
    return ((this.formaRegistro.get('clave1').value === this.formaRegistro.get('clave2').value))?  true: false;
        
  }
  //FIN VALIDACIONES DE FORMULARIO......................................................

  ngOnInit(): void {
    // this.config = this.configService.config;
    // this.subscription = this.configService.configUpdate$.subscribe(config => {
    //   this.config = config;
    // });

    
    //CARGA DE LISTADOS DESDE DATA MOKEADA
    //this.listaSexo = DataMokeada.sexos;
    this.dataMokeadaService.listarSexo()

    console.log("hola",this.dataMokeadaService.listarSexo())
    this.listaSexo = DataMokeada.sexos;
    this.listaDepartamentos = departamentos;
    this.cargarMunicipios(1);    
    
  }
  //FIN ONINIT...................................................


  //GUARDAR CIUDADANO  
  submitFormRegistro(){
    
    if(this.formaRegistro.invalid){                        
        
      let fechaAuxiliar = this.datePipe.transform(this.formaRegistro.get('fecha_nac')?.value,"yyyy-MM-dd")!;
      
      Swal.fire('Formulario con errores',`Complete correctamente todos los campos del formulario`,"warning");
      return Object.values(this.formaRegistro.controls).forEach(control => control.markAsTouched());
    }
    this.validacionClaves = this.clavesValidationIguales();
    if(!this.validacionClaves){
      return Object.values(this.formaRegistro.controls).forEach(control => control.markAsTouched());
    }

    let dataRegistro: Partial<CiudadanoModel>;
    dataRegistro = {

      dni: parseInt(this.formaRegistro.get('dni')?.value),
      apellido: this.formaRegistro.get('apellido')?.value,
      nombre: this.formaRegistro.get('nombre')?.value,
      sexo_id: parseInt(this.formaRegistro.get('sexo_id')?.value),
      telefono: this.formaRegistro.get('telefono')?.value,
      fecha_nac: this.changeFormatoFechaGuardar(this.formaRegistro.get('fecha_nac')?.value),  
      email: this.formaRegistro.get('email')?.value,    
      clave: this.formaRegistro.get('clave1')?.value,
       
    };
    
    
    //GUARDAR NUEVO CIUDADANO
    this.ciudadanoService.guardarCiudadano(dataRegistro)
      .subscribe({
        next: (resultado) => {
            let ciudadanoRes: CiudadanoModel = resultado;
            Swal.fire('Exito',`El registro se realizo con exito`,"success");           
            this.router.navigateByUrl("login");
        },
        error: (error) => {
            Swal.fire('Error',`Error al realizar el regsistro: ${error.error.message}`,"error") 
        }
      });         
    //FIN GUARDAR NUEVO CIUDADANO 

  }    
  //FIN GUARDAR CIUDADANO............................................................
  

  mostrarRegistroDialog(){
    this.formRegistroDialog= true;
  }

  hideDialogTramite(){
    this.formRegistroDialog= false;
  }

  cargarMunicipios(id_departamento: number){
    this.listaMunicipios=municipios.filter(municipio => {      
      return municipio.id_municipio == 1 || municipio.departamento_id == id_departamento;
    });    
  }

  onChangeDepartamento(){
    const id = this.formaRegistro.get('departamento_id')?.value;
    if(id != null){               
        this.cargarMunicipios(parseInt(id.toString()));
        this.formaRegistro.get('municipio_id')?.setValue(1);               
        this.formaRegistro.get('municipio_id')?.markAsUntouched();
        
    }
  }

  changeFormatoFechaGuardar(nuevaFecha: Date){
    let fechaAuxiliar:any = null;
    if(nuevaFecha != null){
      fechaAuxiliar = this.datePipe.transform(nuevaFecha,"yyyy-MM-dd")!;
      
    }
    return fechaAuxiliar;
  }

  //IR A REGISTRARME
  irALogin(){
    this.router.navigateByUrl("login");
  }
  //FIN IR A REGISTRARME

}
