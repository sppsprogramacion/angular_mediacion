import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    
    menuMode = 'static';

    constructor(
        private primengConfig: PrimeNGConfig,
        //traslate lenguaje
        private config: PrimeNGConfig, private translateService: TranslateService
        
        ) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
        
        //traslate lenguaje
        this.translateService.setDefaultLang('es');    
        this.translate('es');    
    }

    //traslate lenguaje
    translate(lang: string) {
        this.translateService.use(lang);
        this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
    }
   
}
