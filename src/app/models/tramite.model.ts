import { SexoModel } from './sexo.model';
import { ProvinciaModel } from './provincia.model';
import { DepartamentoModel } from './departamento.model';
import { MunicipioModel } from './municipio.model';
import { ObjetoModel } from './objeto.model';
import { ModalidadModel } from './modalidad.model';
import { VarianteModel } from './variante.model';
import { EstadoTramiteModel } from './estado_tramite.model';
import { CiudadanoModel } from './ciudadano.model';
import { UsuarioTramiteModel } from './usuario_tramite.model';
import { CentroMediacionModel } from './centro_mediacion.model';
import { ConvocadoModel } from './convocado.model';
import { VinculadoModel } from './vinculado.model';


export class TramiteModel{
    constructor(
        public id_tramite?: number,
        public numero_tramite?: number,
        public ciudadano_id?: number,
        public ciudadano?: CiudadanoModel,   
        public provincia_id?: number,
        public provincia?: ProvinciaModel,
        public departamento_id?: number,
        public departamento?: DepartamentoModel,
        public municipio_id?: number,
        public municipio?: MunicipioModel,
        public localidad_barrio?: string,
        public calle_direccion?: string,
        public numero_dom?: number,      
        public centro_mediacion_id?: number,
        public centro_mediacion?: CentroMediacionModel,
        public fecha_tramite?: Date,
        public es_expediente?: boolean,
        public expediente?: string,
        public fecha_expediente?: Date,
        public esta_asesorado?: boolean,
        public objeto_id?: number,
        public objeto?: ObjetoModel,
        public violencia_genero?: boolean,
        public violencia_partes?: boolean,
        public existe_denuncia?: boolean,
        public medida_cautelar?: boolean,
        public pdf_denuncia?: boolean,
        public pdf_cautelar?: boolean,
        public pdf_ingresos?: boolean,
        public pdf_negativa?: boolean,
        public modalidad_id?: number,
        public modalidad?: ModalidadModel,
        public variante_id?: number,
        public variante?: VarianteModel,
        public estado_tramite_id?: number,
        public estado_tramite?: EstadoTramiteModel,
        public asignaciones?: UsuarioTramiteModel[],
        public convocados?: ConvocadoModel[],
        public vinculados?: VinculadoModel[],
        public fecha_finalizacion?: Date,
        public observacion_finalizacion?: string
    ){}
}