import { SexoModel } from './sexo.model';
import { ProvinciaModel } from './provincia.model';
import { DepartamentoModel } from './departamento.model';
import { MunicipioModel } from './municipio.model';


export class CiudadanoModel{
    constructor(
        public dni?: number,
        public apellido?: string,
        public nombre?: string,
        public sexo_id?: number,
        public sexo?: SexoModel,
        public provincia_id?: number,
        public provincia?: ProvinciaModel,
        public departamento_id?: number,
        public departamento?: DepartamentoModel,
        public municipio_id?: number,
        public municipio?: MunicipioModel,
        public localidad_barrio?: string,
        public calle_direccion?: string,
        public numero_dom?: number,
        public telefono?: string,
        public fecha_nac?: Date,
        public email?: string,
        public clave?: string,
        //public clave?: string

    ){}
}