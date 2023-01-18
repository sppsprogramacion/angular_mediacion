
import { CentroMediacionModel } from './centro_mediacion.model';
import { UsuarioModel } from './usuario.model';


export class UsuarioCentroModel{
    constructor(
        public id_usuario_centro?: number,      
        public centro_mediacion_id?: number,
        public centro_mediacion?: CentroMediacionModel,
        public dni_usuario?: number,
        public usuario?: UsuarioModel,
        public detalles?: string,
        public fecha_designacion?: Date,
        public activo?: boolean

    ){}
}