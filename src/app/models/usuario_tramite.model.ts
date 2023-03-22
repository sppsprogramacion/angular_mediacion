import { FuncionTtramiteModel } from "./funcion_tramite.model";
import { TramiteModel } from './tramite.model';
import { UsuarioModel } from './usuario.model';


export class UsuarioTramiteModel{
    constructor(
        public id_usuario_tramite?: number,
        public tramite_numero?: number,
        public tramite?: TramiteModel,
        public usuario_id?: number,
        public usuario?: UsuarioModel,
        public detalles?: string,
        public funcion_tramite_id?: number,
        public funcion_tramite?: FuncionTtramiteModel,
    ){}
}