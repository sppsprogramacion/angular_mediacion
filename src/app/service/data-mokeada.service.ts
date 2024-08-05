import { Injectable } from '@angular/core';
import { CategoriasService } from './categorias.service';
import { SexoService } from './sexo.service';
import { CategoriaModel } from '../models/categoria.model';
import { SexoModel } from '../models/sexo.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ModalidadModel } from '../models/modalidad.model';
import { ModalidadService } from './modalidad.service';
import { TipoAudienciaModel } from '../models/tipo_audiencia.model';
import { TiposAudienciaService } from './tipos-audiencia.service';
import { ProvinciaModel } from '../models/provincia.model';
import { ProvinciasService } from './provincias.service';
import { ObjetoModel } from '../models/objeto.model';
import { ObjetosService } from './objetos.service';
import { DepartamentosService } from './departamentos.service';
import { DepartamentoModel } from '../models/departamento.model';
import { MunicipioModel } from '../models/municipio.model';
import { MunicipiosService } from './municipios.service';

@Injectable({
  providedIn: 'root'
})
export class DataMokeadaService {

  //LISTAS
  private listCatregorias: CategoriaModel[] = [];
  private listCategoriasSubject: BehaviorSubject<CategoriaModel[]> = new BehaviorSubject<CategoriaModel[]>([]);
  private listDepartamentos: DepartamentoModel[] = [];
  private listDepartamentosSubject: BehaviorSubject<DepartamentoModel[]> = new BehaviorSubject<DepartamentoModel[]>([]);
  private listModalidad: ModalidadModel[] = [];
  private listModalidadSubject: BehaviorSubject<ModalidadModel[]> = new BehaviorSubject<ModalidadModel[]>([]);  
  private listMunicipios: MunicipioModel[] = [];
  private listMunicipiosSubject: BehaviorSubject<MunicipioModel[]> = new BehaviorSubject<MunicipioModel[]>([]); 
  private listObjetos: ObjetoModel[] = [];
  private listObjetosSubject: BehaviorSubject<ObjetoModel[]> = new BehaviorSubject<ObjetoModel[]>([]);
  private listProvincias: ProvinciaModel[] = [];
  private listProvinciasSubject: BehaviorSubject<ProvinciaModel[]> = new BehaviorSubject<ProvinciaModel[]>([]);
  private listSexo: SexoModel[] = [];
  private listSexoSubject: BehaviorSubject<SexoModel[]> = new BehaviorSubject<SexoModel[]>([]);
  private listTiposAudiencia: TipoAudienciaModel[] = [];
  private listTiposAudienciaSubject: BehaviorSubject<TipoAudienciaModel[]> = new BehaviorSubject<TipoAudienciaModel[]>([]);

  
  constructor(
    private categoriasService: CategoriasService,
    private departamentosService: DepartamentosService,
    private modalidadService: ModalidadService,
    private municipiosService: MunicipiosService,
    private objetosService: ObjetosService,
    private provinciasService: ProvinciasService,
    private sexoService: SexoService,
    private tiposAudienciaService: TiposAudienciaService,
  ) { }

  //LISTADO DE CATEGORIAS
  listarCategorias(): Observable<CategoriaModel[]> { 
    if(this.listCatregorias.length == 0) {      
      this.categoriasService.listarCategoriasTodos().
        subscribe(respuesta => {
            this.listCatregorias= respuesta[0];
            this.listCategoriasSubject.next(this.listCatregorias);
            console.log("categorias dentro del metodo");
        });
    }
    return this.listCategoriasSubject.asObservable();
  } 
  //FIN LISTADO DE CATEGORIAS............................

  //LISTADO DE DEPARTAMENTOS
  listarDepartamentos(): Observable<DepartamentoModel[]> { 
    if(this.listDepartamentos.length == 0) {      
      this.departamentosService.listarDepartamentoTodos().
        subscribe(respuesta => {
            this.listDepartamentos= respuesta[0];
            this.listDepartamentosSubject.next(this.listDepartamentos);
            console.log("departamentos dentro del metodo");
        });
    }
    return this.listDepartamentosSubject.asObservable();
  } 
  //FIN LISTADO DE DEPARTAMENTOS............................

  //LISTADO DE MODALIDAD
  listarModalidad(): Observable<ModalidadModel[]> { 
    if(this.listModalidad.length == 0) {      
      this.modalidadService.listarModalidadTodos().
        subscribe(respuesta => {
            this.listModalidad= respuesta[0];
            this.listModalidadSubject.next(this.listModalidad);
            console.log("modalidad dentro del metodo");
        });
    }
    return this.listModalidadSubject.asObservable();
  } 
  //FIN LISTADO DE MODALIDAD............................

  //LISTADO DE MUNICIPIOS
  listarMunicipios(): Observable<MunicipioModel[]> { 
    if(this.listMunicipios.length == 0) {      
      this.municipiosService.listarMuicipioTodos().
        subscribe(respuesta => {
            this.listMunicipios= respuesta[0];
            this.listMunicipiosSubject.next(this.listMunicipios);
        });
    }
    return this.listMunicipiosSubject.asObservable();
  } 
  //FIN LISTADO DE MUNICIPIOS............................

  //LISTADO DE OBJETOS
  listarObjetos(): Observable<ObjetoModel[]> { 
    if(this.listObjetos.length == 0) {      
      this.objetosService.listarObjetoTodos().
        subscribe(respuesta => {
            this.listObjetos= respuesta[0];
            this.listObjetosSubject.next(this.listObjetos);
            console.log("objetos dentro del metodo");
        });
    }
    return this.listObjetosSubject.asObservable();
  } 
  //FIN LISTADO DE OBJETOS............................

  //LISTADO DE PROVINCIAS
  listarProvincias(): Observable<ProvinciaModel[]> { 
    if(this.listProvincias.length == 0) {      
      this.provinciasService.listarProvicicaTodos().
        subscribe(respuesta => {
            this.listProvincias= respuesta[0];
            this.listProvinciasSubject.next(this.listProvincias);
            console.log("provincias dentro del metodo");
        });
    }
    return this.listProvinciasSubject.asObservable();
  } 
  //FIN LISTADO DE PROVINCIAS............................

  //LISTADO DE SEXOS
  listarSexo(): Observable<SexoModel[]> { 
    if(this.listSexo.length == 0) {      
      this.sexoService.listarSexoTodos().
        subscribe(respuesta => {
            this.listSexo= respuesta[0];
            this.listSexoSubject.next(this.listSexo);
            console.log("dentro del metodo");
        });
    }
    return this.listSexoSubject.asObservable();
  } 
  //FIN LISTADO DE SEXOS............................

  //LISTADO DE MODALIDAD
  listarTipoAudiaencia(): Observable<TipoAudienciaModel[]> { 
    if(this.listTiposAudiencia.length == 0) {      
      this.tiposAudienciaService.listarTodos().
        subscribe(respuesta => {
            this.listTiposAudiencia= respuesta[0];
            this.listTiposAudienciaSubject.next(this.listTiposAudiencia);
            console.log("tipoAudiencia dentro del metodo");
        });
    }
    return this.listTiposAudienciaSubject.asObservable();
  } 
  //FIN LISTADO DE MODALIDAD............................

}
