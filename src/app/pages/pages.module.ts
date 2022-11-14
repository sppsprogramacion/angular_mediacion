import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CiudadanosComponent } from './ciudadanos/ciudadanos.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TramitesPrincipalComponent } from './tramites-principal/tramites-principal.component';
import { TramitesCiudadanoNuevoComponent } from './tramites-ciudadano/tramites-ciudadano-nuevo/tramites-ciudadano-nuevo.component';
import { TramitesCiudadanoPrincipalComponent } from './tramites-ciudadano/tramites-ciudadano-principal/tramites-ciudadano-principal.component';
import { TramitesCiudadanoAsignadosComponent } from './tramites-ciudadano/tramites-ciudadano-asignados/tramites-ciudadano-asignados.component';
import { TramitesCiudadanoFinalizadosComponent } from './tramites-ciudadano/tramites-ciudadano-finalizados/tramites-ciudadano-finalizados.component';
import { TramitesFinalizadosComponent } from './tramites-finalizados/tramites-finalizados.component';
import { TramitesNuevoComponent } from './tramites-nuevo/tramites-nuevo.component';
import { TramitesAsignadosComponent } from './tramites-asignados/tramites-asignados.component';
import { TramitesNuevoslisComponent } from './tramites-nuevoslis/tramites-nuevoslis.component';
import { TramitesCiudadanoNuevoslisComponent } from './tramites-ciudadano/tramites-ciudadano-nuevoslis/tramites-ciudadano-nuevoslis.component';
import { DropdownModule } from 'primeng/dropdown';
import { TramitesUsuarioAsignadosComponent } from './tramites-usuario/tramites-usuario-asignados/tramites-usuario-asignados.component';
import { TramitesUsuarioFinalizadosComponent } from './tramites-usuario/tramites-usuario-finalizados/tramites-usuario-finalizados.component';
import { TramitesAdministrarComponent } from './tramites-administrar/tramites-administrar.component';
import { UsuariosListaComponent } from './usuarios/usuarios-lista/usuarios-lista.component';
import { UsuariosAdministrarComponent } from './usuarios/usuarios-administrar/usuarios-administrar.component';



@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    TableModule,
    TabViewModule,//funciona ng-template
    InputTextareaModule,
    ToolbarModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    CiudadanosComponent,
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
    UsuariosAdministrarComponent
    
  ],
  
})
export class PagesModule { }
