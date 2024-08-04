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
        
        
        
    }

    //CONFIGURACION DE LENGUAJE
    //traslate lenguaje
    translate(lang: string) {
        this.translateService.use(lang);
        this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
    }

    //
    

    
   
}
