import { Component, OnDestroy } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { globalConstants } from './common/global-constants';
import { AuthService } from './service/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items: MenuItem[];

    constructor(
        public appMain: AppMainComponent,
        private router: Router,

        private authService: AuthService
    ) { }

    //IR A REGISTRARME
  irAPrincipal(){
    if(this.authService.currentCiudadanoLogin){
        this.router.navigateByUrl("ciudadano/tramites/nuevos");
    }

    if(this.authService.currentUserLogin && this.authService.currentUserLogin.rol_id == "administrador"){
        this.router.navigateByUrl("admin/principal");
    }

    if(this.authService.currentUserLogin && this.authService.currentUserLogin.rol_id != "administrador"){
        this.router.navigateByUrl("admin/tramites/nuevoslis")
    }
    
  }
  //FIN IR A REGISTRARME
}
