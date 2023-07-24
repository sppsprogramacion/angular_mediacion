import { SexoModel } from './sexo.model';
import { ProvinciaModel } from './provincia.model';
import { DepartamentoModel } from './departamento.model';
import { MunicipioModel } from './municipio.model';
import { TramiteModel } from './tramite.model';
import { CategoriaModel } from './categoria.model';


export class VinculadoModel{
    constructor(
        public id_vinculado?: number,
        public tramite_numero?: number,
        public tramite?: TramiteModel,
        public apellido?: string,
        public nombre?: string,
        public dni?: number,
        public sexo_id?: number,
        public sexo?: SexoModel,    
        public telefono?: string,
        public categoria_id?: number,
        public categoria?: CategoriaModel        

    ){}
}