import { Injectable } from '@angular/core';
import { CategoriasService } from './categorias.service';
import { SexoService } from './sexo.service';
import { DataMokeada } from '../common/data-mokeada';
import { CategoriaModel } from '../models/categoria.model';
import { SexoModel } from '../models/sexo.model';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class DataMokeadaService {

  //LISTAS
  listCatregorias: CategoriaModel[] = [];
  listSexo: SexoModel[] = [];
  
  constructor(
    private categoriasService: CategoriasService,
    private sexoService: SexoService
  ) { }

  //LISTADO DE CATEGORIAS
  listarSexo(): SexoModel[]{ 
    if(DataMokeada.sexos.length == 0) {
      this.sexoService.listarSexoTodos().
          subscribe(respuesta => {
              this.listSexo= respuesta[0];
              DataMokeada.sexos = this.listSexo;
              return DataMokeada.sexos;
          });
    }
    return DataMokeada.sexos;
  }
    
    
//FIN LISTADO DE CATEGORIAS............................

}
