import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { sexo } from 'src/app/common/data-mokeada';
import { CiudadanoModel } from 'src/app/models/ciudadano.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { ConfigService } from 'src/app/service/app.config.service';
import { CiudadanosService } from 'src/app/service/ciudadanos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ciudadano-datospersonales',
  templateUrl: './ciudadano-datospersonales.component.html',
  styleUrls: ['./ciudadano-datospersonales.component.scss']
})
export class CiudadanoDatospersonalesComponent implements OnInit {

  //listas
  listaSexo: SexoModel[] = [];

  //iidiomas
  es: any = {};

  //FORMULARIOS
  formaCiudadano: FormGroup;  

  constructor(
    private fb: FormBuilder,
    public configService: ConfigService,
    private readonly datePipe: DatePipe,
    
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
      clave1: ['',[Validators.required,  Validators.minLength(8),Validators.maxLength(16),Validators.pattern(/[^'"`=+\s]+$/)]],
      clave2: ['',[Validators.required,  Validators.minLength(8)]]
    
    });
   }

  ngOnInit(): void {

    //CARGA DE LISTADOS DESDE DATA MOKEADA
    this.listaSexo = sexo;
  }


  //GUARDAR CIUDADANO  
  submitFormCiudadano(){
    
    if(this.formaCiudadano.invalid){                        
        // this.msgs = [];
        // this.msgs.push({ severity: 'warn', summary: 'Errores en formulario', detail: 'Cargue correctamente los datos' });
        // this.serviceMensajes.add({key: 'tst', severity: 'warn', summary: 'Errores en formulario', detail: 'Cargue correctamente los dato'});
        Swal.fire('Formulario con errores',`Complete correctamente todos los campos del formulario`,"warning");
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
      fecha_nac: this.changeFormatoFechaGuardar(this.formaCiudadano.get('fecha_nac')?.value),  
      email: this.formaCiudadano.get('email')?.value,    
      
       
    };
    
    
    //GUARDAR NUEVO CIUDADANO
    this.ciudadanoService.guardarCiudadano(dataRegistro)
      .subscribe({
        next: (resultado) => {
            let ciudadanoRes: CiudadanoModel = resultado;
            Swal.fire('Exito',`El registro se realizo con exito`,"success");   
        },
        error: (error) => {
            Swal.fire('Error',`Error al realizar el regsistro: ${error.error.message}`,"error") 
        }
      });         
    //FIN GUARDAR NUEVO CIUDADANO 

  }    
  //FIN GUARDAR CIUDADANO............................................................


  changeFormatoFechaGuardar(nuevaFecha: Date){
    let fechaAuxiliar:any = null;
    if(nuevaFecha != null){
      fechaAuxiliar = this.datePipe.transform(nuevaFecha,"yyyy-MM-dd")!;
      
    }
    return fechaAuxiliar;
  }

}
