import { SexoModel } from './sexo.model';
import { ProvinciaModel } from './provincia.model';
import { DepartamentoModel } from './departamento.model';
import { MunicipioModel } from './municipio.model';
import { TramiteModel } from './tramite.model';
import { TipoAudienciaModel } from './tipo_audiencia.model';
import { ModalidadModel } from './modalidad.model';
import { CentroMediacionModel } from './centro_mediacion.model';
import { ResultadoAudienciaModel } from './resultadoAudiencia.model';


export class AudienciaModel{
    constructor(
        public id_audiencia?: number,
        public num_audiencia?: number,
        public tramite_numero?: number,
        public tramite?: TramiteModel,
        public detalles?: string,
        public fecha_inicio?: Date,
        public hora_inicio?: Date,
        public hora_fin?: Date,
        public fecha_creacion?: Date,
        public esta_cerrada?: boolean,
        public tipo_audiencia_id?: number,
        public tipo_audiencia?: TipoAudienciaModel,
        public modalidad_id?: number,
        public modalidad?: ModalidadModel,
        public centro_mediacion_id?: number,
        public centro_mediacion?: CentroMediacionModel,
        public usuario_id?: number,
        public usuario?: CentroMediacionModel,
        public resultado_audiencia_id?: number,
        public resultado_audiencia?: ResultadoAudienciaModel,
        public observacion_resultado?: string


    ){}
}