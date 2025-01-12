import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/api/appconfig';
import { opcionSiNo } from 'src/app/common/data-mokeada';
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
import { ElementoModel } from 'src/app/models/elemento.model';
import { DataMokeadaService } from '../../../service/data-mokeada.service';

@Component({
  selector: 'app-tramites-nuevo',
  templateUrl: './tramites-nuevo.component.html',
  providers: [MessageService, ConfirmationService,DatePipe],
  styleUrls: ['./tramites-nuevo.component.scss']
})
export class TramitesNuevoComponent implements OnInit {
  config: AppConfig;  
  subscription: Subscription;
  selectedState:any;
  

  msgs: Message[] = []; 

  //listas  
  listaCentrosMediacion: CentroMediacionModel[]=[];
  listaMunicipios: MunicipioModel[] = [];  
  listMunicipiosCompleto: MunicipioModel[]=[];
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
    private centroMediacionService: CentrosMediacionService,
    private ciudadanoService: CiudadanosService,
    private dataMokeadaService: DataMokeadaService,
    private tramiteService: TramitesService,
    public dataService: DataService,
  ) {
    this.formaTramite = this.fb.group({
      //ciudadano_id: [,[]],
      esta_asesorado: [false,[Validators.requiredTrue]],
      departamento_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],      
      municipio_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      departamento_id_centro: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      centro_mediacion_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      localidad_barrio: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      calle_direccion: [,[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],        
      numero_dom: [,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
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
    
    });
  }

  //MENSAJES DE VALIDACIONES
  user_validation_messages = {
    //datos tramite
    'esta_asesorado': [
      { type: 'requiredTrue', message: 'Debe estar asesorado por un abogado.' }
    ],    
    'departamento_id': [
      { type: 'required', message: 'El departamento es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' }
    ],
    'municipio_id': [
      { type: 'required', message: 'El municipio es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' }
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
    'objeto_id': [
      { type: 'required', message: 'El objeto es requerido' },
      { type: 'pattern', message: 'Solo se pueden ingresar números.' }
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
    
    return this.formaTramite.get(campo)?.invalid && this.formaTramite.get(campo)?.touched;      
  }

  ngOnInit(): void {
    
    this.ciudadanoData = this.dataService.ciudadanoData

    //CARGA DE LISTADOS DESDE DATA MOKEADA

    this.dataMokeadaService.listarDepartamentos().subscribe(departamentos => {
      this.listaDepartamentos = departamentos;
    });

    this.dataMokeadaService.listarMunicipios().subscribe(municipios => {
      this.listMunicipiosCompleto= municipios;
    });

    this.dataMokeadaService.listarObjetos().subscribe(objetos => {
      this.listObjetos = objetos;
    });

    this.dataMokeadaService.listarSexo().subscribe(sexos => {
      this.listSexo = sexos;
    });

    this.listSiNo = opcionSiNo;

    this.cargarMunicipios(1);
    
    this.listarCiudadanos();
  }

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
      //ciudadano_id: parseInt(this.formaTramite.get('ciudadano_id')?.value),
      ciudadano_id: this.ciudadanoData.id_ciudadano,
      esta_asesorado: this.formaTramite.get('esta_asesorado')?.value,
      provincia_id: 18,
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
      modalidad_id: parseInt(this.formaTramite.get('modalidad_id')?.value),
      variante_id: parseInt(this.formaTramite.get('variante_id')?.value),
    }
  }
    
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
    this.listaMunicipios=this.listMunicipiosCompleto.filter(municipio => {      
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

  cargarCentrosMediacion(id_departamento: number){
    this.centroMediacionService.listarCentroMediacionXDepartamento(id_departamento).
      subscribe(respuesta => {
        this.listaCentrosMediacion= respuesta[0];
        this.elementosCentroMediacion = this.listaCentrosMediacion.map(centro => {
          return {
            clave: centro.id_centro_mediacion,
            value: centro.centro_mediacion + " (" + centro.municipio.municipio + " - " + centro.localidad_barrio + " - " + centro.calle_direccion + " " + centro.numero_dom + ")"
            }
        });        
    
    });  
  }

  onChangeDepartamentoParaCentros(){
    const id = this.formaTramite.get('departamento_id_centro')?.value;
    if(id != null){               
        this.cargarCentrosMediacion(parseInt(id.toString()));
        this.formaTramite.get('centro_mediacion_id')?.setValue(1);               
        this.formaTramite.get('centro_mediacion_id')?.markAsUntouched();
        
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
