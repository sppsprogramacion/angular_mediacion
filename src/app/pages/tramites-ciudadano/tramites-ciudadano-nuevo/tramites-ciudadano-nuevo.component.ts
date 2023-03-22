import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/api/appconfig';
import { departamentos, municipios, objetos, opcionSiNo, sexo } from 'src/app/common/data-mokeada';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { CiudadanosService } from 'src/app/service/ciudadanos.service';
import { TramitesService } from 'src/app/service/tramites.service';
import Swal from 'sweetalert2';
import { TramiteModel } from '../../../models/tramite.model';
import { ObjetoModel } from '../../../models/objeto.model';
import { CiudadanoModel } from 'src/app/models/ciudadano.model';

@Component({
  selector: 'app-tramites-ciudadano-nuevo',
  templateUrl: './tramites-ciudadano-nuevo.component.html',
  providers: [MessageService, ConfirmationService,DatePipe],
  styleUrls: ['./tramites-ciudadano-nuevo.component.scss']
})
export class TramitesCiudadanoNuevoComponent implements OnInit {

  config: AppConfig;  
  subscription: Subscription;
  selectedState:any;
  

  msgs: Message[] = []; 

  //listas
  
  listMunicipios: MunicipioModel[] = [];
  listDepartamentos: DepartamentoModel[] = [];
  listObjetos: ObjetoModel[] = [];
  listSexo: SexoModel[] = [];
  listSiNo: any[] = [];
  listCiudadano: CiudadanoModel[]=[];
  //variables tramite  
  formTramiteDialog: boolean= false;
  existe_violencia_genero: boolean = false;

  //FORMULARIOS
  formaTramite: FormGroup;
  formaConvocado: FormGroup;   


  constructor(    
    private fb: FormBuilder,
    private readonly datePipe: DatePipe,
    private serviceMensajes: MessageService,
    private ciudadanoService: CiudadanosService,
    private tramiteService: TramitesService,

    ){ 
      this.formaTramite = this.fb.group({
        ciudadano_id: [,[]],
        esta_asesorado: [false,[Validators.required]],
        objeto_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
        violencia_genero: [false,[Validators.required]],
        violencia_partes: [false,[Validators.required]],
        existe_denuncia: [false,[Validators.required]],
        medida_cautelar: [false,[Validators.required]],
        pdf_denuncia: [false,[Validators.required]],
        pdf_cautelar: [false,[Validators.required]],
        pdf_ingresos: [false,[Validators.required]],
        pdf_negativa: [false,[Validators.required]],
        modalidad_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
        variante_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
        estado_tramite_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]]       
      
      });
    }

  ngOnInit(): void {
    // this.config = this.configService.config;
    // this.subscription = this.configService.configUpdate$.subscribe(config => {
    //   this.config = config;
    // });

    //CARGA DE LISTADOS DESDE DATA MOKEADA
    this.listObjetos = objetos;
    this.listSexo = sexo;
    this.listSiNo = opcionSiNo;
    this.listDepartamentos = departamentos;
    this.cargarMunicipios(1);
    
    console.log("sino", this.listSiNo);
    this.listarCiudadanos();
  }

  // ngOnDestroy(): void {
  //   if(this.subscription){
  //     this.subscription.unsubscribe();
  //   }
  // }

 

  //GUARDAR Tramite  
  submitFormTramite(){
    if(this.formaTramite.invalid){                        
        // this.msgs = [];
        // this.msgs.push({ severity: 'warn', summary: 'Errores en formulario', detail: 'Cargue correctamente los datos' });
        // this.serviceMensajes.add({key: 'tst', severity: 'warn', summary: 'Errores en formulario', detail: 'Cargue correctamente los dato'});
        // Swal.fire(
            
        //     {target: document.getElementById('form-modal')},
        //     'Formulario Tramite con errores','Complete correctamente todos los campos del formulario',"warning"
        //     );
        let fechaAuxiliar = this.datePipe.transform(this.formaTramite.get('fecha_nac')?.value,"yyyy-MM-dd")!;
        // console.log("fecha", this.formaRegistro.get('fecha_nac')?.value);
        // console.log("fecha aux", fechaAuxiliar);
        console.log("errores formulario");
        return Object.values(this.formaTramite.controls).forEach(control => control.markAsTouched());
    }

    let dataTramite: Partial<TramiteModel>;
    let data:any;
    data ={
     dataTramite : {
      ciudadano_id: parseInt(this.formaTramite.get('ciudadano_id')?.value),
      esta_asesorado: this.formaTramite.get('esta_asesorado')?.value,
      objeto_id: parseInt(this.formaTramite.get('objeto_id')?.value),
      violencia_genero: this.formaTramite.get('violencia_genero')?.value,
      violencia_partes: this.formaTramite.get('violencia_genero')?.value,
      existe_denuncia: this.formaTramite.get('existe_denuncia')?.value,
      medida_cautelar: this.formaTramite.get('medida_cautelar')?.value,
      pdf_denuncia: this.formaTramite.get('pdf_denuncia')?.value,
      pdf_cautelar: this.formaTramite.get('pdf_cautelar')?.value,
      pdf_ingresos: this.formaTramite.get('pdf_ingresos')?.value,
      pdf_negativa: this.formaTramite.get('pdf_negativa')?.value,
      modalidad_id: parseInt(this.formaTramite.get('modalidad_id')?.value),
      variante_id: parseInt(this.formaTramite.get('variante_id')?.value),
    }
  }
    
    console.log("form tramite", this.formaTramite);
    
    //GUARDAR NUEVO TRAMITE
    this.tramiteService.guardarTramite(data)
      .subscribe({
        next: (resultado) => {
          let tramiteRes: TramiteModel = resultado;
          Swal.fire('Exito',`El registro se realizó con exito`,"success");
        },
        error: (err) => {
          Swal.fire('Error',`Error al guardar el tramite: ${err.error.message}`,"error")
        }
      });
    //     .subscribe(resultado => {
    //         let tramiteRes: TramiteModel = resultado;
    //         Swal.fire('Exito',`El registro se realizó con exito`,"success");
    //     },
    //     (error) => {
    //         Swal.fire('Error',`Error al guardar el tramite: ${error.error.message}`,"error") 
    //     }
    // );         
    //FIN GUARDAR NUEVO TRAMITE 

  }    
  //FIN GUARDAR CIUDADANO............................................................

  isValid(campo: string): boolean{
    // if (this.formaRegistro.get(campo).invalid && this.form_submitted) {
    if (this.formaTramite.get(campo).invalid ) {
      return true;
    }else{
      return false;
    }
  }

  clavesValidation(): boolean{
    return ((this.formaTramite.get('clave1').value === this.formaTramite.get('clave2').value))?  false: true;
        
  }

  mostrarDialogTramite(){
    this.formTramiteDialog= true;
  }

  hideDialogTramite(){
    this.formTramiteDialog= false;
  }

  cargarMunicipios(id_departamento: number){
    this.listMunicipios=municipios.filter(municipio => {      
      return municipio.id_municipio == 1 || municipio.departamento_id == id_departamento;
    });    
  }

  onChangeDepartamento(){
    const id = this.formaTramite.get('departamento_id')?.value;
    if(id != null){               
        this.cargarMunicipios(parseInt(id.toString()));
        this.formaTramite.get('municipio_id')?.setValue(1);               
        this.formaTramite.get('municipio_id')?.markAsUntouched();
        
    }
  }

  changeFormatoFechaGuardar(nuevaFecha: Date){
    let fechaAuxiliar:any = null;
    if(nuevaFecha != null){
      fechaAuxiliar = this.datePipe.transform(nuevaFecha,"yyyy-MM-dd")!;
      
    }
    return fechaAuxiliar;
  }

  onChangeViolenciaGenero(){
    if(this.formaTramite.get('violencia_genero')?.value == true){
      this.existe_violencia_genero= true;
    
    }
    else{
      this.formaTramite.get('existe_denuncia')?.setValue(false);
      this.formaTramite.get('medida_cautelar')?.setValue(false);
      this.existe_violencia_genero= false;
    }
  }

  //LISTADO DE MEDIADORES
  listarCiudadanos(){    
    this.ciudadanoService.listarCiudadanosTodos().
        subscribe(respuesta => {
        this.listCiudadano= respuesta[0];
    
    });
  }
  //FIN LISTADO DE MEDIADORES............................

}
