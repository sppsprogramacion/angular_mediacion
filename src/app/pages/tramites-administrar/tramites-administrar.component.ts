import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { TramiteModel } from '../../models/tramite.model';
import { UsuariosService } from '../../service/usuarios.service';
import { UsuarioModel } from '../../models/usuario.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsuarioTramiteModel } from '../../models/usuario_tramite.model';
import { UsuariosTramiteService } from '../../service/usuarios-tramite.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tramites-administrar',
  templateUrl: './tramites-administrar.component.html',
  providers: [MessageService, ConfirmationService,DatePipe],
  styleUrls: ['./tramites-administrar.component.scss']
})
export class TramitesAdministrarComponent implements OnInit {

  //MODELOS
  dataTramite: TramiteModel= new TramiteModel;
  dataUsuarioTramite: UsuarioTramiteModel= new UsuarioTramiteModel;

  //listas
  listUsuarios: UsuarioModel[]=[];

  //variables
  loading: boolean = true;

  //FORMULARIOS
  formaMediadorAsignado: FormGroup;  

  constructor(
    private fb: FormBuilder,
    private readonly datePipe: DatePipe,
    public dataService: DataService,
    private usuarioService: UsuariosService,
    private usuarioTramiteService: UsuariosTramiteService
    
  ) { 
    //OBTENER EL TRAMITE
    this.dataTramite= dataService.tramiteData;

    //FORMULARIO 
    this.formaMediadorAsignado = this.fb.group({
      tramite_numero: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      dni_usuario: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      detalles: ['',[Validators.required, Validators.minLength(1), Validators.maxLength(200)]],      
      funcion_tramite_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]]       
    
    });
  }

  ngOnInit(): void {
    this.listarMediadores();
  }

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
        
        
        console.log("errores formulario");
        return Object.values(this.formaMediadorAsignado.controls).forEach(control => control.markAsTouched());
    }

    let dataMediadorAsignado: Partial<UsuarioTramiteModel>;

    dataMediadorAsignado = {
      tramite_numero: this.dataTramite.numero_tramite,
      dni_usuario: parseInt(this.formaMediadorAsignado.get('dni')?.value),
      detalles: this.formaMediadorAsignado.get('detalles')?.value,
      funcion_tramite_id: parseInt(this.formaMediadorAsignado.get('funcion_tramite_id')?.value),             
    };
    
    
    //GUARDAR NUEVO USUARIO-TRAMITE
    this.usuarioTramiteService.guardarUsuarioTramite(dataMediadorAsignado)
        .subscribe(resultado => {
            let usuarioTramiteRes: UsuarioTramiteModel = resultado;
            Swal.fire('Exito',`La asignacion de mediador se realizo con exito`,"success");
            
           
        },
        (error) => {
            Swal.fire('Error',`Error al realizar la asignacion: ${error.error.message}`,"error") 
        }
    );         
    //FIN GUARDAR NUEVO USUARIO-TRAMITE

  }    
  //FIN GUARDAR USUARIO-TRAMITE............................................................


  //LISTADO DE MEDIADORES
  listarMediadores(){    
    this.usuarioService.listarUsuariosTodos().
        subscribe(respuesta => {
        this.listUsuarios= respuesta[0];
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE MEDIADORES............................

  //LISTADO DE TRAMITES
  // listarFuncionTramite(){    
  //   this.usuarioTramiteService.listarFuncionTramitesTodos().
  //       subscribe(respuesta => {
  //       this.listUsuarios= respuesta[0];
  //       this.loading = false;  
    
  //   });
  // }
  //FIN LISTADO DE TRAMITES............................
}
