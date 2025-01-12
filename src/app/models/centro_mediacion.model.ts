import { SexoModel } from './sexo.model';
import { ProvinciaModel } from './provincia.model';
import { DepartamentoModel } from './departamento.model';
import { MunicipioModel } from './municipio.model';


export class CentroMediacionModel{
    constructor(
        public id_centro_mediacion?: number,
        public centro_mediacion?: string,        
        public departamento_id?: number,
        public departamento?: DepartamentoModel,
        public municipio_id?: number,
        public municipio?: MunicipioModel,
        public localidad_barrio?: string,
        public calle_direccion?: string,
        public numero_dom?: number,
        public telefono?: string,
        public email?: string,
        public admin_es_responsable?: boolean,
        public activo?: boolean
        //public clave?: string

    ){}
}