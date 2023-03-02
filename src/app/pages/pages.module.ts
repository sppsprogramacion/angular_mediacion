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
import { TramitesCiudadanoNuevoComponent } from './tramites-ciudadano/tramites-ciudadano-nuevo/tramites-ciudadano-nuevo.component';
import { TramitesCiudadanoPrincipalComponent } from './tramites-ciudadano/tramites-ciudadano-principal/tramites-ciudadano-principal.component';
import { TramitesCiudadanoAsignadosComponent } from './tramites-ciudadano/tramites-ciudadano-asignados/tramites-ciudadano-asignados.component';
import { TramitesCiudadanoFinalizadosComponent } from './tramites-ciudadano/tramites-ciudadano-finalizados/tramites-ciudadano-finalizados.component';
import { TramitesFinalizadosComponent } from './tramites-administrador/tramites-finalizados/tramites-finalizados.component';
import { TramitesNuevoComponent } from './tramites-administrador/tramites-nuevo/tramites-nuevo.component';
import { TramitesAsignadosComponent } from './tramites-administrador/tramites-asignados/tramites-asignados.component';
import { TramitesNuevoslisComponent } from './tramites-administrador/tramites-nuevoslis/tramites-nuevoslis.component';
import { TramitesCiudadanoNuevoslisComponent } from './tramites-ciudadano/tramites-ciudadano-nuevoslis/tramites-ciudadano-nuevoslis.component';
import { DropdownModule } from 'primeng/dropdown';
import { TramitesUsuarioAsignadosComponent } from './tramites-usuario/tramites-usuario-asignados/tramites-usuario-asignados.component';
import { TramitesUsuarioFinalizadosComponent } from './tramites-usuario/tramites-usuario-finalizados/tramites-usuario-finalizados.component';
import { TramitesAdministrarComponent } from './tramites-administrador/tramites-administrar/tramites-administrar.component';
import { UsuariosListaComponent } from './usuarios/usuarios-lista/usuarios-lista.component';
import { UsuariosAdministrarComponent } from './usuarios/usuarios-administrar/usuarios-administrar.component';
import { CalendarModule } from 'primeng/calendar';
import { PasswordModule } from 'primeng/password';
import { BrowserModule } from '@angular/platform-browser';
import { TramitesCiudadanoAdministrarComponent } from './tramites-ciudadano/tramites-ciudadano-administrar/tramites-ciudadano-administrar.component';
import { TramitesUsuarioAdministrarComponent } from './tramites-usuario/tramites-usuario-administrar/tramites-usuario-administrar.component';
import { CiudadanosAdministrarComponent } from './ciudadanos/ciudadanos-administrar/ciudadanos-administrar.component';
import { CentroAdministrarComponent } from './centros-mediacion/centro-administrar/centro-mediacion-administrar.component';
import { CentrosMediacionListaComponent } from './centros-mediacion/centros-lista/centros-mediacion-lista.component';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import {CardModule} from 'primeng/card';
import { CategoriaAdministrarComponent } from './categorias/categoria-administrar/categoria-administrar.component';
import { CategoriasListaComponent } from './categorias/categorias-lista/categorias-lista.component';


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
    InputTextModule,
    InputTextareaModule,
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
    TramitesCiudadanoAsignadosComponent,
    TramitesCiudadanoFinalizadosComponent,
    TramitesCiudadanoNuevoComponent,
    TramitesCiudadanoPrincipalComponent,
    TramitesFinalizadosComponent,
    TramitesNuevoComponent,
    TramitesAsignadosComponent,
    TramitesNuevoslisComponent,
    TramitesCiudadanoNuevoslisComponent,
    TramitesUsuarioAsignadosComponent,
    TramitesUsuarioFinalizadosComponent,
    TramitesAdministrarComponent,
    UsuariosListaComponent,
    UsuariosAdministrarComponent,
    TramitesCiudadanoAdministrarComponent,
    TramitesUsuarioAdministrarComponent,
    CiudadanosAdministrarComponent,
    CentroAdministrarComponent,
    CentrosMediacionListaComponent,
    CategoriaAdministrarComponent,
    CategoriasListaComponent
    
  ],
  
})
export class PagesModule { }
