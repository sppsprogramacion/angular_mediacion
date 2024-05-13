import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElementoModel } from 'src/app/models/elemento.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { DataService } from 'src/app/service/data.service';
import { UsuariosService } from 'src/app/service/usuarios.service';
import { CiudadanoModel } from '../../models/ciudadano.model';
import { CiudadanosService } from '../../service/ciudadanos.service';
import { globalConstants } from '../../common/global-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ciudadano-usuario',
  templateUrl: './ciudadano-usuario.component.html',
  styleUrls: ['./ciudadano-usuario.component.scss']
})
export class CiudadanoUsuarioComponent implements OnInit {

  //MODELOS
  dataCiudadano: CiudadanoModel= new CiudadanoModel;
  dataUsuario: UsuarioModel= new UsuarioModel;
  dataAdministrador: string = "Administrador";
  
  //listas
  listUsuarios: UsuarioModel[] = [];
  listCiudadanos: CiudadanoModel[] = []
  elementosUsuarios: ElementoModel[]= [] ;
  elementosCiudadanos: ElementoModel[] = []
  
  //variables
  loadingMediadores: boolean = true;
  loadingFuncionTramite: boolean = true
  
  //FORMULARIOS
  formaUsuario: FormGroup;
  formaCiudadano: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    public dataService: DataService,
    private usuarioService: UsuariosService,
    private ciudadanoService: CiudadanosService
  ) { 
    
    //FORMULARIO 
    this.formaUsuario = this.fb.group({
      //tramite_numero: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      dni_usuario: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],     
    
    });

    this.formaCiudadano = this.fb.group({
      //tramite_numero: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      dni_ciudadano: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],     
    
    });
  }

  ngOnInit(): void {
    this.listarCiudadanos();
    this.listarUsuarios();
  }

  //LISTADO DE USUARIOS
  listarUsuarios(){    
    this.usuarioService.listarUsuariosTodos()
        .subscribe({
          next:  (respuesta) => {
            this.listUsuarios= respuesta[0];
            this.loadingMediadores = false;  
            this.elementosUsuarios = this.listUsuarios.map(usuario => {
              return {
                clave: usuario.dni,
                value: usuario.apellido + " " + usuario.nombre + " (" + usuario.dni + ")"
               }
            })
          }
        });
  }  
  //FIN LISTADO DE USUARIOS............................

  //LISTADO DE USUARIOS
  listarCiudadanos(){    
    this.ciudadanoService.listarCiudadanosTodos()
      .subscribe({ 
        next: (respuesta) => {
          this.listCiudadanos= respuesta[0];
          this.loadingMediadores = false;  
          this.elementosCiudadanos = this.listCiudadanos.map(ciudadano => {
            return {
              clave: ciudadano.dni,
              value: ciudadano.apellido + " " + ciudadano.nombre + " (" + ciudadano.dni + ")"
              }
          })
        }
      });
  }  
  //FIN LISTADO DE USUARIOS............................

  //ACCEDER A GLOBAL CONSTANTS
  elegirCiudadano(){
    let dni_ciudadano = parseInt(this.formaCiudadano.get('dni_ciudadano')?.value)
    this.ciudadanoService.buscarXDni(dni_ciudadano)
      .subscribe({
        next: (resultado) => {          
          this.dataCiudadano = resultado;   
          this.dataUsuario = {};       
          this.dataAdministrador = "";
          this.dataService.ciudadanoData = this.dataCiudadano;
          // globalConstants.ciudadanoLogin = this.dataCiudadano;          
          // globalConstants.usuarioLogin = null;
          // globalConstants.isAdministrador = false;
          Swal.fire('Exito',`Ciudadano seleccionado`,"success");
        }
      });    
  }

  elegirUsuario(){
    let dni_usuario = parseInt(this.formaUsuario.get('dni_usuario')?.value)
    this.usuarioService.buscarXDni(dni_usuario)
      .subscribe({
        next: (resultado) => {          
          this.dataCiudadano = {};
          this.dataUsuario = resultado;
          this.dataAdministrador = "";
          // globalConstants.ciudadanoLogin = null;
          // globalConstants.usuarioLogin = this.dataUsuario;
          // globalConstants.isAdministrador = false;
          Swal.fire('Exito',`Usuario seleccionado`,"success");
        }
      });    
  }

  elegirAdministrador(){    
    this.dataCiudadano = {};
    this.dataUsuario = {};
    this.dataAdministrador = "Administrador";
    // globalConstants.ciudadanoLogin = null;
    // globalConstants.usuarioLogin = null;
    // globalConstants.isAdministrador = true;
    Swal.fire('Exito',`Administrador seleccionado`,"success");
  }
  //FIN ACCEDER A GLOBAL CONSTANTS

}
