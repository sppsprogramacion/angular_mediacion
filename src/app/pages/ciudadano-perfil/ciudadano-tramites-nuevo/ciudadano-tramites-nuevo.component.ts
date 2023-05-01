import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/api/appconfig';
import { departamentos, municipios, objetos, opcionSiNo, sexo } from 'src/app/common/data-mokeada';
import { CentroMediacionModel } from 'src/app/models/centro_mediacion.model';
import { CiudadanoModel } from 'src/app/models/ciudadano.model';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { ObjetoModel } from 'src/app/models/objeto.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { TramiteModel } from 'src/app/models/tramite.model';
import { CentrosMediacionService } from 'src/app/service/centros-mediacion.service';
import { CiudadanosService } from 'src/app/service/ciudadanos.service';
import { DataService } from 'src/app/service/data.service';
import { TramitesService } from 'src/app/service/tramites.service';
import Swal from 'sweetalert2';
import { globalConstants } from '../../../common/global-constants';
import { ElementoModel } from 'src/app/models/elemento.model';
import { ConvocadoModel } from '../../../models/convocado.model';

@Component({
  selector: 'app-ciudadano-tramites-nuevo',
  templateUrl: './ciudadano-tramites-nuevo.component.html',
  providers: [MessageService, ConfirmationService,DatePipe],
  styleUrls: ['./ciudadano-tramites-nuevo.component.scss']
})
export class CiudadanoTramitesNuevoComponent implements OnInit {
  config: AppConfig;  
  subscription: Subscription;
  selectedState:any;
  

  msgs: Message[] = []; 

  //listas  
  listaCentrosMediacion: CentroMediacionModel[]=[];
  listaMunicipios: MunicipioModel[] = [];
  listaDepartamentos: DepartamentoModel[] = [];
  listObjetos: ObjetoModel[] = [];
  listSexo: SexoModel[] = [];
  listSiNo: any[] = [];
  listCiudadano: CiudadanoModel[]=[];  

  elementosCentroMediacion: ElementoModel[]=[];

  //variables tramite  
  ciudadanoData: CiudadanoModel;
  formTramiteDialog: boolean= false;
  existe_violencia_genero: boolean = false;

  //FORMULARIOS
  formaTramite: FormGroup;
  formaConvocado: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly datePipe: DatePipe,
    private serviceMensajes: MessageService,
    private centroMediacionService: CentrosMediacionService,
    private ciudadanoService: CiudadanosService,
    private tramiteService: TramitesService,
    public dataService: DataService,
  ) {
    this.formaTramite = this.fb.group({
      //ciudadano_id: [,[]],
      esta_asesorado: [false,[Validators.requiredTrue]],
      departamento_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.min(2)]],      
      municipio_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/),Validators.min(2)]],
      departamento_id_centro: [1,[Validators.required,Validators.pattern(/^[0-9]*$/),Validators.min(2)]],
      centro_mediacion_id: [0,[Validators.required,Validators.pattern(/^[0-9]*$/),Validators.min(1)]],
      localidad_barrio: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      calle_direccion: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],        
      numero_dom: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      objeto_id: [0,[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.min(1)]],
      violencia_genero: [false,[Validators.required]],
      violencia_partes: [false,[Validators.required]],
      existe_denuncia: [false,[Validators.required]],
      medida_cautelar: [false,[Validators.required]],
      pdf_denuncia: [false,[Validators.required]],
      pdf_cautelar: [false,[Validators.required]],
      pdf_ingresos: [false,[Validators.required]],
      pdf_negativa: [false,[Validators.required]],
      modalidad_id: [0,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      variante_id: [0,[Validators.required,Validators.pattern(/^[0-9]*$/)]],     
    
    });

    this.formaConvocado = this.fb.group({
      apellido: ['',[Validators.required, Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      nombre:   ['',[Validators.required, Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      dni: ['',[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.minLength(5)]],
      sexo_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      departamento_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.min(2)]],      
      municipio_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/),Validators.min(2)]],
      codigo_postal: [0,[Validators.required,Validators.pattern(/^[0-9]*$/),Validators.min(1)]],
      localidad_barrio: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      calle_direccion: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],        
      numero_dom: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      punto_referencia: ['',[Validators.required, Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],       
      telefono: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      email: ['',[Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],

    });
  }

  //MENSAJES DE VALIDACIONES
  user_validation_messages = {
    //datos tramite
    'esta_asesorado': [
      { type: 'required', message: 'Debe estar asesorado por un abogado.' }
    ],    
    'departamento_id': [
      { type: 'required', message: 'El departamento es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' },
      { type: 'min', message: 'Debe seleccioanr un departamento.' }
    ],
    'municipio_id': [
      { type: 'required', message: 'El municipio es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' },
      { type: 'min', message: 'Debe seleccioanr un municipio.' }
    ],
    'localidad_barrio': [
        { type: 'required', message: 'La localidad/barrio es requerido.' },
        { type: 'minlength', message: 'La cantidad mínima de caracteres es 1.' },
        { type: 'maxlength', message: 'La cantidad máxima de caracteres es 100.' }
    ],
    'calle_direccion': [
        { type: 'required', message: 'La calle/direccion es requerida' },
        { type: 'minlength', message: 'La cantidad mínima de caracteres es 1.' },
        { type: 'maxlength', message: 'La cantidad máxima de caracteres es 100.' }
    ],
    'numero_dom': [
      { type: 'required', message: 'El número de domicilio es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' }
    ],
    'departamento_id_centro': [
      { type: 'required', message: 'El departamento es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' },
      { type: 'min', message: 'Debe seleccioanr un departamento.' }
    ],
    'centro_mediacion_id': [
      { type: 'required', message: 'El centro de mediación es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' },
      { type: 'min', message: 'Debe seleccioanr un centro de mediación.' }
    ],
    'objeto_id': [
      { type: 'required', message: 'El objeto es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' },
      { type: 'min', message: 'Debe seleccioanr el motivo.' }
    ],
    
    'violencia_genero': [
      { type: 'required', message: 'Debe especificar si existe violencia de genero.' },
    ],
    'violencia_partes': [
      { type: 'required', message: 'Debe especificar si existe violencia entre las partes.' },
    ], 
    'existe_denuncia': [
      { type: 'required', message: 'Debe especificar si existe denuncia.' },
    ],  
    'medida_cautelar': [
      { type: 'required', message: 'Debe especificar si existe medida cautelar.' },
    ],   
    'modalidad_id': [
      { type: 'required', message: 'La modalidad es requerida' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' }
    ],
    'variante_id': [
      { type: 'required', message: 'La variante es requerida' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' }
    ]
    
  }
  //FIN MENSAJES DE VALIDACIONES...............................................................

  //VALIDACIONES DE FORMULARIO
  isValid(campo: string): boolean{     
    
    return this.formaTramite.get(campo)?.invalid && this.formaTramite.get(campo)?.dirty;      
  }

  ngOnInit(): void {
    
    this.ciudadanoData = this.dataService.ciudadanoData

    //CARGA DE LISTADOS DESDE DATA MOKEADA
    this.listObjetos = objetos;
    this.listSexo = sexo;
    this.listSiNo = opcionSiNo;
    this.listaDepartamentos = departamentos;
    this.cargarMunicipios(1);    
    
  }

  //GUARDAR Tramite  
  submitFormTramite(){
    if(this.formaTramite.invalid){                        
        Swal.fire('Formulario incompleto',`Complete correctamente todos los campos del formulario`,"error");
        let fechaAuxiliar = this.datePipe.transform(this.formaTramite.get('fecha_nac')?.value,"yyyy-MM-dd")!;
        console.log("errores formulario", this.formaTramite.controls);
        return Object.values(this.formaTramite.controls).forEach(control => control.markAsDirty());
    }

    let dataTramite: Partial<TramiteModel>;
    
    let data:any;
    data ={
    dataTramite : {
      ciudadano_id: this.ciudadanoData.id_ciudadano,
      esta_asesorado: this.formaTramite.get('esta_asesorado')?.value,
      departamento_id: parseInt(this.formaTramite.get('departamento_id')?.value),
      municipio_id: parseInt(this.formaTramite.get('municipio_id')?.value),
      localidad_barrio: this.formaTramite.get('localidad_barrio')?.value,
      calle_direccion: this.formaTramite.get('calle_direccion')?.value,
      numero_dom: parseInt(this.formaTramite.get('numero_dom')?.value),
      centro_mediacion_id: parseInt(this.formaTramite.get('centro_mediacion_id')?.value),
      objeto_id: parseInt(this.formaTramite.get('objeto_id')?.value),
      violencia_genero: this.formaTramite.get('violencia_genero')?.value,
      violencia_partes: this.formaTramite.get('violencia_genero')?.value,
      existe_denuncia: this.formaTramite.get('existe_denuncia')?.value,
      medida_cautelar: this.formaTramite.get('medida_cautelar')?.value,
      pdf_denuncia: this.formaTramite.get('pdf_denuncia')?.value,
      pdf_cautelar: this.formaTramite.get('pdf_cautelar')?.value,
      pdf_ingresos: this.formaTramite.get('pdf_ingresos')?.value,
      pdf_negativa: this.formaTramite.get('pdf_negativa')?.value,
      // modalidad_id: parseInt(this.formaTramite.get('modalidad_id')?.value),
      // variante_id: parseInt(this.formaTramite.get('variante_id')?.value),
    }
  }
    
    console.log("form tramite", this.formaTramite);
    
    //GUARDAR NUEVO TRAMITE
    this.tramiteService.guardarTramite(data)
      .subscribe({
        next: (resultado) => {
          let tramiteRes: TramiteModel = resultado;
          let dataConvocado: Partial<ConvocadoModel>
          dataConvocado= {
            tramite_numero: tramiteRes.numero_tramite,
            apellido: this.formaConvocado.get('apellido')?.value,
            nombre: this.formaConvocado.get('nombre')?.value,
            dni: parseInt(this.formaConvocado.get('dni')?.value),
            sexo_id: parseInt(this.formaConvocado.get('sexo_id')?.value),
            departamento_id: parseInt(this.formaConvocado.get('departamento_id')?.value),
            municipio_id: parseInt(this.formaConvocado.get('municipio_id')?.value),
            codigo_postal: parseInt(this.formaConvocado.get('codigo_postal')?.value),
            localidad_barrio: this.formaConvocado.get('localidad_barrio')?.value,
            calle_direccion: this.formaConvocado.get('calle_direccion')?.value,        
            numero_dom: parseInt(this.formaConvocado.get('numero_dom')?.value),
            punto_referencia: this.formaConvocado.get('punto_referencia')?.value,
            telefono: this.formaConvocado.get('telefono')?.value,
            email: this.formaConvocado.get('email')?.value,
          }

          Swal.fire('Exito',`La solicitud se registró con exito`,"success");
        },
        error: (err) => {
          Swal.fire('Error',`Error al guardar el tramite: ${err.error.message}`,"error")
        }
      });          
    //FIN GUARDAR NUEVO TRAMITE 
  }    
  //FIN GUARDAR CIUDADANO............................................................

  
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
    this.listaMunicipios=municipios.filter(municipio => {      
      return municipio.id_municipio == 1 || municipio.departamento_id == id_departamento;
    });    
  }

  onChangeDepartamento(){
    const id = this.formaTramite.get('departamento_id')?.value;
    if(id != null){               
        this.cargarMunicipios(parseInt(id.toString()));
        this.formaTramite.get('municipio_id')?.setValue(1);
        
    }
  }

  cargarCentrosMediacion(id_departamento: number){
    this.centroMediacionService.listarCentroMediacionXDepartamento(id_departamento)
      .subscribe({
        next: (respuesta) => {
          this.listaCentrosMediacion= respuesta[0];
          this.elementosCentroMediacion = this.listaCentrosMediacion.map(centro => {
            return {
              clave: centro.id_centro_mediacion,
              value: centro.centro_mediacion + " (municipio: " + centro.municipio.municipio + " - dirección: " + centro.localidad_barrio + " - " + centro.calle_direccion + " - n° " + centro.numero_dom + ")"
              }
          });
          if(this.elementosCentroMediacion.length > 0 ){
            let valueAux: number = this.elementosCentroMediacion[0].clave;        
            this.formaTramite.get('centro_mediacion_id')?.setValue(valueAux);
          }
          else{
            this.formaTramite.get('centro_mediacion_id')?.setValue(0);  
          }
        }     
    });  
  }

  onChangeDepartamentoParaCentros(){
    const id = this.formaTramite.get('departamento_id_centro')?.value;
    if(id != null){               
        this.cargarCentrosMediacion(parseInt(id.toString()));              
        
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
  
}

