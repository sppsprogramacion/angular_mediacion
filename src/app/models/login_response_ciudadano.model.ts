
import { CiudadanoModel } from './ciudadano.model';
import { UsuarioModel } from './usuario.model';


export class LoginResponseCiudadanoModel{
    constructor(
        public ciudadano?: CiudadanoModel,
        public token?: string        

    ){}
}