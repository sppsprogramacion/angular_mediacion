import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  selector: 'app-tramites-vencidos',
  templateUrl: './tramites-vencidos.component.html',
  styleUrls: ['./tramites-vencidos.component.scss']
})
export class TramitesVencidosComponent implements OnInit {

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
    this.listarTramitesUsuarioVencidosXAnio(this.anioActual);

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
  
  //LISTADO DE TRANITES USUARIO
  listarTramitesUsuarioVencidosXAnio(anio: number){
    this.loading = true;
    let id_usuario: number = this.authService.currentUserLogin.id_usuario;    

    //REVISAR PARA LISTAR TRAMITES FINALIZADOS
    this.tramitesService.listarTramitesVencidosUsuarioXAnio(id_usuario, anio).
      subscribe(respuesta => {
        this.listTramites= respuesta[0];
        this.loading = false;  
      });
  }
  //FIN LISTADO DE TRAMITES USUARIO.......................................................

  //TRAMITES FINALIZADOS POR AÑO
  buscarVencidosXAnio(){
    let anio = parseInt(this.formaBusqueda.get('anio')?.value);
    this.listarTramitesUsuarioVencidosXAnio(anio);
  }
  //FIN TRAMITES FINALIZADOS POR AÑO
  
  //ACCEDER A DATA SERVICE
  administrarTramite(data: TramiteModel){
    this.dataService.tramiteData = data;    
    this.router.navigateByUrl("admin/tramites/administrar-vencido");
  }
  //FIN ACCEDER A DATA SERVICE

}
