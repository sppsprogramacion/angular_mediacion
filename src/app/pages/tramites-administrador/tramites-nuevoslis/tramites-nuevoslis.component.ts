import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { TramiteModel } from 'src/app/models/tramite.model';
import { UsuarioTramiteModel } from 'src/app/models/usuario_tramite.model';
import { DataService } from 'src/app/service/data.service';
import { TramitesService } from 'src/app/service/tramites.service';
import { globalConstants } from '../../../common/global-constants';
import { UsuariosTramiteService } from '../../../service/usuarios-tramite.service';
import { AuthService } from 'src/app/service/auth.service';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tramites-nuevoslis',
  templateUrl: './tramites-nuevoslis.component.html',
  styleUrls: ['./tramites-nuevoslis.component.scss']
})
export class TramitesNuevoslisComponent implements OnInit {

  //PARA FILTRAR EN TABLA
  @ViewChild('dt') table: Table;
  @ViewChild('filter') filter: ElementRef;

  loading:boolean = true;

  //MODELOS
  tramite: TramiteModel;

  //VARIABLES TRAMITE    
  tramiteDialog: boolean;
  nuevoTramite: boolean;
  isAdmin:boolean=false;
  controlVencimientoTramite: boolean = false;
  submitted: boolean;
  tituloPagina: string ="Usuario: Administrador";

  //LISTAS    
  listDiasDropdown: { label: string, value: number }[] = [];
  listTramites: TramiteModel[]=[];
  listUsuariosTramites: UsuarioTramiteModel[]=[];
  listDepartamentos: DepartamentoModel[]=[];
  listMunicipios: MunicipioModel[]= [];
  listSexo: SexoModel[]=[];

  //FORMULARIOS
    formaBuscar: FormGroup;

  constructor(
    private fb: FormBuilder,
    
    private authService: AuthService,
    private tramitesService: TramitesService,
    private usuariosTramitesService: UsuariosTramiteService,
    public dataService: DataService,
    private router: Router
  ) { 

    this.formaBuscar = this.fb.group({
      dias: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],

    });
  }

  ngOnInit(): void {
    
    if (this.authService.currentUserLogin.rol_id == "administrador") {
      this.isAdmin = true;
    }
    
    if (this.authService.currentUserLogin) {
      
      this.tituloPagina ="Usuario: " + this.authService.currentUserLogin.apellido + " " + this.authService.currentUserLogin.nombre;
      this.listarTramitesAdministrador();
    }

    //cargar lista de años
    let listDias: number[] = [];
    for (let diasAux = 7; diasAux <= 30; diasAux++) {
      listDias.push(diasAux);
    }
    this.listDiasDropdown = listDias.map(dia => ({
      label: dia.toString(),
      value: dia
    }));
    this.formaBuscar.get('dias')?.setValue(7);
    
  }


  //LISTADO DE TRAMITES ADMINISTRADOR NUEVOS
  listarTramitesAdministrador(){        
    this.tramitesService.listarTramitesNuevosAdministrador(this.authService.currentUserLogin.id_usuario).
        subscribe(respuesta => {
        this.listTramites= respuesta[0];
        
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE TRAMITES ADMINISTRADOR NUEVOS....................................................... 
  
  //LISTADO DE TRAMITES CIUDADANOS
  listarTramitesCiudadano(){   

    let id_ciudadano: number = this.authService.currentCiudadanoLogin.id_ciudadano; 
    this.tramitesService.listarTramitesNuevos(id_ciudadano).
      subscribe(respuesta => {
      this.listTramites= respuesta[0];
      this.loading = false;      
    });
  }
  //FIN LISTADO DE TRAMITES CIUDADANOS.......................................................

  //LISTADO DE TRANITES USUARIO
  listarTramitesUsuario(){
    let id_usuario: number = this.authService.currentUserLogin.id_usuario;

    this.usuariosTramitesService.listarTramitesAsignadosXUsuario(id_usuario).
        subscribe(respuesta => {
        this.listUsuariosTramites= respuesta[0];
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE TRAMITES USUARIO.......................................................

  //TRAMITES A VENCER EN DIAS
  buscarAVencer(){
    let diasAux = parseInt(this.formaBuscar.get('dias')?.value);
    this.listarTramitesAVencer(diasAux);
  }
  //FIN TRAMITES A VENCER EN DIAS

  //LISTADO DE TRAMITES A VENCER
  listarTramitesAVencer(dias: number){        
    this.tramitesService.listarTramitesAVencerXDias(dias).
        subscribe(respuesta => {
        this.listTramites= respuesta[0];
        
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE TRAMITES A VENCER.......................................................

  //TRAMITES FINALIZADOS POR AÑO
  aplicarControlVencidos(){
    let dias = parseInt(this.formaBuscar.get('dias')?.value);

    if(this.formaBuscar.invalid){
      Swal.fire('No se finalizó el control', "Error: complete correctamente los campos del formulario" ,"warning");
      return Object.values(this.formaBuscar.controls).forEach(control => control.markAsTouched());
    }
    

    //GUARDAR FINALIZAR TRAMITE
    this.tramitesService.updateAplicarControlVencidos(dias)
      .subscribe({
        next: (resultado) => {
          //let tramite: TramiteModel = resultado;
          
          Swal.fire('Exito',`El control se realizó con exito`,"success");
          this.buscarAVencer();
        },
        error: (err) => {

          Swal.fire('No se finalizó el tramite', `Error: ${err.error.message}`,"error");
        }
      });         
    //FIN GUARDAR FINALIZAR TRAMITE
    
  }
  //FIN TRAMITES FINALIZADOS POR AÑO

 //ABRIR NUEVO TRAMITE
  abrirNuevoTramite(){
    this.router.navigateByUrl("admin/tramites/nuevo");
  }
  //FIN ABRIR NUEVO TRAMITE

  //CONTROLAR VENCIMIENTO TRAMITE
  controlarVencimientoTramite(estadoControlar: boolean){
    this.controlVencimientoTramite = estadoControlar;
    if(!estadoControlar){
      if (this.authService.currentUserLogin) {
      
        this.listarTramitesAdministrador();
      }
    }

  }
  //FIN CONTROLAR VENCIMIENTO TRAMITE

  //LIMPIAR FILTROS
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  } 
  //FIN LIMPIAR FILTROS....................................................................................  


  //ACCEDER A DATA SERVICE
  administrarTramite(data: TramiteModel){
    this.dataService.tramiteData = data;

    if( this.authService.currentUserLogin.rol_id == "administrador" && data.estado_tramite_id != 3){
      this.router.navigateByUrl("admin/tramites/administrar");
    }    

    //verificacion si el usuario tiene la funcion de administrativo en el tramite
    if( this.authService.currentUserLogin.rol_id == "supervisor" && data.estado_tramite_id != 3 ){
      this.router.navigateByUrl("admin/tramites/administrar-visor");
    }
    
    //verificacion si el usuario tiene la funcion de mediador en el tramite
    if( this.authService.currentUserLogin.rol_id == "mediador" && data.estado_tramite_id != 3){
      this.router.navigateByUrl("admin/tramites/administrar-med" );
    }

    if(data.estado_tramite_id == 3){
      this.router.navigateByUrl("admin/tramites/administrar-finalizado");
    }

    
  }
  //FIN ACCEDER A DATA SERVICE

}
