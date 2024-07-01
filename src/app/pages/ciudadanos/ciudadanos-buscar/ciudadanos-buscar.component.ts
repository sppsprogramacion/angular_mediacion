import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataMokeada, tiposBusquedaCiudadano } from 'src/app/common/data-mokeada';
import { CiudadanoModel } from 'src/app/models/ciudadano.model';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { ConfigService } from 'src/app/service/app.config.service';
import { AuthService } from 'src/app/service/auth.service';
import { CiudadanosService } from 'src/app/service/ciudadanos.service';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-ciudadanos-buscar',
  templateUrl: './ciudadanos-buscar.component.html',
  styleUrls: ['./ciudadanos-buscar.component.scss']
})
export class CiudadanosBuscarComponent implements OnInit {

  loading:boolean = true;

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
      tipo_busqueda_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      buscar: ['',[Validators.required]],

    });
  }
  //fin constructor

  //MENSAJES DE VALIDACIONES
  user_validation_messages = {
    //datos tramite
    'tipo_busqueda_id': [
      { type: 'required', message: 'El tipo de busqueda es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' },
    ],
    'buscar': [
      { type: 'required', message: 'El nombre es requerido' },
    ],
  }
  //FIN MENSAJES DE VALIDACIONES...............................................................

  //VALIDACIONES DE FORMULARIO
  isValid(campo: string): boolean{     
    
    return this.formaBuscar.get(campo)?.invalid && this.formaBuscar.get(campo)?.touched;      
  }

  ngOnInit(): void {
    //this.listarCiudadanos();

    this.listTiposBusqueda = tiposBusquedaCiudadano;
    
  }

  //BUSCAR CIUDADANOS
  buscarCiudadanos(){}


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

  //ACCEDER A ADMINSTRAR USUARIO
  administrarCiudadano(data: CiudadanoModel){
    this.dataService.ciudadanoData = data;
    this.router.navigateByUrl("admin/ciudadanos/administrar");
  }
  //FIN ACCEDER A ADMINSTRAR USUARIO

}
