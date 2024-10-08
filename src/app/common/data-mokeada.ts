import { CategoriaModel } from "../models/categoria.model";
import { SexoModel } from "../models/sexo.model";
import { CategoriasService } from "../service/categorias.service";

export class DataMokeada {    
    
}


export const opcionSiNo = [
    {
        "id_opcion_sino": false,
        "respuesta_sino": "NO"
    },
    {
        "id_opcion_sino": true,
        "respuesta_sino": "SI"
    },
];

export const tiposBusquedaCiudadano = [
    {
        "id_tipo_busqueda_ciudadano": "dni",
        "tipo_busqueda_ciudadano": "Buscar por DNI"
    },
    {
        "id_tipo_busqueda_ciudadano": "apellido",
        "tipo_busqueda_ciudadano": "Buscar por apellido"
    },
];

export const tiposBusquedaTramites = [
    {
        "id_tipo_busqueda": "dni",
        "tipo_busqueda": "Buscar por DNI"
    },
    {
        "id_tipo_busqueda": "numtramite",
        "tipo_busqueda": "Buscar por numero de tramite"
    },
];



