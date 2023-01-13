import { SexoModel } from './sexo.model';
import { ProvinciaModel } from './provincia.model';
import { DepartamentoModel } from './departamento.model';
import { MunicipioModel } from './municipio.model';
import { CentroMediacionModel } from './centro_mediacion.model';


export class UsuarioModel{
    constructor(
        public dni?: number,
        public apellido?: string,
        public nombre?: string,    
        public sexo_id?: number,
        public sexo?: SexoModel,   
        public telefono?: string,
        public email?: string,
        public clave?: string,
        public centros_mediacion?: CentroMediacionModel[]

    ){}
}