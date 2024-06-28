import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CiudadanosListaComponent } from './ciudadanos/ciudadanos-lista/ciudadanos-lista.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TramitesPrincipalComponent } from './tramites-administrador/tramites-principal/tramites-principal.component';
import { TramitesFinalizadosComponent } from './tramites-administrador/tramites-finalizados/tramites-finalizados.component';
import { TramitesNuevoComponent } from './tramites-administrador/tramites-nuevo/tramites-nuevo.component';
import { TramitesAsignadosComponent } from './tramites-administrador/tramites-asignados/tramites-asignados.component';
import { TramitesNuevoslisComponent } from './tramites-administrador/tramites-nuevoslis/tramites-nuevoslis.component';
import { DropdownModule } from 'primeng/dropdown';
import { TramitesUsuarioAsignadosComponent } from './tramites-usuario/tramites-usuario-asignados/tramites-usuario-asignados.component';
import { TramitesUsuarioFinalizadosComponent } from './tramites-usuario/tramites-usuario-finalizados/tramites-usuario-finalizados.component';
import { TramitesAdministrarComponent } from './tramites-administrador/tramites-administrar/tramites-administrar.component';
import { UsuariosListaComponent } from './usuarios/usuarios-lista/usuarios-lista.component';
//import { UsuariosAdministrarComponent } from './usuarios/usuarios-administrar/usuarios-administrar.component';
import { CalendarModule } from 'primeng/calendar';
import { PasswordModule } from 'primeng/password';
import { BrowserModule } from '@angular/platform-browser';
import { TramitesUsuarioAdministrarComponent } from './tramites-usuario/tramites-usuario-administrar/tramites-usuario-administrar.component';
import { CiudadanosAdministrarComponent } from './ciudadanos/ciudadanos-administrar/ciudadanos-administrar.component';
import { CentroAdministrarComponent } from './centros-mediacion/centro-administrar/centro-mediacion-administrar.component';
import { CentrosMediacionListaComponent } from './centros-mediacion/centros-lista/centros-mediacion-lista.component';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { CardModule } from 'primeng/card';
import { CategoriaAdministrarComponent } from './categorias/categoria-administrar/categoria-administrar.component';
import { CategoriasListaComponent } from './categorias/categorias-lista/categorias-lista.component';
import { CiudadanoUsuarioComponent } from './ciudadano-usuario/ciudadano-usuario.component';
import { UsuariosAdministrarComponent } from './usuarios/usuarios-administrar/usuarios-administrar.component';
import { CiudadanoTramitesNuevoComponent } from './ciudadano-perfil/ciudadano-tramites-nuevo/ciudadano-tramites-nuevo.component';
import { CiudadanoPrincipalComponent } from './ciudadano-perfil/ciudadano-principal/ciudadano-principal.component';
import { CiudadanoTramitesAdministrarComponent } from './ciudadano-perfil/ciudadano-tramites-administrar/ciudadano-tramite-administrar.component';
import { TramitesAdministrarMediadorComponent } from './tramites-administrador/tramites-administrar-mediador/tramites-administrar-mediador.component';
import { ListboxModule } from 'primeng/listbox';
import { CiudadanoTramitesNuevoslistaComponent } from './ciudadano-perfil/ciudadano-tramites-nuevoslista/ciudadano-tramites-nuevoslista.component';
import { CiudadanoTramitesFinalizadosComponent } from './ciudadano-perfil/ciudadano-tramites-finalizados/ciudadano-tramites-finalizados.component';
import { CiudadanoDatospersonalesComponent } from './ciudadano-perfil/ciudadano-datospersonales/ciudadano-datospersonales.component';
import { CiudadanosBuscarComponent } from './ciudadanos/ciudadanos-buscar/ciudadanos-buscar.component';
import { InputMaskModule } from 'primeng/inputmask';
import { TramitesAdministrarFinalizadoComponent } from './tramites-administrador/tramites-administrar-finalizado/tramites-administrar-finalizado.component';
import { CiudadanoCambiarPasswordComponent } from './ciudadano-perfil/ciudadano-cambiar-password/ciudadano-cambiar-password.component';


// Import pdfmake-wrapper and the fonts to use
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { UsuarioCambiarContraseniaComponent } from './usuario-perfil/usuario-cambiar-contrasenia/usuario-cambiar-contrasenia.component';
import { UsuarioDatosPersonalesComponent } from './usuario-perfil/usuario-datos-personales/usuario-datos-personales.component'; // fonts provided for pdfmake

// If any issue using previous fonts import. you can try this:
// import pdfFonts from "pdfmake/build/vfs_fonts";

// registrar las fuentes
PdfMakeWrapper.setFonts(pdfFonts);

@NgModule({
  imports: [
    CalendarModule,
    CardModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    InputMaskModule,
    InputTextModule,
    InputTextareaModule,
    ListboxModule,
    MessageModule,
    MessagesModule,
    PasswordModule,
    TableModule,
    TabViewModule,//funciona ng-template    
    ToolbarModule,
    
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    CiudadanosListaComponent,
    TramitesPrincipalComponent, 
    TramitesFinalizadosComponent,
    TramitesNuevoComponent,
    TramitesAsignadosComponent,
    TramitesNuevoslisComponent,
    TramitesUsuarioAsignadosComponent,
    TramitesUsuarioFinalizadosComponent,
    TramitesAdministrarComponent,
    UsuariosListaComponent,
    UsuariosAdministrarComponent,
    TramitesUsuarioAdministrarComponent,
    CiudadanosAdministrarComponent,
    CentroAdministrarComponent,
    CentrosMediacionListaComponent,
    CategoriaAdministrarComponent,
    CategoriasListaComponent,
    CiudadanoUsuarioComponent,
    CiudadanoPrincipalComponent,
    CiudadanoTramitesAdministrarComponent,
    CiudadanoTramitesNuevoComponent,
    TramitesAdministrarMediadorComponent,
    CiudadanoTramitesNuevoslistaComponent,
    CiudadanoTramitesFinalizadosComponent,
    CiudadanoDatospersonalesComponent,
    CiudadanosBuscarComponent,
    TramitesAdministrarFinalizadoComponent,
    CiudadanoCambiarPasswordComponent,    
    UsuarioCambiarContraseniaComponent,
    UsuarioDatosPersonalesComponent
    
  ],
  
})
export class PagesModule { }
