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


export class TramiteExcelModel{
    constructor(
        public id_tramite?: number,
        public numero_tramite?: number,
        public id_ciudadano?: number,
        public dni?: number,
        public apellido?: string,
        public nombre?: string,
        public id_sexo?: number,
        public sexo?: string,      
        public telefono?: string,
        public fecha_nac?: Date,
        public email?: string,  
        public id_provincia?: number,
        public provincia?: string,
        public id_departamento?: number,
        public departamento?: string,
        public id_municipio?: number,
        public municipio?: string,
        public localidad_barrio?: string,
        public calle_direccion?: string,
        public numero_dom?: number,      
        public id_centro_mediacion?: number,
        public centro_mediacion?: string,        
        public id_departamento_centro?: number,
        public departamento_centro?: string,
        public id_municipio_centro?: number,
        public municipio_centro?: string,
        public fecha_tramite?: Date,
        public es_expediente?: boolean,
        public expediente?: string,
        public fecha_expediente?: Date,
        public esta_asesorado?: boolean,
        public id_objeto?: number,
        public objeto?: string,
        public violencia_genero?: boolean,
        public violencia_partes?: boolean,
        public existe_denuncia?: boolean,
        public medida_cautelar?: boolean,        
        public id_modalidad?: number,
        public modalidad?: string,
        public id_variante?: number,
        public variante?: string,
        public id_estado_tramite?: number,
        public estado_tramite?: string,        
        public fecha_finalizacion?: Date,
        public observacion_finalizacion?: string
    ){}
}