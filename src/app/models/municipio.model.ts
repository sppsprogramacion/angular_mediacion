import { DepartamentoModel } from './departamento.model';


export class MunicipioModel{
    constructor(
        public id_municipio?: number,
        public municipio?: string,
        public departamento_id?: number,
        public departamento?: DepartamentoModel        

    ){}
}