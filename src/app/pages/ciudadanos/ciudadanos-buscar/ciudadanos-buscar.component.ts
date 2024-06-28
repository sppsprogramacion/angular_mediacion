import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  //listas
  listaSexo: SexoModel[] = [];

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

  constructor(
    private fb: FormBuilder,
    private router: Router,

    public configService: ConfigService,
    private ciudadanosService: CiudadanosService,
    private authService: AuthService,
    private dataService: DataService, 

  ) { 
    this.formaBuscar = this.fb.group({

      buscar: ['',[Validators.required]],
      tipo_busqueda: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],

    });
  }
  //fin constructor

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
    'email': [
      { type: 'required', message: 'El e-mail es requerido' },
      { type: 'pattern', message: 'El formato del e-mail no es correcto.' }
    ],
    
  }
  //FIN MENSAJES DE VALIDACIONES...............................................................

  //VALIDACIONES DE FORMULARIO
  isValid(campo: string): boolean{     
    
    return this.formaBuscar.get(campo)?.invalid && this.formaBuscar.get(campo)?.touched;      
  }

  ngOnInit(): void {
    this.listarCiudadanos();
    
  }

  //BUSCAR CIUDADANOS
  buscarCiudadanos(){}


  //LISTADO DE CIUDADANOS
  listarCiudadanos(){    
    this.ciudadanosService.listarCiudadanosTodos().
        subscribe(respuesta => {
        this.listCiudadanos= respuesta[0];
        console.log("ciudadanos", this.listCiudadanos);
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE CIUDADANOS....................................................... 

  //ACCEDER A ADMINSTRAR USUARIO
  administrarCiudadano(data: CiudadanoModel){
    this.dataService.ciudadanoData = data;
    this.router.navigateByUrl("admin/ciudadanos/administrar");
  }
  //FIN ACCEDER A ADMINSTRAR USUARIO

}
