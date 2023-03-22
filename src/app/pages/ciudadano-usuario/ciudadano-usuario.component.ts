import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElementoModel } from 'src/app/models/elemento.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { DataService } from 'src/app/service/data.service';
import { UsuariosService } from 'src/app/service/usuarios.service';
import { CiudadanoModel } from '../../models/ciudadano.model';
import { CiudadanosService } from '../../service/ciudadanos.service';

@Component({
  selector: 'app-ciudadano-usuario',
  templateUrl: './ciudadano-usuario.component.html',
  styleUrls: ['./ciudadano-usuario.component.scss']
})
export class CiudadanoUsuarioComponent implements OnInit {

  //MODELOS
  dataCiudadano: CiudadanoModel= new CiudadanoModel;
  dataUsuario: UsuarioModel= new UsuarioModel;
  
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
    this.usuarioService.listarUsuariosTodos().
        subscribe(respuesta => {
        this.listUsuarios= respuesta[0];
        this.loadingMediadores = false;  
        this.elementosUsuarios = this.listUsuarios.map(usuario => {
          return {
            clave: usuario.dni,
            value: usuario.apellido + " " + usuario.nombre + " (" + usuario.dni + ")"
           }
        });
    
    });
  }  
  //FIN LISTADO DE USUARIOS............................

  //LISTADO DE USUARIOS
  listarCiudadanos(){    
    this.ciudadanoService.listarCiudadanosTodos().
        subscribe(respuesta => {
        this.listCiudadanos= respuesta[0];
        this.loadingMediadores = false;  
        this.elementosCiudadanos = this.listCiudadanos.map(ciudadano => {
          return {
            clave: ciudadano.dni,
            value: ciudadano.apellido + " " + ciudadano.nombre + " (" + ciudadano.dni + ")"
           }
        });
    
    });
  }  
  //FIN LISTADO DE USUARIOS............................

  //ACCEDER A DATA SERVICE
  elegirCiudadano(){
    let dni_ciudadano = parseInt(this.formaCiudadano.get('dni_ciudadano')?.value)
    this.ciudadanoService.buscarXDni(dni_ciudadano)
      .subscribe({
        next: (resultado) => {
          this.dataCiudadano = resultado;
          this.dataService.ciudadanoLogin = this.dataCiudadano;
        }
      });
    
  }

  elegirUsuario(){
    let dni_usuario = parseInt(this.formaUsuario.get('dni_usuario')?.value)
    this.usuarioService.buscarXDni(dni_usuario)
      .subscribe({
        next: (resultado) => {
          this.dataUsuario = resultado;
          this.dataService.usuarioLogin = this.dataUsuario;
        }
      });
    
  }
  //FIN ACCEDER A DATA SERVICE

}
