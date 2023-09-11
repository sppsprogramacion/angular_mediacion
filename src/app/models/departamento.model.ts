import { ProvinciaModel } from './provincia.model';


export class DepartamentoModel{
    constructor(
        public id_departamento?: number,
        public departamento?: string,
        public provincia_id?: number,
        public provincia?: ProvinciaModel,
        public tiene_centro_mediacion?: boolean,
        

    ){}
}