import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { globalConstants } from 'src/app/common/global-constants';
import { DataService } from 'src/app/service/data.service';
import { UsuariosTramiteService } from 'src/app/service/usuarios-tramite.service';
import { CiudadanoModel } from '../../../models/ciudadano.model';
import { TramiteModel } from '../../../models/tramite.model';
import { UsuarioTramiteModel } from '../../../models/usuario_tramite.model';
import { TramitesService } from '../../../service/tramites.service';
import { AuthService } from 'src/app/service/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ciudadanos-administrar',
  templateUrl: './ciudadanos-administrar.component.html',
  styleUrls: ['./ciudadanos-administrar.component.scss']
})
export class CiudadanosAdministrarComponent implements OnInit {
  loading:boolean = true;

  //MODELOS
  dataCiudadano: CiudadanoModel = new CiudadanoModel;

  //FORMULARIOS
  formaCiudadano: FormGroup;  

  //LISTAS    
  listTramites: TramiteModel[]=[];
  listTramitesNuevos: TramiteModel[]=[];
  listTramitesAsignados: UsuarioTramiteModel[]=[];

  constructor(
    private authService: AuthService,
    private readonly datePipe: DatePipe,
    private fb: FormBuilder,
    private router: Router,

    public dataService: DataService,
    private usuarioTramiteService: UsuariosTramiteService,
    private tramiteService: TramitesService,
  ) { 
    //recuperar ciudadano seleccioando
    this.dataCiudadano = dataService.ciudadanoData;

    this.formaCiudadano = this.fb.group({
      dni: ['',],
      apellido: ['',],
      nombre:   ['',],
      sexo: ['',],
      telefono: [,],
      fecha_nac: [,],  
      email: ['',],    
      
    });
  }

  ngOnInit(): void {

    this.cargarFormularioCiudadano();
    
    this.listarTramites();
  }

  //LISTADO DE TRAMITES ASIGNADOS
  listarTramites(){    
    this.tramiteService.listarTramitesXCiudadano(this.dataCiudadano.id_ciudadano)
        .subscribe({
          next: (respuesta) => {
            this.listTramites= respuesta[0];
            console.log("tramites", this.listTramites);
            this.loading = false;  
          }
    });
  }
  //FIN LISTADO DE TRAMITES ASIGNADOS.......................................................

  //VERIFICAR ADMINISTRADOR
  isAdmin(): boolean{
    if(this.authService.currentUserLogin.rol_id === "administrador"){
      return true;
    }

    return false;
  }
  //FIN VERIFICAR ADMINISTRADOR

  //CARGAR FORMULARIO CIUDADANO
  cargarFormularioCiudadano(){
    this.formaCiudadano.get('dni')?.setValue(this.dataCiudadano.dni);
    this.formaCiudadano.get('apellido')?.setValue(this.dataCiudadano.apellido);
    this.formaCiudadano.get('nombre')?.setValue(this.dataCiudadano.nombre);
    this.formaCiudadano.get('sexo')?.setValue(this.dataCiudadano.sexo.sexo);
    this.formaCiudadano.get('fecha_nac')?.setValue(this.datePipe.transform(this.dataCiudadano.fecha_nac, 'dd/MM/yyyy'));
    this.formaCiudadano.get('telefono')?.setValue(this.dataCiudadano.telefono);
    this.formaCiudadano.get('email')?.setValue(this.dataCiudadano.email);
  }
  //FIN CARGAR FORMULARIO CIUDADANO......................

  //ABRIR NUEVO TRAMITE
  abrirNuevoTramite(){
    this.router.navigateByUrl("admin/ciudadanos/tramites/nuevo");
  }
  //FIN ABRIR NUEVO TRAMITE

  //ACCEDER A DATA SERVICE
  administrarTramite(data: TramiteModel){
    this.dataService.tramiteData = data;

    if (this.authService.currentCiudadanoLogin) {
      this.router.navigateByUrl("ciudadano/tramites/administrar");
    }
    if(this.authService.currentUserLogin){
      if(this.authService.currentUserLogin.rol_id === "administrador"){
        this.router.navigateByUrl("admin/tramites/administrar");
      }
      
    }
    
  }
  //FIN ACCEDER A DATA SERVICE



}
