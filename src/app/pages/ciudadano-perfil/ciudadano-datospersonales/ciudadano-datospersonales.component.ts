import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { sexo } from 'src/app/common/data-mokeada';
import { globalConstants } from 'src/app/common/global-constants';
import { CiudadanoModel } from 'src/app/models/ciudadano.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { ConfigService } from 'src/app/service/app.config.service';
import { CiudadanosService } from 'src/app/service/ciudadanos.service';
import Swal from 'sweetalert2';
import { DataService } from '../../../service/data.service';
import { Router } from '@angular/router';

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

    private dataService: DataService,    
    private ciudadanoService: CiudadanosService,
  ) {

    this.formaCiudadano = this.fb.group({
      dni: ['',[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.minLength(5)]],
      apellido: ['',[Validators.required, Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      nombre:   ['',[Validators.required, Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      sexo_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      telefono: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      fecha_nac: [,[Validators.required]],  
      email: ['',[Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],    
      
    
    });
   }

  ngOnInit(): void {
    
    //cargar datos del ciudadano en el formulario
    this.ciudadanoData = globalConstants.ciudadanoLogin;

    console.log("fecha nacimiento",this.ciudadanoData.fecha_nac);

    this.cargarFormularioCiudadano();

    //fin cargar datos del ciudadano en el formulario

    //CARGA DE LISTADOS DESDE DATA MOKEADA
    this.listaSexo = sexo;
  }


  //GUARDAR CIUDADANO  
  submitFormCiudadano(){
    
    if(this.formaCiudadano.invalid){       
        console.log("formulario registro", this.formaCiudadano);
        //let fechaAuxiliar = this.formaCiudadano.transform(this.formaCiudadano.get('fecha_nac')?.value,"yyyy-MM-dd")!;
        
        console.log("errores formulario");
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
    
    console.log("fecha nacimiento enviada",dataRegistro.fecha_nac); 
    //GUARDAR EDICION CIUDADANO
    this.ciudadanoService.guardarEdicionCiudadano(this.ciudadanoData.id_ciudadano, dataRegistro)
      .subscribe({
        next: (resultado) => {
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
          globalConstants.ciudadanoLogin = this.ciudadanoData;
          this.cargarFormularioCiudadano();
        }
      });    
  }
  //FIN BUSCAR CIUDADANO

  //IR A REGISTRARME
  irAPrincipal(){
    this.router.navigateByUrl("ciudadano/tramites/nuevos");
  }
  //FIN IR A REGISTRARME

}
