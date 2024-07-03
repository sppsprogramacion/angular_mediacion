import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { DataMokeada, tiposBusquedaCiudadano } from 'src/app/common/data-mokeada';
import { CiudadanoModel } from 'src/app/models/ciudadano.model';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { ConfigService } from 'src/app/service/app.config.service';
import { AuthService } from 'src/app/service/auth.service';
import { CiudadanosService } from 'src/app/service/ciudadanos.service';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ciudadanos-buscar',
  templateUrl: './ciudadanos-buscar.component.html',
  styleUrls: ['./ciudadanos-buscar.component.scss']
})
export class CiudadanosBuscarComponent implements OnInit {

  //PARA FILTRAR EN TABLA
  @ViewChild('dt') table: Table;
  @ViewChild('filter') filter: ElementRef;

  //MODELOS
  ciudadanoData: CiudadanoModel = {};

  //iidiomas
  //es: any = {};

  //FORMULARIOS
  formaBuscar: FormGroup;  

  //VARIABLES TRAMITE    
  ciudadano: CiudadanoModel;
  ciudadanoDialog: boolean;
  nuevoCiudadano: boolean;
  submitted: boolean;
  loading:boolean = true;

  //LISTAS    
  listCiudadanos: CiudadanoModel[]=[];
  listDepartamentos: DepartamentoModel[]=[];
  listMunicipios: MunicipioModel[]= [];
  listSexo: SexoModel[]=[];
  listTiposBusqueda: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,

    public configService: ConfigService,
    private ciudadanosService: CiudadanosService,
    private authService: AuthService,
    private dataService: DataService, 

  ) { 
    this.formaBuscar = this.fb.group({
      id_tipo_busqueda: [,[Validators.required]],
      buscar: ['',[Validators.required]],

    });
  }
  //fin constructor

  //MENSAJES DE VALIDACIONES
  user_validation_messages = {
    //datos tramite
    'id_tipo_busqueda': [
      { type: 'required', message: 'El tipo de busqueda es requerido' },
    ],
    'buscar': [
      { type: 'required', message: 'El dato a buscar es requerido ' },
    ],
  }
  //FIN MENSAJES DE VALIDACIONES...............................................................

  //VALIDACIONES DE FORMULARIO
  isValid(campo: string): boolean{     
    
    return this.formaBuscar.get(campo)?.invalid && this.formaBuscar.get(campo)?.touched;      
  }

  ngOnInit(): void {

    this.loading = false;
    this.listTiposBusqueda = tiposBusquedaCiudadano;
    
  }

  //BUSCAR CIUDADANOS
  buscarCiudadanos(){
    this.loading = true;

    if(this.formaBuscar.invalid){    

      this.loading = false;
      //Swal.fire('Formulario con errores',`Complete correctamente todos los campos del formulario`,"warning");
      return Object.values(this.formaBuscar.controls).forEach(control => control.markAsTouched());
    }

    if(this.formaBuscar.get('id_tipo_busqueda')?.value === "dni"){

      const dato = this.formaBuscar.get('buscar')?.value;
      if(Number.isInteger(Number(dato))){

        this.listarCiudadanosDni();
      }
      else{
        this.loading = false;
        Swal.fire('Formulario con errores',`El DNI debe ser un número`,"warning");
      }
    }

    if(this.formaBuscar.get('id_tipo_busqueda')?.value === "apellido"){
      this.listarCiudadanosApellido();
    }

    
  }


  //LISTADO DE CIUDADANOS DNI
  listarCiudadanosDni(){    
    this.ciudadanosService.listarCiudadanosXDni(parseInt(this.formaBuscar.get('buscar')?.value)).
        subscribe(respuesta => {
          this.listCiudadanos= respuesta[0];
          this.loading = false;  
      
      });
  }
  //FIN LISTADO DE CIUDADANOS DNI...................................................... 

  //LISTADO DE CIUDADANOS APELLIDO
  listarCiudadanosApellido(){    
    this.ciudadanosService.listarCiudadanosXApellido(this.formaBuscar.get('buscar')?.value).
        subscribe(respuesta => {
          this.listCiudadanos= respuesta[0];
          this.loading = false;  
      
      });
  }
  //FIN LISTADO DE CIUDADANOS APELLIDO...................................................... 

  //LIMPIAR FILTROS
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  } 
  //FIN LIMPIAR FILTROS....................................................................................  

  //ACCEDER A ADMINSTRAR USUARIO
  administrarCiudadano(data: CiudadanoModel){
    this.dataService.ciudadanoData = data;
    this.router.navigateByUrl("admin/ciudadanos/administrar");
  }
  //FIN ACCEDER A ADMINSTRAR USUARIO

}
