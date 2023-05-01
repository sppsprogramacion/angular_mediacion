import { SexoModel } from './sexo.model';
import { ProvinciaModel } from './provincia.model';
import { DepartamentoModel } from './departamento.model';
import { MunicipioModel } from './municipio.model';
import { TramiteModel } from './tramite.model';


export class ConvocadoModel{
    constructor(
        public id_convocado?: number,
        public tramite_numero?: number,
        public tramite?: TramiteModel,
        public apellido?: string,
        public nombre?: string,
        public dni?: number,
        public sexo_id?: number,
        public sexo?: SexoModel,    
        public provincia_id?: number,
        public provincia?: ProvinciaModel,
        public departamento_id?: number,
        public departamento?: DepartamentoModel,
        public municipio_id?: number,
        public municipio?: MunicipioModel,
        public codigo_postal?: number,
        public localidad_barrio?: string,
        public calle_direccion?: string,
        public numero_dom?: number,   
        public punto_referencia?: string,
        public telefono?: string,
        public email?: string,

    ){}
}