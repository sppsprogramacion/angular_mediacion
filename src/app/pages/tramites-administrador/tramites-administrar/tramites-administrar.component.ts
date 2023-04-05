import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { TramiteModel } from '../../../models/tramite.model';
import { UsuariosService } from '../../../service/usuarios.service';
import { UsuarioModel } from '../../../models/usuario.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsuarioTramiteModel } from '../../../models/usuario_tramite.model';
import { UsuariosTramiteService } from '../../../service/usuarios-tramite.service';
import Swal from 'sweetalert2';
import { FuncionTramiteService } from '../../../service/funcion-tramite.service';
import { FuncionTtramiteModel } from 'src/app/models/funcion_tramite.model';
import { ElementoModel } from '../../../models/elemento.model';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { departamentos } from 'src/app/common/data-mokeada';
import { CentroMediacionModel } from 'src/app/models/centro_mediacion.model';
import { CentrosMediacionService } from '../../../service/centros-mediacion.service';
import { UsuariosCentroService } from '../../../service/usuarios-centro.service';
import { UsuarioCentroModel } from '../../../models/usuario_centro.model ';

@Component({
  selector: 'app-tramites-administrar',
  templateUrl: './tramites-administrar.component.html',
  providers: [MessageService, ConfirmationService,DatePipe],
  styleUrls: ['./tramites-administrar.component.scss']
})
export class TramitesAdministrarComponent implements OnInit {

  //MODELOS
  dataTramite: TramiteModel= new TramiteModel;
  dataUsuarioTramite: UsuarioTramiteModel= {};
  //listas
  listCentrosMediacion: CentroMediacionModel[]=[];
  listDepartamentos: DepartamentoModel[] = [];
  listFuncionTramite: FuncionTtramiteModel[] = [];
  listUsuarios: UsuarioModel[]=[];
  listUsuariosCentro: UsuarioCentroModel[]=[];
  elementosCentroMediacion: ElementoModel[]=[];  
  elementosUsuarios: ElementoModel[]=[];
  elementosUsuariosCentro: ElementoModel[]=[];

  //variables
  loadingMediadores: boolean = true;
  loadingFuncionTramite: boolean = true

  //FORMULARIOS
  formaMediadorAsignado: FormGroup;  

  constructor(
    private fb: FormBuilder,
    private readonly datePipe: DatePipe,
    public dataService: DataService,
    private usuarioService: UsuariosService,
    private centroMediacionService: CentrosMediacionService,
    private usuariosCentroService: UsuariosCentroService,
    private usuarioTramiteService: UsuariosTramiteService,
    private funcionTramiteService: FuncionTramiteService
    
  ) { 
    //OBTENER EL TRAMITE
    
    console.log("tramite recibido", this.dataTramite);

    //FORMULARIO 
    this.formaMediadorAsignado = this.fb.group({
      //tramite_numero: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      usuario_id: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      detalles: ['',[Validators.required, Validators.minLength(1), Validators.maxLength(200)]],      
      funcion_tramite_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],       
      departamento_id_centro: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      centro_mediacion_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
    });
  }
  //FIN CONSTRUCTOR................................................................................

  ngOnInit(): void {
    this.dataTramite= this.dataService.tramiteData;
    if(this.dataTramite){
      this.buscarAsignacionByNumTramiteActivo();
      
    }    
    this.listDepartamentos = departamentos;
    this.listarMediadores();
    this.listarFuncionTramite();
  }
  //FIN ONINIT......................................................................................

  //GUARDAR USUARIO-TRAMITE  
  submitFormUsuarioTramite(){
    if(this.formaMediadorAsignado.invalid){                        
        // this.msgs = [];
        // this.msgs.push({ severity: 'warn', summary: 'Errores en formulario', detail: 'Cargue correctamente los datos' });
        // this.serviceMensajes.add({key: 'tst', severity: 'warn', summary: 'Errores en formulario', detail: 'Cargue correctamente los dato'});
        // Swal.fire(
            
        //     {target: document.getElementById('form-modal')},
        //     'Formulario Tramite con errores','Complete correctamente todos los campos del formulario',"warning"
        //     );
        
        console.log("formulario", this.formaMediadorAsignado);
        console.log("errores formulario");
        return Object.values(this.formaMediadorAsignado.controls).forEach(control => control.markAsTouched());
    }

    let dataMediadorAsignado: Partial<UsuarioTramiteModel>;

    dataMediadorAsignado = {
      tramite_numero: this.dataTramite.numero_tramite,
      usuario_id: parseInt(this.formaMediadorAsignado.get('usuario_id')?.value),
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

  //BUSCAR TRAMITE X NUMERO TRAMITE ACTIVO
  buscarAsignacionByNumTramiteActivo(){
    this.usuarioTramiteService.buscarByNumTramiteActivo(this.dataTramite.numero_tramite)
      .subscribe({
        next: (resultado) => {
          this.dataUsuarioTramite = resultado;
          console.log("dataUdsuarioTramite", this.dataUsuarioTramite);          
        },
        error: (err) => {
          this.dataUsuarioTramite= {};
          //Swal.fire('Error',`Error al buscar tramite asignado: ${err.error.message}`,"error") 
        }
      });       
  }

  //LISTADO DE MEDIADORES
  listarMediadores(){    
    this.usuarioService.listarUsuariosTodos().
        subscribe(respuesta => {
        this.listUsuarios= respuesta[0];
        this.loadingMediadores = false;  
        this.elementosUsuarios = this.listUsuarios.map(usuario => {
          return {
            clave: usuario.id_usuario,
            value: usuario.apellido + " " + usuario.nombre + " (" + usuario.dni + ")"
           }
        });
    
    });
  }  
  //FIN LISTADO DE MEDIADORES............................

  //LISTADO DE TRAMITES
  listarFuncionTramite(){    
    this.funcionTramiteService.listarFuncionTramitesTodos().
        subscribe(respuesta => {
        this.listFuncionTramite= respuesta[0];
        console.log("listfuncion", this.listFuncionTramite);
        this.loadingFuncionTramite = false;  
    
    });
  }
  //FIN LISTADO DE TRAMITES............................

  cargarCentrosMediacion(id_departamento: number){
    this.centroMediacionService.listarCentroMediacionXDepartamento(id_departamento).
      subscribe(respuesta => {
        this.listCentrosMediacion= respuesta[0];
        this.elementosCentroMediacion = this.listCentrosMediacion.map(centro => {
          return {
            clave: centro.id_centro_mediacion,
            value: centro.centro_mediacion + " (" + centro.municipio.municipio + " - " + centro.localidad_barrio + " - " + centro.calle_direccion + " " + centro.numero_dom + ")"
            }
        });        
    
    });  
  }

  onChangeDepartamentoParaCentros(){
    const id = this.formaMediadorAsignado.get('departamento_id_centro')?.value;
    if(id != null){               
        this.cargarCentrosMediacion(parseInt(id.toString()));
        this.formaMediadorAsignado.get('centro_mediacion_id')?.setValue(1);               
        this.formaMediadorAsignado.get('centro_mediacion_id')?.markAsUntouched();
        
    }
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

  onChangeCentroMediacion(){
    const id = this.formaMediadorAsignado.get('centro_mediacion_id')?.value;
    if(id != null){               
        this.cargarUsuarios(parseInt(id.toString()));
        this.formaMediadorAsignado.get('usuario_id')?.setValue(1);               
        this.formaMediadorAsignado.get('usuario_id')?.markAsUntouched();
        
    }
  }
}
