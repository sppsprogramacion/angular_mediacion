
import { UsuarioModel } from './usuario.model';


export class LoginResponseUsuarioModel{
    constructor(
        public usuario?: UsuarioModel,
        public token?: string        

    ){}
}