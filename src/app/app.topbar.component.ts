import { Component, OnDestroy } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { globalConstants } from './common/global-constants';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items: MenuItem[];

    constructor(
        public appMain: AppMainComponent,
        private router: Router
    ) { }

    //IR A REGISTRARME
  irAPrincipal(){
    if(globalConstants.ciudadanoLogin){
        this.router.navigateByUrl("ciudadano/tramites/nuevos");
    }

    if(globalConstants.usuarioLogin && globalConstants.isAdministrador){
        this.router.navigateByUrl("admin/principal");
    }

    if(globalConstants.usuarioLogin && !globalConstants.isAdministrador){
        this.router.navigateByUrl("admin/tramites/nuevoslis")
    }
    
  }
  //FIN IR A REGISTRARME
}
