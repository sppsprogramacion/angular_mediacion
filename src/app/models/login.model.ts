import { SexoModel } from './sexo.model';
import { ProvinciaModel } from './provincia.model';
import { DepartamentoModel } from './departamento.model';
import { MunicipioModel } from './municipio.model';


export class LoginModel{
    constructor(
        public dni?: number,
        public clave?: string,
    ){}
}