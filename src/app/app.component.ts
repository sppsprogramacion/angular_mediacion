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
    //temporal
    ciudadano: CiudadanoModel=new CiudadanoModel;
    listCiudadanos: CiudadanoModel[]=[];
    listUsuarios: UsuarioModel[]=[];



    menuMode = 'static';

    constructor(private primengConfig: PrimeNGConfig,
        private ciudadanoService: CiudadanosService,
        private usuarioService: UsuariosService,
        ) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';


         //temporal
        this.listarCiudadanos();
        this.listarUsuarios();
        console.log("lista ciudadanos menu", this.listCiudadanos);
        console.log("lista usuarios menu", this.listUsuarios);
    }


    //TEMPORAL
    //CARGA DE LISTADOS DROP
    async listarCiudadanos(){    
        await this.ciudadanoService.listarCiudadanosTodos().
            subscribe(respuesta => {
            this.listCiudadanos= respuesta[0];
        });
    }

    listarUsuarios(){    
        this.ciudadanoService.listarCiudadanosTodos().
            subscribe(respuesta => {
            this.listCiudadanos= respuesta[0];
        });
    }
}
