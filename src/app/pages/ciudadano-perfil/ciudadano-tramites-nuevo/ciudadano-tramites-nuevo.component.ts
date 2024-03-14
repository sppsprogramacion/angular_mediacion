import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/api/appconfig';
import Swal from 'sweetalert2';

//import { categorias, departamentos, municipios, objetos, opcionSiNo, provincias, sexo } from 'src/app/common/data-mokeada';
import { DataMokeada, departamentos, municipios, objetos, opcionSiNo, provincias, sexo } from 'src/app/common/data-mokeada';
import { CentroMediacionModel } from 'src/app/models/centro_mediacion.model';
import { CiudadanoModel } from 'src/app/models/ciudadano.model';
import { ProvinciaModel } from '../../../models/provincia.model';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { ObjetoModel } from 'src/app/models/objeto.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { TramiteModel } from 'src/app/models/tramite.model';
import { CentrosMediacionService } from 'src/app/service/centros-mediacion.service';
import { DataService } from 'src/app/service/data.service';
import { TramitesService } from 'src/app/service/tramites.service';
import { ElementoModel } from 'src/app/models/elemento.model';
import { Router } from '@angular/router';
import { CategoriaModel } from 'src/app/models/categoria.model';

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
  msgsAsesorado: Message[] = []; 
  msgsDatosPersonales: Message[] = []; 
  msgsVinculado: Message[] = [];

  //listas  
  listaCategorias: CategoriaModel[] = [];
  listaCentrosMediacion: CentroMediacionModel[]=[];
  listaDepartamentos: DepartamentoModel[] = [];
  listaDepartamentosConCentros: DepartamentoModel[] = [];
  listaMunicipios: MunicipioModel[] = [];
  listaMunicipiosConvocado: MunicipioModel[] = [];
  listaProvincias: ProvinciaModel[] = []
  listCiudadano: CiudadanoModel[]=[]; 
  listConvocados: any[]=[]; 
  listConvocadosNoSalta: any[]=[];
  listConvocadosAux: any[]=[];   
  listObjetos: ObjetoModel[] = [];
  listSexo: SexoModel[] = [];
  listSiNo: any[] = [];
  listVinculados: any[]=[];
  listVinculadosAux: any[]=[];
  elementosCentroMediacion: ElementoModel[]=[];

  //modelos 
  ciudadanoData: CiudadanoModel;
  convocado: any;
  convocadoAux: any;
  vinculado: any;
  vinculadoAux: any;

  //variables booleanas 
  formTramiteDialog: boolean = false;
  convocadoSaltaDialog: boolean = false;
  convocadoNoSaltaDialog: boolean = false;
  convocadoTramiteDialog: boolean = false;
  vinculadoTramiteDialog: boolean = false;
  existe_violencia_genero: boolean = false;
  estaAsesorado: boolean = false;
  isDatosPersonales: boolean = false;
  isSalta: boolean = false;
  isNoSalta: boolean = false;

  //FORMULARIOS
  formaTramite: FormGroup;
  formaVinculado: FormGroup;
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
    private tramiteService: TramitesService,
    public dataService: DataService,
    private router: Router,
  ) {
    //FORMULARIOS
    this.formaTramite = this.fb.group({
      esta_asesorado: [false,[Validators.requiredTrue]],
      departamento_id: [0,[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.min(2)]],      
      municipio_id: [0,[Validators.required,Validators.pattern(/^[0-9]*$/),Validators.min(2)]],
      departamento_id_centro: [0,[Validators.required,Validators.pattern(/^[0-9]*$/),Validators.min(2)]],
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
      // modalidad_id: [0,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      // variante_id: [0,[Validators.required,Validators.pattern(/^[0-9]*$/)]],     
    
    });

    this.formaConvocado = this.fb.group({
      apellido: ['',[Validators.required, Validators.pattern(/^[A-Za-zñÑ0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      nombre:   ['',[Validators.required, Validators.pattern(/^[A-Za-zñÑ0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      dni: ['',[Validators.pattern(/^[0-9]*$/), Validators.minLength(5)]],
      sexo_id: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],   
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

    this.formaVinculado = this.fb.group({
      apellido: ['',[Validators.required, Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      nombre:   ['',[Validators.required, Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
      dni: ['',[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.minLength(5)]],
      sexo_id: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],   
      telefono: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]], 
      categoria_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
    });
    //FIN FORMULARIOS.....................................................................................
    //....................................................................................................

  }
  //FIN CONSTRUCTOR............................................................................................
  //...........................................................................................................

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
  //FIN MENSAJES DE VALIDACIONES...................................................................
  //..............................................................................................

  //VALIDACIONES DE FORMULARIO
  isValid(campo: string): boolean{     
    
    return this.formaTramite.get(campo)?.invalid && this.formaTramite.get(campo)?.touched;      
  }

  isValidConvocado(campo: string): boolean{     
    
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

  isValidVinculado(campo: string): boolean{     
    
    return this.formaVinculado.get(campo)?.invalid && this.formaVinculado.get(campo)?.touched;      
  }
  //FIN VALIDACIONES DE FORMULARIO.............................................................................
  //...........................................................................................................

  ngOnInit(): void {    
    this.ciudadanoData = this.dataService.ciudadanoData

    this.msgsDatosPersonales = []; 
    this.msgsDatosPersonales.push({ severity: 'warning', detail: 'Debe estar asesordo/a por un abogado antes de iniciar un tramite de mediación.'});

    //CARGA DE LISTADOS DESDE DATA MOKEADA
    this.listaCategorias = DataMokeada.categorias;
    this.listObjetos = objetos;
    this.listSexo = sexo;
    this.listSiNo = opcionSiNo;
    this.listaProvincias = provincias;
    this.listaDepartamentos = departamentos;
    this.cargarDepartamentosconCentroMediacion();
    this.cargarMunicipios(1);        
  }
  //FIN ONINIT................................................................
  //..........................................................................

  //GUARDAR NUEVO TRAMITE  
  submitFormTramite(){
    if(this.formaTramite.invalid){                        
        Swal.fire('Formulario incompleto',`Complete correctamente todos los campos del formulario`,"warning");
        let fechaAuxiliar = this.datePipe.transform(this.formaTramite.get('fecha_nac')?.value,"yyyy-MM-dd")!;
        console.log(this.formaTramite.controls);
        return Object.values(this.formaTramite.controls).forEach(control => control.markAsTouched());
    }
    
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
      createVinculadoTramiteDto: this.listVinculados      
    }
    
    //GUARDAR NUEVO TRAMITE
    this.tramiteService.guardarTramite(data)
      .subscribe({
        next: (resultado) => {
          let tramiteRes: TramiteModel = resultado;
          Swal.fire('Exito',`La solicitud se registró con exito`,"success");
          this.router.navigateByUrl("ciudadano/tramites/nuevos");
        },
        error: (err) => {
          Swal.fire('Error',`Error al guardar el tramite: ${err.error.message}`,"error")
        }
      });          
    //FIN GUARDAR NUEVO TRAMITE 
  }    
  //FIN GUARDAR NUEVO TRAMITE............................................................
  //.....................................................................................
  
  //AGREGAR VINCULADOS
  agregarVinculado(){
    if(this.formaVinculado.invalid){        
      this.msgsVinculado = [];                
      this.msgsVinculado.push({ severity: 'error', summary: 'Datos invalidos', detail: 'Revise los datos personales. ' });
      return Object.values(this.formaVinculado.controls).forEach(control => control.markAsTouched());
    }

    this.vinculado = {
      apellido: this.formaVinculado.get('apellido')?.value,
      nombre: this.formaVinculado.get('nombre')?.value,
      dni: parseInt(this.formaVinculado.get('dni')?.value),
      sexo_id: parseInt(this.formaVinculado.get('sexo_id')?.value),      
      telefono: this.formaVinculado.get('telefono')?.value,
      categoria_id: parseInt(this.formaVinculado.get('categoria_id')?.value),   
    }  
    this.listVinculados.push(this.vinculado);

    //ARMAR ARRAY AUXILIAR
    let sexoAux = sexo.filter(sexo => sexo.id_sexo == this.vinculado.sexo_id);
    this.vinculadoAux = {
      apellido: this.vinculado.apellido,
      nombre: this.vinculado.nombre,
      dni: this.vinculado.dni,
      sexo: sexoAux[0].sexo,
      posicion: (this.listVinculados.length -1)
    }
    this.listVinculadosAux.push(this.vinculadoAux);
    this.vinculado = {};
    this.vinculadoAux = {};
    //FIN ARMAR ARRAY AUXILIAR  

    this.hideDialogVinculado();
  }
  //FIN AGREGAR VINCULADOS
  //.......................................................................

  //AGREGAR CONVOCADOS
  agregarConvocado(){
    let id_provincia: number = parseInt(this.formaProvincia.get('provincia_id')?.value);
    
    //SIN SELECCIONAR PROVINCIA
    if(id_provincia == 1){
      //VAIDACIONES DE FORMULARIOS
      if(this.formaProvincia.invalid){        
        this.msgs = [];                
        return Object.values(this.formaProvincia.controls).forEach(control => control.markAsTouched());
      }
    }
    //FIN SIN SELECCIONAR PROVINCIA
    
    //PARA VERIFICAR SI EL DNI ES VACIO PARA COLOCAR CERO
    let dni_aux: number = 0  
    dni_aux = parseInt(this.formaConvocado.get('dni')?.value)

    if (!dni_aux ) {
      dni_aux = 0;
    }  
    else{
      dni_aux = parseInt(this.formaConvocado.get('dni')?.value)
    }

    //PROVINCIA SALTA SELECCIONADA
    if(id_provincia == 18 ){
      //VAIDACIONES DE FORMULARIOS
      if(this.formaConvocado.invalid){        
        this.msgs = [];                
        this.msgs.push({ severity: 'error', summary: 'Datos invalidos', detail: 'Revise los datos personales. ' });
        Object.values(this.formaConvocado.controls).forEach(control => control.markAsTouched());
      }
      if(this.formaDomicilioSalta.invalid){           
        this.msgs.push({ severity: 'error', summary: 'Datos invalidos', detail: 'Revise los datos de domicilio salta. ' });
        Object.values(this.formaDomicilioSalta.controls).forEach(control => control.markAsTouched());
      }      
      if(this.formaConvocado.invalid || this.formaDomicilioSalta.invalid) return;      
      //FIN VAIDACIONES DE FORMULARIOS
      
      
      this.convocado = {
        apellido: this.formaConvocado.get('apellido')?.value,
        nombre: this.formaConvocado.get('nombre')?.value,
        dni: dni_aux,
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
      let sexoAux = sexo.filter(sexo => sexo.id_sexo == this.convocado.sexo_id);
      let provinciaAux = provincias.filter(provincia => provincia.id_provincia == 18);
      let departamentoAux = departamentos.filter(departamento => departamento.id_departamento == this.convocado.departamento_id);
      let municipioAux = municipios.filter(municipio => municipio.id_municipio == this.convocado.municipio_id);
      
      this.convocadoAux = {
        ...this.convocado,
        sexo: sexoAux[0].sexo,
        provincia: provinciaAux[0].provincia,
        departamento: departamentoAux[0].departamento,
        municipio: municipioAux[0].municipio,      
        tipo: "salta"
      }
      console.log("convocado aux", this.convocadoAux);      
      this.listConvocadosAux.push(this.convocadoAux);

      this.convocado = {};
      this.convocadoAux = {};
      //FIN ARMAR ARRAY AUXILIAR
      
    }
    //PROVINCIA SALTA SELECCIONADA

    //PROVINCIA SELECCIONADA NO ES SALTA
    if(id_provincia != 18 && id_provincia != 1){
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

      if(this.formaConvocado.invalid || this.formaDomicilioNoSalta.invalid) return;
      //FIN VAIDACIONES DE FORMULARIOS...........      

      this.convocado = {
        apellido: this.formaConvocado.get('apellido')?.value,
        nombre: this.formaConvocado.get('nombre')?.value,
        dni: dni_aux,
        sexo_id: parseInt(this.formaConvocado.get('sexo_id')?.value),
        provincia_id: parseInt(this.formaProvincia.get('provincia_id')?.value),        
        codigo_postal: parseInt(this.formaDomicilioNoSalta.get('codigo_postal')?.value),
        telefono: this.formaDomicilioNoSalta.get('telefono')?.value,
        email: this.formaDomicilioNoSalta.get('email')?.value,
      }
  
      this.listConvocadosNoSalta.push(this.convocado);

      let sexoAux = sexo.filter(sexo => sexo.id_sexo == this.convocado.sexo_id);
      let provinciaAux = provincias.filter(provincia => provincia.id_provincia == this.convocado.provincia_id);   
      this.convocadoAux = {
        ...this.convocado,
        sexo: sexoAux[0].sexo,
        provincia: provinciaAux[0].provincia,
        tipo: "noSalta"
      }
      this.listConvocadosAux.push(this.convocadoAux);

      this.convocado = {};
      this.convocadoAux = {};

    }
    
    this.hideDialogConvocado();
  }
  //FIN AGREGAR CONVOCADOS..................................................
  //........................................................................
  
  
  mostrarDialogTramite(){
    this.formTramiteDialog= true;
  }

  hideDialogTramite(){
    this.formTramiteDialog= false;
  }

  //MANEJO DE FORMULARIO DIALOG CONVOCADO
  reiniciarformularios(){
    this.msgsVinculado = [];
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
    
  }
  
  hideDialogConvocado() {    
    this.formaProvincia.reset(); 
    this.formaProvincia.get('provincia_id')?.setValue(1);
    this.reiniciarformularios();
    this.convocadoTramiteDialog = false;
    
  }    
  //FIN MANEJO FORMULARIO DIALOG CONVOCADO....................................

  //MANEJO DE FORMULARIO DIALOG VINCULADO
  reiniciarFormularioVinculado(){
    this.msgs = [];
    this.formaVinculado.reset();  
  }

  openDialogVinculado() {
    this.vinculadoTramiteDialog = true; 
    Object.values(this.formaVinculado.controls).forEach(control => control.markAsUntouched()); 
  }
  
  hideDialogVinculado() {    
    this.formaVinculado.reset();     
    this.reiniciarFormularioVinculado();
    this.vinculadoTramiteDialog = false;    
  }    
  //FIN MANEJO FORMULARIO DIALOG VINCULADO....................................

  //CARGA DEPARTAMENTOS CON CENTRO DE EMDIACION
  cargarDepartamentosconCentroMediacion(){
    this.listaDepartamentosConCentros=departamentos.filter(departamento => {      
      return departamento.tiene_centro_mediacion == true;
    });    
  }
  //FIN CARGA DEPARTAMENTOS CON CENTRO DE EMDIACION

  //CARGA DE DROPDOWN TRAMITES
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
  //FIN CARGA DE DROPDOWN TRAMITES................................
  
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
    this.listaMunicipiosConvocado=municipios.filter(municipio => {      
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
  //FIN CARGA DEPARTAMENTOS Y MUNICIPIOS CONVOCADOS...................

  //CARGA DE DROPDOWN CENTROS DE MEDIACION
  cargarCentrosMediacion(id_departamento: number){
    this.centroMediacionService.listarCentroMediacionXDepartamento(id_departamento)
      .subscribe({
        next: (respuesta) => {
          this.listaCentrosMediacion= respuesta[0];
          this.elementosCentroMediacion = this.listaCentrosMediacion.map(centro => {
            return {
              clave: centro.id_centro_mediacion,
              value: centro.centro_mediacion + " (Municipio: " + centro.municipio.municipio + " - Barrio: " + centro.localidad_barrio + " - Dirección: " + centro.calle_direccion + " - n° " + centro.numero_dom + ")"
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
  //FIN CARGA DE DROPDOWN CENTROS DE MEDIACION......................................

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

  onChangeAsesorado(){
    if(this.formaTramite.get('esta_asesorado')?.value == true){
      Object.values(this.formaTramite.controls).forEach(control => control.markAsUntouched());
      this.estaAsesorado = true;
      
    }
    else{
      this.reiniciarformularios();
      this.reiniciarFormularioVinculado();
      this.formaTramite.reset(); 
      this.formaTramite.get('esta_asesorado')?.setValue(false);
       

      this.estaAsesorado = false;
    }
  }

  //MANEJO DE FORMULARIO DIALOG CONVOCADO
  openDialogVerConvocado(convocado: any) {
        
    if(convocado.tipo === "salta"){

      this.convocadoSaltaDialog = true;  
    }

    if(convocado.tipo === "noSalta"){
      
      this.convocadoNoSaltaDialog = true;  
    }

    this.convocadoAux = convocado;       
  }
  
  
  hideDialogVerConvocado() {
    this.convocadoAux = {};
    this.convocadoSaltaDialog = false;
    this.convocadoNoSaltaDialog = false;
  }    
  //FIN MANEJO FORMULARIO DIALOG CONVOCADO....................................

  //QUITAR CONVOCADO
  quitarConvocado(){

    if (this.convocadoAux.tipo === "salta") {
      
      console.log("Convocado Quitar Salta", this.convocadoAux);
      this.listConvocados = this.listConvocados.filter(convocado => convocado.apellido + convocado.nombre !== this.convocadoAux.apellido + this.convocadoAux.nombre)
      console.log("convocados Salta", this.listConvocados);
    }

    if (this.convocadoAux.tipo === "noSalta") {
      
      console.log("Convocado Quitar No salta", this.convocadoAux.apellido + this.convocadoAux.nombre);
      this.listConvocadosNoSalta = this.listConvocadosNoSalta.filter(convocado => convocado.apellido + convocado.nombre !== this.convocadoAux.apellido + this.convocadoAux.nombre)
      console.log("convocados No Salta", this.listConvocadosNoSalta);
    }    

    console.log("convocado auxiliar", this.convocadoAux);
    this.listConvocadosAux = this.listConvocadosAux.filter(convocado => convocado !== this.convocadoAux)
    console.log("convocados auxiliar", this.listConvocadosAux);

    this.convocadoAux = {};
    this.convocadoSaltaDialog = false;
    this.convocadoNoSaltaDialog = false;
  }
  //FIN QUITAR CONVOCADO

  //IR A REGISTRARME
  irAPrincipal(){
    this.router.navigateByUrl("ciudadano/tramites/nuevos");
  }
  //FIN IR A REGISTRARME
  
}

