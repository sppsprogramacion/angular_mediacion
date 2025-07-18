
export class UsuarioTramiteExcelModel{
    constructor(
        public id_usuario_tramite?: number,
        public detalles?: string,
        public fecha_asignacion?: Date,
        public fecha_sece?: Date,
        public id_funcion_tramite?: number,
        public funcion_tramite?: string,
        public activo?: boolean,
        //tramite
        public numero_tramite?: number,
        public fecha_tramite?: Date,
        public es_expediente?: boolean,
        public expediente?: string,
        public fecha_expediente?: Date,
        public id_objeto?: number,
        public objeto?: string,
        public id_estado_tramite?: number,
        public estado_tramite?: string,        
        public fecha_finalizacion?: Date,
        public observacion_finalizacion?: string,
        //ciudadano
        public id_ciudadano?: number,
        public dni_ciudadano?: number,
        public apellido_ciudadano?: string,
        public nombre_ciudadano?: string,
        public id_sexo_ciudadano?: number,
        public sexo_ciudadano?: string,
        //usuario
        public id_usuario?: number,
        public dni_usuario?: number,
        public apellido_usuario?: string,
        public nombre_usuario?: string,

    ){}
}