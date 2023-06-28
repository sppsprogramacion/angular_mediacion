import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/api/appconfig';
import Swal from 'sweetalert2';

import { departamentos, municipios, objetos, opcionSiNo, provincias, sexo } from 'src/app/common/data-mokeada';
import { CentroMediacionModel } from 'src/app/models/centro_mediacion.model';
import { CiudadanoModel } from 'src/app/models/ciudadano.model';
import { ProvinciaModel } from '../../../models/provincia.model';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { ObjetoModel } from 'src/app/models/objeto.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { TramiteModel } from 'src/app/models/tramite.model';
import { CentrosMediacionService } from 'src/app/service/centros-mediacion.service';
import { CiudadanosService } from 'src/app/service/ciudadanos.service';
import { DataService } from 'src/app/service/data.service';
import { TramitesService } from 'src/app/service/tramites.service';
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
  listaProvincias: ProvinciaModel[] = []
  listObjetos: ObjetoModel[] = [];
  listSexo: SexoModel[] = [];
  listSiNo: any[] = [];
  listCiudadano: CiudadanoModel[]=[]; 
  listConvocados: any[]=[]; 
  listConvocadosNoSalta: any[]=[];
  listConvocadosAux: any[]=[]; 

  elementosCentroMediacion: ElementoModel[]=[];

  //modelos 
  ciudadanoData: CiudadanoModel;
  convocado: any;
  convocadoAux: any;

  //variables booleanas 
  formTramiteDialog: boolean = false;
  convocadoTramiteDialog: boolean = false;
  existe_violencia_genero: boolean = false;
  isDatosPersonales: boolean = false;
  isSalta: boolean = false;
  isNoSalta: boolean = false;

  //FORMULARIOS
  formaTramite: FormGroup;
  formaConvocado: FormGroup;
  formaDomicilioSalta: FormGroup;
  formaDomicilioNoSalta: FormGroup;
  formaProvincia: FormGroup;

  posicion: string = "top";


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
    });

    this.formaDomicilioSalta = this.fb.group({      
      departamento_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.min(2)]],      
      municipio_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/),Validators.min(2)]],
      codigo_postal: [,[Validators.required,Validators.pattern(/^[0-9]*$/),Validators.min(1)]],
      localidad_barrio: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      calle_direccion: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],        
      numero_dom: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      punto_referencia: ['',[Validators.required, Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],       
      telefono: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      email: ['',[Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
    });

    this.formaDomicilioNoSalta = this.fb.group({     
      codigo_postal: [,[Validators.required,Validators.pattern(/^[0-9]*$/),Validators.min(1)]],
      telefono: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],      
      email: ['',[Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
    });

    this.formaProvincia = this.fb.group({
      provincia_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.min(2)]],    
    });
  }

  //MENSAJES DE VALIDACIONES
  user_validation_messages = {
    'apellido': [
      { type: 'required', message: 'El apellido es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números, letras y espacios.' },
      { type: 'minlength', message: 'La cantidad mínima de caracteres es 2.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 100.' }
    ],
    'calle_direccion': [
      { type: 'required', message: 'La calle/direccion es requerida' },
      { type: 'minlength', message: 'La cantidad mínima de caracteres es 1.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 100.' }
    ],
    'centro_mediacion_id': [
      { type: 'required', message: 'El centro de mediación es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' },
      { type: 'min', message: 'Debe seleccioanr un centro de mediación.' }
    ],
    'codigo_postal': [
      { type: 'required', message: 'El codigo postal es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' },
      { type: 'min', message: 'El número ingresado debe ser mayor a 0.' }
    ],
    'departamento_id': [
      { type: 'required', message: 'El departamento es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' },
      { type: 'min', message: 'Debe seleccioanr un departamento.' }
    ],
    'departamento_id_centro': [
      { type: 'required', message: 'El departamento es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' },
      { type: 'min', message: 'Debe seleccioanr un departamento.' }
    ],
    'dni': [
      { type: 'required', message: 'El dni es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' },
      { type: 'minlength', message: 'El número ingresado debe tener mas de 5 digitos.' }
    ],
    'email': [
      { type: 'required', message: 'El correo electrónico es requerido' },
      { type: 'pattern', message: 'El formato del correo electrónico no es correcto.' }
    ],
     
    'existe_denuncia': [
      { type: 'required', message: 'Debe especificar si existe denuncia.' },
    ],  
    'localidad_barrio': [
      { type: 'required', message: 'La localidad/barrio es requerido.' },
      { type: 'minlength', message: 'La cantidad mínima de caracteres es 1.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 100.' }
    ],
    'medida_cautelar': [
      { type: 'required', message: 'Debe especificar si existe medida cautelar.' },
    ],   
    'modalidad_id': [
      { type: 'required', message: 'La modalidad es requerida' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' }
    ],
    'municipio_id': [
      { type: 'required', message: 'El municipio es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' },
      { type: 'min', message: 'Debe seleccioanr un municipio.' }
    ],        
    'nombre': [
      { type: 'required', message: 'El nombre es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números, letras y espacios.' },
      { type: 'minlength', message: 'La cantidad mínima de caracteres es 2.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 100.' }
    ],
    'numero_dom': [
      { type: 'required', message: 'El número de domicilio es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' }
    ],
    'objeto_id': [
      { type: 'required', message: 'El objeto es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' },
      { type: 'min', message: 'Debe seleccioanr el motivo.' }
    ],
    'provincia_id': [
      { type: 'required', message: 'La provincia es requerida' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' },
      { type: 'min', message: 'Debe seleccioanr una provincia.' }
    ],
    'punto_referencia': [
      { type: 'required', message: 'El punto de referencia es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números, letras y espacios.' },
      { type: 'minlength', message: 'La cantidad mínima de caracteres es 1.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 100.' }
    ],
    'sexo_id': [
      { type: 'required', message: 'El sexo es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' }
    ],
    'telefono': [
      { type: 'required', message: 'El télefono es requerido.' },
      { type: 'minlength', message: 'La cantidad mínima de caracteres es 1.' },
      { type: 'maxlength', message: 'La cantidad máxima de caracteres es 100.' }
    ],
    'variante_id': [
      { type: 'required', message: 'La variante es requerida' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' }
    ],
    'violencia_genero': [
      { type: 'required', message: 'Debe especificar si existe violencia de genero.' },
    ],
    'violencia_partes': [
      { type: 'required', message: 'Debe especificar si existe violencia entre las partes.' },
    ],
    
    
  }
  //FIN MENSAJES DE VALIDACIONES...............................................................

  //VALIDACIONES DE FORMULARIO
  isValid(campo: string): boolean{     
    
    return this.formaConvocado.get(campo)?.invalid && this.formaConvocado.get(campo)?.touched;      
  }

  isValidDomicilioSalta(campo: string): boolean{     
    
    return this.formaDomicilioSalta.get(campo)?.invalid && this.formaDomicilioSalta.get(campo)?.touched;      
  }

  isValidDomicilioNoSalta(campo: string): boolean{     
    
    return this.formaDomicilioNoSalta.get(campo)?.invalid && this.formaDomicilioNoSalta.get(campo)?.touched;      
  }

  isValidProvincia(campo: string): boolean{     
    
    return this.formaProvincia.get(campo)?.invalid && this.formaProvincia.get(campo)?.touched;      
  }
  //FIN VALIDACIONES DE FORMULARIO...............................................................

  ngOnInit(): void {
    
    this.ciudadanoData = this.dataService.ciudadanoData

    //CARGA DE LISTADOS DESDE DATA MOKEADA
    this.listObjetos = objetos;
    this.listSexo = sexo;
    this.listSiNo = opcionSiNo;
    this.listaProvincias = provincias;
    this.listaDepartamentos = departamentos;
    this.cargarMunicipios(1);    
    
  }
  //FIN ONINIT.................................

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
    },
    createConvocadoSaltaDto: this.listConvocados,
    createConvocadoNoSaltaDto: this.listConvocadosNoSalta,
    createVinculadoTramiteDto:[
      {
          "apellido": "Leguizamon",
          "nombre": "Sebastian",
          "dni": 33505001,
          "sexo_id": 2,
          "telefono": "3874853487",
          "categoria_id": 1
      }
  ]


  }
    
    console.log("form tramite", this.formaTramite);
    
    //GUARDAR NUEVO TRAMITE
    this.tramiteService.guardarTramite(data)
      .subscribe({
        next: (resultado) => {
          let tramiteRes: TramiteModel = resultado;
          

          Swal.fire('Exito',`La solicitud se registró con exito`,"success");
        },
        error: (err) => {
          Swal.fire('Error',`Error al guardar el tramite: ${err.error.message}`,"error")
        }
      });          
    //FIN GUARDAR NUEVO TRAMITE 
  }    
  //FIN GUARDAR Tramite............................................................
  
  //AGREGAR CONVOCADOS
  agregarConvocado(){
    let id_provincia: number = parseInt(this.formaProvincia.get('provincia_id')?.value);
    console.log("id_proncia", id_provincia);
    
    if(id_provincia == 1){

      //VAIDACIONES DE FORMULARIOS
      if(this.formaProvincia.invalid){        
        this.msgs = [];                
        return Object.values(this.formaProvincia.controls).forEach(control => control.markAsTouched());
      }
    }

    if(id_provincia == 18 ){
      //VAIDACIONES DE FORMULARIOS
      if(this.formaConvocado.invalid){        
        this.msgs = [];                
        this.msgs.push({ severity: 'error', summary: 'Datos invalidos', detail: 'Revise los datos personales. ' });
        Object.values(this.formaConvocado.controls).forEach(control => control.markAsTouched());
        //return Object.values(this.formaTramite.controls).forEach(control => control.markAsDirty());
      }
      if(this.formaDomicilioSalta.invalid){           
        this.msgs.push({ severity: 'error', summary: 'Datos invalidos', detail: 'Revise los datos de domicilio salta. ' });
        Object.values(this.formaDomicilioSalta.controls).forEach(control => control.markAsTouched());
        //return Object.values(this.formaTramite.controls).forEach(control => control.markAsDirty());
      }      
      console.log("id_proncia", id_provincia);
      if(this.formaConvocado.invalid || this.formaDomicilioSalta.invalid) return;      
      //FIN VAIDACIONES DE FORMULARIOS...........

      this.convocado = {
        apellido: this.formaConvocado.get('apellido')?.value,
        nombre: this.formaConvocado.get('nombre')?.value,
        dni: parseInt(this.formaConvocado.get('dni')?.value),
        sexo_id: parseInt(this.formaConvocado.get('sexo_id')?.value),
        departamento_id: parseInt(this.formaDomicilioSalta.get('departamento_id')?.value),
        municipio_id: parseInt(this.formaDomicilioSalta.get('municipio_id')?.value),
        codigo_postal: parseInt(this.formaDomicilioSalta.get('codigo_postal')?.value),
        localidad_barrio: this.formaDomicilioSalta.get('localidad_barrio')?.value,
        calle_direccion: this.formaDomicilioSalta.get('calle_direccion')?.value,        
        numero_dom: parseInt(this.formaDomicilioSalta.get('numero_dom')?.value),
        punto_referencia: this.formaDomicilioSalta.get('punto_referencia')?.value,
        telefono: this.formaDomicilioSalta.get('telefono')?.value,
        email: this.formaDomicilioSalta.get('email')?.value,
      }
  
      this.listConvocados.push(this.convocado);
      //ARMAR ARRAY AUXILIAR
      // this.convocadoAux = {
      //   apellido: this.convocado.apellido,
      //   nombre: this.convocado.nombre,
      //   dni: this.convocado.dni,
      //   sexo: aux.nombre,
      //   provincia: parseInt(this.formaProvincia.get('provincia_id')?),
      //   orden_origen: posicion,
      //   posicion: posicion,
      //   tipo: "salta"
      // }

      let posicion: number = 0;      
      for (let aux of this.listConvocados){
        this.convocadoAux = {
          apellido: aux.apellido,
          nombre: aux.nombre,
          dni: aux.dni,
          sexo_id: aux.nombre,
          departamento_id: parseInt(this.formaDomicilioSalta.get('departamento_id')?.value),
          orden_origen: posicion,
          posicion: posicion,
          tipo: "salta"
        }
      }
    }

    if(parseInt(this.formaProvincia.get('provincia_id')?.value) != 18 && id_provincia != 1){
      //VAIDACIONES DE FORMULARIOS
      if(this.formaConvocado.invalid){        
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Datos invalidos', detail: 'Revise los datos personales. ' });
        Object.values(this.formaConvocado.controls).forEach(control => control.markAsTouched());
      }
      if(this.formaDomicilioNoSalta.invalid){     
        this.msgs.push({ severity: 'error', summary: 'Datos invalidos', detail: 'Revise los datos de domicilio. ' });
        Object.values(this.formaDomicilioNoSalta.controls).forEach(control => control.markAsTouched());
        
      }      

      console.log("id_proncia", id_provincia);
      if(this.formaConvocado.invalid || this.formaDomicilioNoSalta.invalid) return;
      //FIN VAIDACIONES DE FORMULARIOS...........      

      this.convocado = {
        apellido: this.formaConvocado.get('apellido')?.value,
        nombre: this.formaConvocado.get('nombre')?.value,
        dni: parseInt(this.formaConvocado.get('dni')?.value),
        sexo_id: parseInt(this.formaConvocado.get('sexo_id')?.value),
        provincia_id: parseInt(this.formaProvincia.get('provincia_id')?.value),        
        codigo_postal: parseInt(this.formaDomicilioNoSalta.get('codigo_postal')?.value),
        telefono: this.formaDomicilioNoSalta.get('telefono')?.value,
        email: this.formaDomicilioNoSalta.get('email')?.value,
      }
  
      this.listConvocadosNoSalta.push(this.convocado);
    }
    
    this.convocado = {};
    console.log("lista convocados", this.listConvocados);
    console.log("lista convocados no salta", this.listConvocadosNoSalta);
  }
  //AGREGAR CONVOCADOS..................................................
  
  clavesValidation(): boolean{
    
    return ((this.formaTramite.get('clave1').value === this.formaTramite.get('clave2').value))?  false: true;
  }

  mostrarDialogTramite(){
    this.formTramiteDialog= true;
  }

  hideDialogTramite(){
    this.formTramiteDialog= false;
  }

  //MANEJO DE FORMULARIO DIALOG
  reiniciarformularios(){
    this.msgs = [];
    this.formaConvocado.reset();  
    this.formaDomicilioSalta.reset();   
    this.formaDomicilioNoSalta.reset(); 
    //Variables de convocados
    this.isSalta = false;
    this.isNoSalta = false;
    this.isDatosPersonales = false;
    //Fin Variables de convocados
  }

  openDialogConvocado() {
    this.convocadoTramiteDialog = true; 
    Object.values(this.formaProvincia.controls).forEach(control => control.markAsUntouched());   
    console.log("formulario reset", this.formaConvocado.controls);
    console.log("formulario domicilio salta", this.formaDomicilioSalta.controls);
    console.log("formulario provincia", this.formaProvincia.controls);
    console.log("formulario domicilio NO salta", this.formaDomicilioNoSalta.controls);
    
    // Object.values(this.formaDomicilioSalta.controls).forEach(control => control.markAsUntouched());
    // Object.values(this.formaDomicilioSalta.controls).forEach(control => control.markAsUntouched());
    // Object.values(this.formaConvocado.controls).forEach(control => control.markAsUntouched());
  }
  
  hideDialogConvocado() {
    //this.elementosUsuarios = [];
    //this.elementosCentroMediacion = [];
    
    //this.formaProvincia.reset(); 
    //this.formaProvincia.get('provincia_id')?.setValue(1);
    //Object.values(this.formaProvincia.controls).forEach(control => control.markAsUntouched());
    this.reiniciarformularios();
    
    console.log("formulario convocado", this.formaConvocado.controls);
    console.log("formulario provincia", this.formaProvincia.controls);
    console.log("formulario domicilio salta", this.formaDomicilioSalta.controls);
    console.log("formulario domicilio NO salta", this.formaDomicilioNoSalta.controls);
    this.convocadoTramiteDialog = false;
    
  }    
  //FIN MANEJO FORMULARIO DIALOG....................................

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
  
  onChangeProvincia(){
    this.reiniciarformularios();
    const id = this.formaProvincia.get('provincia_id')?.value;
    console.log("id provincia", id);
    if(id != null){
        if (id == 18) {
          this.isSalta = true;
          this.isNoSalta = false;
          this.isDatosPersonales = true;
        }
        if (id != 18) {
          this.isSalta = false;
          this.isNoSalta = true;
          this.isDatosPersonales = true;
        }
        if (id == 1) {
          this.isSalta = false;
          this.isNoSalta = false;
          this.isDatosPersonales = false;
        }
    }
  }

  //CARGA DEPARTAMENTOS Y MUNICIPIOS CONVOCADOS
  cargarMunicipiosConvocado(id_departamento: number){
    this.listaMunicipios=municipios.filter(municipio => {      
      return municipio.id_municipio == 1 || municipio.departamento_id == id_departamento;
    });    
  }

  onChangeDepartamentoConvocado(){
    const id = this.formaDomicilioSalta.get('departamento_id')?.value;
    if(id != null){               
        this.cargarMunicipiosConvocado(parseInt(id.toString()));
        this.formaDomicilioSalta.get('municipio_id')?.setValue(1);
        
    }
  }
  //FIN CARGA DEPARTAMENTOS Y MUNICIPIOS CONVOCADOS

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

