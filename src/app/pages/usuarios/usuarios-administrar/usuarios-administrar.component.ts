import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { UsuariosTramiteService } from '../../../service/usuarios-tramite.service';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { UsuarioTramiteModel } from 'src/app/models/usuario_tramite.model';
import { TramiteModel } from 'src/app/models/tramite.model';
import { globalConstants } from 'src/app/common/global-constants';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SexoModel } from 'src/app/models/sexo.model';
import { DataMokeadaService } from 'src/app/service/data-mokeada.service';

@Component({
  selector: 'app-usuarios-administrar',
  templateUrl: './usuarios-administrar.component.html',
  styleUrls: ['./usuarios-administrar.component.scss']
})
export class UsuariosAdministrarComponent implements OnInit {
  
  loading:boolean = true;

  //MODELOS
  dataUsuario: UsuarioModel= new UsuarioModel;

    //listas
    listaSexo: SexoModel[] = [];
    listTramitesAsignados: UsuarioTramiteModel[]=[];

  //FORMULARIOS
  formaUsuario: FormGroup;  

  constructor(
    private fb: FormBuilder,
    
    private authService: AuthService,
    
    private dataMokeadaService: DataMokeadaService,
    public dataService: DataService,
    private usuarioTramiteService: UsuariosTramiteService,
    private router: Router
  ) {    

    this.formaUsuario = this.fb.group({
      dni: ['',[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.minLength(5)]],
      apellido: ['',[Validators.required, Validators.pattern(/^[A-Za-zñÑ0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      nombre:   ['',[Validators.required, Validators.pattern(/^[A-Za-zñÑ0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      sexo_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      telefono: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      email: ['',[Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],    
      
    });
    
  }
  //FIN CONSTRUCTOR..................................................

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
    
    return this.formaUsuario.get(campo)?.invalid && this.formaUsuario.get(campo)?.touched;      
  }


  ngOnInit(): void {
    this.dataUsuario = this.dataService.usuarioData;
    this.cargarFormularioUsuario();
    this.listarTramitesAsignados();

    //CARGA DE LISTADOS DESDE DATA MOKEADA
    this.dataMokeadaService.listarSexo().subscribe(sexos => {
      this.listaSexo = sexos;
    });

  }
  //FIN ONINIT.......................................................

  //LISTADO DE TRAMITES ASIGNADOS
  listarTramitesAsignados(){    
    this.usuarioTramiteService.listarTramitesAsignadosXUsuario(this.dataUsuario.id_usuario).
        subscribe(respuesta => {
        this.listTramitesAsignados= respuesta[0];
        this.loading = false;  
        console.log("tramites asignados", this.listTramitesAsignados);
    });
  }
  //FIN LISTADO DE TRAMITES ASIGNADOS.......................................................

  //CARGAR FORMULARIO CIUDADANO
  cargarFormularioUsuario(){
    this.formaUsuario.get('dni')?.setValue(this.dataUsuario.dni);
    this.formaUsuario.get('apellido')?.setValue(this.dataUsuario.apellido);
    this.formaUsuario.get('nombre')?.setValue(this.dataUsuario.nombre);
    this.formaUsuario.get('sexo_id')?.setValue(this.dataUsuario.sexo_id);
    this.formaUsuario.get('telefono')?.setValue(this.dataUsuario.telefono);
    this.formaUsuario.get('email')?.setValue(this.dataUsuario.email);
  }
  //FIN CARGAR FORMULARIO CIUDADANO......................

  //ACCEDER A DATA SERVICE
  administrarTramite(data: TramiteModel){
    this.dataService.tramiteData = data;
    if (this.authService.currentUserLogin) {
      this.router.navigateByUrl("admin/tramites/administrar");
      
    }
    else{
      this.router.navigateByUrl("ciudadano/tramites/administrar");
    }
    
  }
  //FIN ACCEDER A DATA SERVICE

}
