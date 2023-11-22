import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { CategoriasService } from './service/categorias.service';
import { CategoriaModel } from './models/categoria.model';
import { DataMokeada } from './common/data-mokeada';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {

    //LISTAS
    listCatregorias: CategoriaModel[] = [];
    
    menuMode = 'static';

    constructor(
        private primengConfig: PrimeNGConfig,
        //traslate lenguaje
        private config: PrimeNGConfig, private translateService: TranslateService,
        private categoriasService: CategoriasService,
        
        ) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
        
        //traslate lenguaje
        this.translateService.setDefaultLang('es');    
        this.translate('es');  
        
        //INICIALIZACION DE DATA-MOKEADA
        this.listarCategorias();
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
   
}
