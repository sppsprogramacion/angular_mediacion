import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { CiudadanoModel } from './models/ciudadano.model';
import { UsuarioModel } from './models/usuario.model';
import { CiudadanosService } from './service/ciudadanos.service';
import { UsuariosService } from './service/usuarios.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    
    menuMode = 'static';

    constructor(private primengConfig: PrimeNGConfig,
        
        ) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';


        
    }
   
}
