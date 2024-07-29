import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { CategoriasService } from './service/categorias.service';
import { CategoriaModel } from './models/categoria.model';
import { DataMokeada } from './common/data-mokeada';
import { AuthService } from './service/auth.service';
import { SexoService } from './service/sexo.service';
import { SexoModel } from './models/sexo.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {

    //LISTAS
    listCatregorias: CategoriaModel[] = [];
    listSexo: SexoModel[] = [];
    
    menuMode = 'static';

    constructor(
        private primengConfig: PrimeNGConfig,
        //traslate lenguaje
        private config: PrimeNGConfig, private translateService: TranslateService,
        //personales
        private authService: AuthService,
        private categoriasService: CategoriasService,
        private sexoService: SexoService
        
        ) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
        
        //traslate lenguaje
        this.translateService.setDefaultLang('es');    
        this.translate('es');          
        
        //AUTENTICAR USUARIO
        // this.authService.checkAutenticationUsuario()
        //     .subscribe( () => {
        //         console.log("Autenticado");
        //     })

        //INICIALIZACION DE DATA-MOKEADA
        this.listarCategorias();
        //this.listarSexo();
    }

    //CONFIGURACION DE LENGUAJE
    //traslate lenguaje
    translate(lang: string) {
        this.translateService.use(lang);
        this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
    }

    //
    //LISTADO DE CATEGORIAS
    listarCategorias(){    
    this.categoriasService.listarCategoriasTodos().
        subscribe(respuesta => {
            this.listCatregorias= respuesta[0];
            DataMokeada.categorias = this.listCatregorias;
        });
    }
    //FIN LISTADO DE CATEGORIAS............................

    //LISTADO DE CATEGORIAS
    listarSexo(){    
        this.sexoService.listarSexoTodos().
            subscribe(respuesta => {
                this.listSexo= respuesta[0];
                DataMokeada.sexos = this.listSexo;
            });
        }
    //FIN LISTADO DE CATEGORIAS............................
   
}
