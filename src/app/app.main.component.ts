import { Component, AfterViewInit, OnDestroy, Renderer2, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AppComponent } from './app.component';
import { ConfigService } from './service/app.config.service';
import { AppConfig } from './api/appconfig';
import { Subscription } from 'rxjs';
import { CiudadanosService } from './service/ciudadanos.service';
import { UsuariosService } from './service/usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CiudadanoModel } from './models/ciudadano.model';
import { UsuarioModel } from './models/usuario.model';
import { globalConstants } from './common/global-constants';

@Component({
    selector: 'app-main',
    templateUrl: './app.main.component.html',
    providers: [CiudadanosService, UsuariosService] ,
    animations: [
        trigger('submenu', [
            state('hidden', style({
                height: '0px'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppMainComponent implements AfterViewInit, OnDestroy, OnInit {
    //temporal
    ciudadano: CiudadanoModel=new CiudadanoModel;
    listCiudadanos: CiudadanoModel[]=[];
    listUsuarios: UsuarioModel[]=[];


    //FORMULARIOS
    formaCiudadano: FormGroup;
    formaUsuario: FormGroup;

    //fin temporal


    public menuInactiveDesktop: boolean;

    public menuActiveMobile: boolean;

    public overlayMenuActive: boolean;

    public staticMenuInactive: boolean = false;

    public profileActive: boolean;

    public topMenuActive: boolean;

    public topMenuLeaving: boolean;

    public theme: string;

    documentClickListener: () => void;

    menuClick: boolean;

    topMenuButtonClick: boolean;

    configActive: boolean;

    configClick: boolean;

    config: AppConfig;

    subscription: Subscription;
    
    constructor(public renderer: Renderer2, public app: AppComponent, public configService: ConfigService,
        private ciudadanoService: CiudadanosService,
        private usuarioService: UsuariosService,
        private fb: FormBuilder
        ) { 

            //FORMULARIO CIUDADANOE    
            this.formaCiudadano = this.fb.group({
                dni_ciudadano: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]]               
               
            });
            //FIN FORMULARIO CIUDADANO

            //FORMULARIO CIUDADANOE    
            this.formaUsuario = this.fb.group({
                dni_usuario: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]]               
               
            });
            //FIN FORMULARIO CIUDADANO
        }

    ngOnInit() {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => this.config = config);

        //temporal
        // this.listarCiudadanos();
        // this.listarUsuarios();

        console.log("lista ciudadanos menu", this.listCiudadanos);
        console.log("lista usuarios menu", this.listUsuarios);
    }

    ngAfterViewInit() {
        // hides the overlay menu and top menu if outside is clicked
        this.documentClickListener = this.renderer.listen('body', 'click', (event) => {
            if (!this.isDesktop()) {
                if (!this.menuClick) {
                    this.menuActiveMobile = false;
                }

                if (!this.topMenuButtonClick) {
                    this.hideTopMenu();
                }
            }
            else {
                if (!this.menuClick && this.isOverlay()) {
                    this.menuInactiveDesktop = true;
                }
                if (!this.menuClick){
                    this.overlayMenuActive = false;
                }
            }

            if (this.configActive && !this.configClick) {
                this.configActive = false;
            }

            this.configClick = false;
            this.menuClick = false;
            this.topMenuButtonClick = false;
        });
    }

    toggleMenu(event: Event) {
        this.menuClick = true;

        if (this.isDesktop()) {
            if (this.app.menuMode === 'overlay') {
                if(this.menuActiveMobile === true) {
                    this.overlayMenuActive = true;
                }

                this.overlayMenuActive = !this.overlayMenuActive;
                this.menuActiveMobile = false;
            }
            else if (this.app.menuMode === 'static') {
                this.staticMenuInactive = !this.staticMenuInactive;
            }
        }
        else {
            this.menuActiveMobile = !this.menuActiveMobile;
            this.topMenuActive = false;
        }

        event.preventDefault();
    }

    toggleProfile(event: Event) {
        this.profileActive = !this.profileActive;
        event.preventDefault();
    }

    toggleTopMenu(event: Event) {
        this.topMenuButtonClick = true;
        this.menuActiveMobile = false;

        if (this.topMenuActive) {
            this.hideTopMenu();
        } else {
            this.topMenuActive = true;
        }

        event.preventDefault();
    }

    hideTopMenu() {
        this.topMenuLeaving = true;
        setTimeout(() => {
            this.topMenuActive = false;
            this.topMenuLeaving = false;
        }, 1);
    }

    onMenuClick() {
        this.menuClick = true;
    }

    onConfigClick(event) {
        this.configClick = true;
    }

    isStatic() {
        return this.app.menuMode === 'static';
    }

    isOverlay() {
        return this.app.menuMode === 'overlay';
    }

    isDesktop() {
        return window.innerWidth > 992;
    }

    isMobile(){
        return window.innerWidth < 1024;
    }

    onSearchClick() {
        this.topMenuButtonClick = true;
    }

    ngOnDestroy() {
        if (this.documentClickListener) {
            this.documentClickListener();
        }


        if (this.subscription) {
            this.subscription.unsubscribe();
        }
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

    guardarCiudadano(){
        //TEMPORAL BUSQUEDA DEL CIUDADANO
        this.ciudadanoService.buscarXDni(this.formaCiudadano.get('dni_ciudadano')?.value).
            subscribe(respuesta => {
            globalConstants.ciudadano = respuesta[0];
            
        
        });
        //FIN TEMPORAL BUSQUEDA DEL CIUDADANO
    }
}
