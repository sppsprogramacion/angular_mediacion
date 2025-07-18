export class AudienciaExcelModel{
    constructor(
        public id_audiencia?: number,
        public num_audiencia?: number,
        public tramite_numero?: number,
        public detalles?: string,
        public fecha_inicio?: Date,
        public hora_inicio?: Date,
        public hora_fin?: Date,
        public fecha_creacion?: Date,
        public esta_cerrada?: boolean,
        public id_tipo_audiencia?: number,
        public tipo_audiencia?: string,
        public id_modalidad?: number,
        public modalidad?: string,
        public id_centro_mediacion?: number,
        public centro_mediacion?: string,        
        public id_departamento_centro?: number,
        public departamento_centro?: string,
        public id_municipio_centro?: number,
        public municipio_centro?: string,        
        public id_resultado_audiencia?: number,
        public resultado_audiencia?: string,
        public observacion_resultado?: string,
        //
        
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