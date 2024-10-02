import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { globalConstants } from 'src/app/common/global-constants';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { TramiteModel } from 'src/app/models/tramite.model';
import { UsuarioTramiteModel } from 'src/app/models/usuario_tramite.model';
import { DataService } from 'src/app/service/data.service';
import { TramitesService } from 'src/app/service/tramites.service';
import { UsuariosTramiteService } from 'src/app/service/usuarios-tramite.service';
import { AuthService } from '../../../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tramites-finalizados',
  templateUrl: './tramites-finalizados.component.html',
  styleUrls: ['./tramites-finalizados.component.scss']
})
export class TramitesFinalizadosComponent implements OnInit {

  loading:boolean = true;

  //VARIABLES TRAMITE    
  tramite: TramiteModel;
  tramiteDialog: boolean;
  nuevoTramite: boolean;
  submitted: boolean;

  //LISTAS    
  listaAnios: number[] = [];
  listaAniosDropdown: { label: string, value: number }[] = [];
  listTramites: TramiteModel[]=[];
  listDepartamentos: DepartamentoModel[]=[];
  listMunicipios: MunicipioModel[]= [];
  listSexo: SexoModel[]=[];
  listUsuariosTramites: UsuarioTramiteModel[]=[];

   //FORMULARIOS
   formaBusqueda: FormGroup;

  //VARIABLES
  anioActual: number;

  constructor(
    private fb: FormBuilder,
    
    private authService: AuthService,
    private tramitesService: TramitesService,
    private usuariosTramitesService: UsuariosTramiteService,
    public dataService: DataService,
    private router: Router
  ) { 
    this.formaBusqueda = this.fb.group({      
      anio: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      
    });

  }

  ngOnInit(): void {
    //this.listarTramitesUsuarioFinalizados();

    //obtener anio actual para buscar por defecto los tramites del usuario de ese anio
    this.anioActual = new Date().getFullYear();
    this.listarTramitesUsuarioFinalizadosXAnio(this.anioActual);

    //cargar lista de años
    for (let anio = 2023; anio <= this.anioActual; anio++) {
      this.listaAnios.push(anio);
    }
    this.listaAniosDropdown = this.listaAnios.map(anio => ({
      label: anio.toString(),
      value: anio
    }));
    this.formaBusqueda.get('anio')?.setValue(this.anioActual);
    
  }


  //LISTADO DE TRAMITES FINALIZADOS
  listarTramites(){    
    this.tramitesService.listarTramitesFinalizados().
        subscribe(respuesta => {
        this.listTramites= respuesta[0];
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE TRAMITES FINALIZADOS.......................................................

  //LISTADO DE TRANITES USUARIO
  listarTramitesUsuarioFinalizados(){
    let id_usuario: number = this.authService.currentUserLogin.id_usuario;

    //REVISAR PARA LISTAR TRAMITES FINALIZADOS
    this.usuariosTramitesService.listarTramitesFinalizadosXUsuario(id_usuario).
      subscribe(respuesta => {
        this.listUsuariosTramites= respuesta[0];
        this.loading = false;  
    
      });
  }
  //FIN LISTADO DE TRAMITES USUARIO.......................................................

  //LISTADO DE TRANITES USUARIO
  listarTramitesUsuarioFinalizadosXAnio(anio: number){
    this.loading = true;
    let id_usuario: number = this.authService.currentUserLogin.id_usuario;    

    //REVISAR PARA LISTAR TRAMITES FINALIZADOS
    this.usuariosTramitesService.listarTramitesFinalizadosXUsuarioXAnio(id_usuario, anio).
      subscribe(respuesta => {
        this.listUsuariosTramites= respuesta[0];
        this.loading = false;  
      });
  }
  //FIN LISTADO DE TRAMITES USUARIO.......................................................

  //TRAMITES FINALIZADOS POR AÑO
  buscarFinalizadosXAnio(){
    let anio = parseInt(this.formaBusqueda.get('anio')?.value);
    this.listarTramitesUsuarioFinalizadosXAnio(anio);
  }
  //FIN TRAMITES FINALIZADOS POR AÑO
  
  //ACCEDER A DATA SERVICE
  administrarTramite(data: UsuarioTramiteModel){
    this.dataService.tramiteData = data.tramite;    
    this.router.navigateByUrl("admin/tramites/administrar-finalizado");
  }
  //FIN ACCEDER A DATA SERVICE

}
