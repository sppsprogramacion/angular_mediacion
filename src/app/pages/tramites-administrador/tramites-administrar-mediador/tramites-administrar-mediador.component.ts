import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

import { DataService } from 'src/app/service/data.service';
import { TramiteModel } from '../../../models/tramite.model';
import { UsuariosService } from '../../../service/usuarios.service';
import { UsuarioModel } from '../../../models/usuario.model';
import { UsuarioTramiteModel } from '../../../models/usuario_tramite.model';
import { UsuariosTramiteService } from '../../../service/usuarios-tramite.service';
import { FuncionTramiteService } from '../../../service/funcion-tramite.service';
import { FuncionTtramiteModel } from 'src/app/models/funcion_tramite.model';
import { ElementoModel } from '../../../models/elemento.model';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { departamentos } from 'src/app/common/data-mokeada';
import { CentroMediacionModel } from 'src/app/models/centro_mediacion.model';
import { CentrosMediacionService } from '../../../service/centros-mediacion.service';
import { UsuariosCentroService } from '../../../service/usuarios-centro.service';
import { UsuarioCentroModel } from '../../../models/usuario_centro.model ';
import { TramitesService } from 'src/app/service/tramites.service';
import { globalConstants } from '../../../common/global-constants';
import { ConvocadoModel } from 'src/app/models/convocado.model';
import { VinculadoModel } from 'src/app/models/vinculado.model';

@Component({
  selector: 'app-tramites-administrar-mediador',
  templateUrl: './tramites-administrar-mediador.component.html',
  providers: [MessageService, ConfirmationService,DatePipe],
  styleUrls: ['./tramites-administrar-mediador.component.scss']
})
export class TramitesAdministrarMediadorComponent implements OnInit {

  //MODELOS
  dataConvocado: ConvocadoModel = {};
  dataTramite: TramiteModel= new TramiteModel;
  dataTramiteAux: TramiteModel= new TramiteModel;
  dataUsuarioTramite: UsuarioTramiteModel= {};
  dataVinculado: VinculadoModel = {};

  //listas
  listCentrosMediacion: UsuarioCentroModel[]=[];
  listDepartamentos: DepartamentoModel[] = [];
  listFuncionTramite: FuncionTtramiteModel[] = [];
  listUsuarios: UsuarioModel[]=[];
  listUsuariosCentro: UsuarioCentroModel[]=[];
  listUsuariosTramite: UsuarioTramiteModel[]=[];
  elementosCentroMediacion: ElementoModel[]=[];  
  elementosUsuarios: ElementoModel[]=[];
  elementosUsuariosCentro: ElementoModel[]=[];

  //variables
  loadingMediadores: boolean = true;
  loadingFuncionTramite: boolean = true;
  loadingUsuariosTramite: boolean = true;

  //booleans
  isNuevo: boolean = false;
  convocadoDialog: boolean = false;  
  vinculadoDialog: boolean = false;

  //FORMULARIOS
  formaMediadorAsignado: FormGroup;  

  constructor(
    private fb: FormBuilder,
    private readonly datePipe: DatePipe,
    public dataService: DataService,
    private centroMediacionService: CentrosMediacionService,
    private funcionTramiteService: FuncionTramiteService,
    private tramiteService: TramitesService,
    private usuariosCentroService: UsuariosCentroService,
    private usuarioService: UsuariosService,
    private usuarioTramiteService: UsuariosTramiteService,
    
  ) { 
    //OBTENER EL TRAMITE

    //FORMULARIO 
    this.formaMediadorAsignado = this.fb.group({
      detalles: ['',[Validators.required, Validators.minLength(1), Validators.maxLength(200)]],      
      funcion_tramite_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],       
      
    });
  }
  //FIN CONSTRUCTOR................................................................................

  ngOnInit(): void {
    //obtener tramite
    this.dataTramiteAux= this.dataService.tramiteData;
    this.buscarTramite();
    console.log("tramite recibido onini", this.dataService.tramiteData);
    console.log("tramite encontrado onini", this.dataTramite);

    if(this.dataTramiteAux){
      this.buscarAsignacionByNumTramiteActivo();
      
    }   
    console.log("estado tramite", this.dataTramite.estado_tramite_id);
    
    
  }
  //FIN ONINIT......................................................................................

  //MENSAJES DE VALIDACIONES
  user_validation_messages = {
    //datos tramite 
    'funcion_tramite_id': [
      { type: 'required', message: 'La función en el tramite es requerida.' },
      { type: 'pattern', message: 'Debe seleccionar un una función.' },
    ],
    'detalles': [
      { type: 'required', message: 'El detalle es requerido.' },
      { type: 'minlength', message: 'La cantidad mínima de caracteres es 1.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 200.' }
    ],  
  }
  //FIN MENSAJES DE VALIDACIONES...............................................................

  //VALIDACIONES DE FORMULARIO
  isValidRecibirTramite(campo: string): boolean{     
    
    return this.formaMediadorAsignado.get(campo)?.invalid && this.formaMediadorAsignado.get(campo)?.touched;      
  }
  //FIN VALIDACIONES DE FORMULARIO...............................................

  //GUARDAR USUARIO-TRAMITE  
  submitFormUsuarioTramite(){
    if(this.formaMediadorAsignado.invalid){     
        
        console.log("formulario", this.formaMediadorAsignado);
        console.log("errores formulario");
        Swal.fire('Formulario incompleto',`Complete correctamente todos los campos del formulario`,"error");
        return Object.values(this.formaMediadorAsignado.controls).forEach(control => control.markAsTouched());
    }

    let dataMediadorAsignado: Partial<UsuarioTramiteModel>;

    dataMediadorAsignado = {
      tramite_numero: this.dataTramite.numero_tramite,
      usuario_id: globalConstants.usuarioLogin.id_usuario,
      detalles: this.formaMediadorAsignado.get('detalles')?.value,
      funcion_tramite_id: parseInt(this.formaMediadorAsignado.get('funcion_tramite_id')?.value),             
    };
    
    
    //GUARDAR NUEVO USUARIO-TRAMITE
    this.usuarioTramiteService.guardarUsuarioTramite(dataMediadorAsignado)
      .subscribe({
        next: (resultado) => {
          let usuarioTramiteRes: UsuarioTramiteModel = resultado;
          Swal.fire('Exito',`La asignacion de mediador se realizo con exito`,"success");
        },
        error: (err) => {
          Swal.fire('Error',`Error al realizar la asignacion: ${err.error.message}`,"error") 
        }
      });         
    //FIN GUARDAR NUEVO USUARIO-TRAMITE

  }    
  //FIN GUARDAR USUARIO-TRAMITE............................................................

  //BUSCAR TRAMITE 
  buscarTramite(){  
    this.dataTramite = {};  
    this.tramiteService.buscarTramiteNumTram(this.dataService.tramiteData.numero_tramite)
      .subscribe({
        next: (resultado) => {          
          this.dataTramite = {};
          this.dataTramite = resultado[0];  
          if(this.dataTramite.estado_tramite_id === 1){
      
            this.isNuevo = true;
            //cargar datos formulario recibir tramite
            this.cargarCentrosMediacion(globalConstants.usuarioLogin.id_usuario);
            this.listarFuncionTramite();
          }      
        }
      });    
  }
  //FIN BUSCAR TRAMITE................................................................... 

  //BUSCAR TRAMITE X NUMERO TRAMITE ACTIVO
  buscarAsignacionByNumTramiteActivo(){
    this.usuarioTramiteService.buscarByNumTramiteActivo(this.dataService.tramiteData.numero_tramite)
      .subscribe({
        next: (resultado) => {
          this.listUsuariosTramite = resultado[0];  
          this.loadingUsuariosTramite = false;           
        },
        error: (err) => {
          this.dataUsuarioTramite= {};
          //Swal.fire('Error',`Error al buscar tramite asignado: ${err.error.message}`,"error") 
        }
      });       
  }

  

  //LISTADO DE FUNCIONES TRAMITES
  listarFuncionTramite(){    
    this.funcionTramiteService.listarFuncionTramitesTodos().
        subscribe(respuesta => {
        this.listFuncionTramite= respuesta[0];
        this.loadingFuncionTramite = false;  
    
    });
  }
  //FIN LISTADO DE FUNCIONES TRAMITES............................

  // cargarCentrosMediacion(id_departamento: number){
  //   this.centroMediacionService.listarCentroMediacionXDepartamento(id_departamento).
  //     subscribe(respuesta => {
  //       this.listCentrosMediacion= respuesta[0];
  //       this.elementosCentroMediacion = this.listCentrosMediacion.map(centro => {
  //         return {
  //           clave: centro.id_centro_mediacion,
  //           value: centro.centro_mediacion + " (" + centro.municipio.municipio + " - " + centro.localidad_barrio + " - " + centro.calle_direccion + " " + centro.numero_dom + ")"
  //           }
  //       });        
    
  //   });  
  // }

  cargarCentrosMediacion(id_usuario: number){
    this.usuariosCentroService.listarCentrosActivosXUsuario(id_usuario).
      subscribe(respuesta => {
        this.listCentrosMediacion= respuesta[0];
        this.elementosCentroMediacion = this.listCentrosMediacion.map(centro => {
          return {
            clave: centro.centro_mediacion.id_centro_mediacion,
            value: centro.centro_mediacion.centro_mediacion + " (Municipio: " + centro.centro_mediacion.municipio.municipio + " - Barrio: " + centro.centro_mediacion.localidad_barrio + " - Dirección: " + centro.centro_mediacion.calle_direccion + " n°" + centro.centro_mediacion.numero_dom + ")"
            }
        });        
    
    });  
  }

  cargarUsuarios(id_centro_mediacion: number){
    this.usuariosCentroService.listarUsuariosActivosXCentro(id_centro_mediacion)
    .subscribe({
      next: (resultado) => {
        this.listUsuariosCentro = resultado[0]
        this.elementosUsuariosCentro = this.listUsuariosCentro.map(usuarioCentro => {
          return {
            clave: usuarioCentro.usuario_id,
            value: usuarioCentro.usuario.apellido +  " " + usuarioCentro.usuario.nombre + " (" + usuarioCentro.usuario.dni + ")"
            
          }
        });
      },
      error: (err) => {
        Swal.fire('Error al listar los usuarios',`${err.error.message}`,"error");
      } 
    })   
       
  }

  //MANEJO DE FORMULARIO DIALOG CONVOCADO
  openDialogConvocado(convocado: ConvocadoModel) {
    this.dataConvocado = convocado;
    this.convocadoDialog = true; 
    
  }
  
  hideDialogConvocado() {    
    this.convocadoDialog = false;    
  }    
  //FIN MANEJO FORMULARIO DIALOG CONVOCADO....................................

  //MANEJO DE FORMULARIO DIALOG VINCULADO
  reiniciarFormularioVinculado(){
    
  }

  openDialogVinculado(vinculado: VinculadoModel) {
    this.dataVinculado = vinculado;
    this.vinculadoDialog = true; 

  }
  
  hideDialogVinculado() {    
    this.vinculadoDialog = false;    
  }    
  //FIN MANEJO FORMULARIO DIALOG VINCULADO....................................
  
}
