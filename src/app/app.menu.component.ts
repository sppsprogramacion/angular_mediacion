import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { globalConstants } from './common/global-constants';
import { CiudadanoModel } from './models/ciudadano.model';
import { DataService } from './service/data.service';
import { AuthService } from './service/auth.service';

@Component({
    selector: 'app-menu',
    template: `
        <div class="layout-menu-container">
            <h5 class="block text-blue-600 mb-4">
                <span>
                    <img src="assets/imagenes/iconos/user-icon.png" height="30" style="vertical-align: middle;"/>
                    {{ nombre_completo }}
                </span>
            </h5>
            <ul class="layout-menu" role="menu" (keydown)="onKeydown($event)">
                <li app-menu class="layout-menuitem-category" *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true" role="none">
                    <div class="layout-menuitem-root-text" [attr.aria-label]="item.label">{{item.label}}</div>
                    <ul role="menu">
                        <li app-menuitem *ngFor="let child of item.items" [item]="child" [index]="i" role="none"></li>
                    </ul>
                </li>
                <div>
                    <img src="assets/imagenes/general/logo-gobierno-salta.png" alt="Prime Blocks" class="w-full mt-5"/>
                </div>
            </ul>
        </div>
    `
})
export class AppMenuComponent implements OnInit {

    model: any[];
    nombre_completo: string;
    ciudadano: CiudadanoModel;

    constructor(
        public appMain: AppMainComponent, 
        readonly  dataService: DataService,
        readonly authService: AuthService
        ) { }

    ngOnInit() {        

        //MENU CIUDADANO
        if(this.authService.currentCiudadanoLogin){
            this.nombre_completo = this.authService.currentCiudadanoLogin.apellido + " " + this.authService.currentCiudadanoLogin.nombre;
            this.model = [                
                {
                    label: 'Tramites',
                    items: [
                        {label: 'Nuevos', icon: 'pi pi-fw pi-bookmark', routerLink: ['/ciudadano/tramites/nuevos']},                        
                        {label: 'Finalizados', icon: 'pi pi-fw pi-check-square', routerLink: ['/ciudadano/tramites/finalizados']},                    
                    ]
                },
                {
                    label: 'Mi perfil',
                    items: [
                        {label: 'Datos Personales', icon: 'pi pi-id-card', routerLink: ['/ciudadano/datospersonales']},
                        {label: 'Cambiar contraseña', icon: 'pi pi-circle', routerLink: ['/ciudadano/cambiarcontrasenia']},
                        
                    ]
                },
                {
                    label: 'Salir',
                    items: [
                        {label: 'Cerrar sesión', icon: 'pi pi-sign-out', routerLink: ['/login'] },
                        
                    ]
                },
            ]
        }
        //FIN MENU CIUDADANO.........................................................

        //MENU MEDIADOR
        if(this.authService.currentUserLogin && this.authService.currentUserLogin.rol_id == "mediador"){
            
            this.nombre_completo = this.authService.currentUserLogin.apellido + " " + this.authService.currentUserLogin.nombre;
            this.model = [                
                {
                    label: 'Tramites',
                    items: [
                        {label: 'Nuevos', icon: 'pi pi-fw pi-bookmark', routerLink: ['/admin/tramites/nuevoslis']},
                        {label: 'Asignados mediador', icon: 'pi pi-fw pi-send', routerLink: ['/admin/tramites/asignados']},
                        {label: 'Finalizados', icon: 'pi pi-fw pi-check-square', routerLink: ['/admin/tramites/finalizados']},                    
                    ]
                },
                {
                    label: 'Ciudadanos',
                    items: [
                        {label: 'Buscar ciudadano', icon: 'pi pi-search', routerLink: ['/admin/ciudadanos/buscar']},                        
                    ]
                },
                {
                    label: 'Mi perfil',
                    items: [
                        {label: 'Datos Personales', icon: 'pi pi-id-card', routerLink: ['/admin/miperfil/datospersonales']},
                        {label: 'Cambiar contraseña', icon: 'pi pi-circle', routerLink: ['/admin/miperfil/cambiarcontrasenia']},
                        
                    ]
                },
                {
                    label: 'Salir',
                    items: [
                        {label: 'Cerrar sesión', icon: 'pi pi-sign-out', routerLink: ['/login-admin-mediacion']},
                            
                    ]
                },
            ]
        }
        //FIN MENU MEDIADOR..........................................................

        //MENU ADMINISTRADOR
        if(this.authService.currentUserLogin && (this.authService.currentUserLogin.rol_id == "administrador" || this.authService.currentUserLogin.rol_id == "supervisor")) {
            this.nombre_completo = this.authService.currentUserLogin.apellido + " " + this.authService.currentUserLogin.nombre;
            this.model = [
                {
                    label: 'Home',
                    items:[
                        {label: 'Principal',icon: 'pi pi-fw pi-home', routerLink: ['/admin/principal']}
                    ]
                },
                {
                    label: 'Tramites',
                    items: [
                        {label: 'Nuevos', icon: 'pi pi-fw pi-bookmark', routerLink: ['/admin/tramites/nuevoslis']},
                        {label: 'Asignados mediador', icon: 'pi pi-fw pi-send', routerLink: ['/admin/tramites/asignados']},
                        {label: 'Finalizados', icon: 'pi pi-fw pi-check-square', routerLink: ['/admin/tramites/finalizados']},                    
                    ]
                },
                {
                    label: 'Ciudadanos admin',
                    items: [
                        {label: 'Ver ciudadanos', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/ciudadanos/buscar']}
                    ]
                }, 
                {
                    label: 'Usuarios Admin',
                    items: [
                        {label: 'Ver usuarios', icon: 'pi pi-fw pi-user', routerLink: ['/admin/usuarios/lista']}
                    ]
                },            
                {
                    label: 'Centros Mediacion admin',
                    items: [
                        {label: 'Ver centros de mediacion', icon: 'pi pi-fw pi-building', routerLink: ['/admin/centro-mediacion/lista']}
                    ]
                }, 
                {
                    label: 'Departamentos',
                    items: [
                        {label: 'Ver departamentos', icon: 'pi pi-fw pi-star', routerLink: ['/admin/departamentos/lista']}
                    ]
                },   
                {
                    label: 'Categorias',
                    items: [
                        {label: 'Ver categorias', icon: 'pi pi-fw pi-star', routerLink: ['/admin/categoria/lista']}
                    ]
                },   
                {
                    label: 'Objetos',
                    items: [
                        {label: 'Ver objetos', icon: 'pi pi-fw pi-star', routerLink: ['/admin/objetos']}
                    ]
                },  
                {
                    label: 'Salir',
                    items: [
                        {label: 'Cerrar sesión', icon: 'pi pi-sign-out', routerLink: ['/login-admin-mediacion']},
                    ]
                },
                                
            ];

        }
        //FIN MENU ADMINISTRADOR..................................

        

        //MENU ADMINISTRADOR CUENTAS
        if(this.authService.currentUserLogin && this.authService.currentUserLogin.rol_id == "admincuentas") {
            this.nombre_completo = this.authService.currentUserLogin.apellido + " " + this.authService.currentUserLogin.nombre;
            this.model = [
                
                {
                    label: 'Usuarios Admin',
                    items: [
                        {label: 'Ver usuarios', icon: 'pi pi-fw pi-user', routerLink: ['/admin/usuarios/lista']}
                    ]
                },     
                {
                    label: 'Mi perfil',
                    items: [
                        {label: 'Datos Personales', icon: 'pi pi-id-card', routerLink: ['/admin/miperfil/datospersonales']},
                        {label: 'Cambiar contraseña', icon: 'pi pi-circle', routerLink: ['/admin/miperfil/cambiarcontrasenia']},
                        
                    ]
                },
                {
                    label: 'Salir',
                    items: [
                        {label: 'Cerrar sesión', icon: 'pi pi-sign-out', routerLink: ['/login-admin-mediacion']},
                    ]
                },
                
            ];

        }
        //FIN MENU ADMINISTRADOR CUENTAS..................................
    }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = (<HTMLDivElement> event.target);
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }
}
