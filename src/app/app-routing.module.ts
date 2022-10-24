import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormLayoutComponent } from './components/formlayout/formlayout.component';
import { PanelsComponent } from './components/panels/panels.component';
import { OverlaysComponent } from './components/overlays/overlays.component';
import { MediaComponent } from './components/media/media.component';
import { MessagesComponent } from './components/messages/messages.component';
import { MiscComponent } from './components/misc/misc.component';
import { EmptyComponent } from './components/empty/empty.component';
import { ChartsComponent } from './components/charts/charts.component';
import { FileComponent } from './components/file/file.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { AppMainComponent } from './app.main.component';
import { InputComponent } from './components/input/input.component';
import { ButtonComponent } from './components/button/button.component';
import { TableComponent } from './components/table/table.component';
import { ListComponent } from './components/list/list.component';
import { TreeComponent } from './components/tree/tree.component';
import { CrudComponent } from './components/crud/crud.component';
import { BlocksComponent } from './components/blocks/blocks.component';
import { FloatLabelComponent } from './components/floatlabel/floatlabel.component';
import { InvalidStateComponent } from './components/invalidstate/invalidstate.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { IconsComponent } from './components/icons/icons.component';
import { LandingComponent } from './components/landing/landing.component';

import { ErrorComponent } from './components/error/error.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AccessComponent } from './components/access/access.component';
import { CiudadanosComponent } from './pages/ciudadanos/ciudadanos.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { TramitesPrincipalComponent } from './pages/tramites-principal/tramites-principal.component';
import { TramitesNuevoComponent } from './pages/tramites-nuevo/tramites-nuevo.component';
import { TramitesAsignadosComponent } from './pages/tramites-asignados/tramites-asignados.component';
import { TramitesFinalizadosComponent } from './pages/tramites-finalizados/tramites-finalizados.component';
import { TramitesNuevoslisComponent } from './pages/tramites-nuevoslis/tramites-nuevoslis.component';
import { TramitesCiudadanoNuevoComponent } from './pages/tramites-ciudadano/tramites-ciudadano-nuevo/tramites-ciudadano-nuevo.component';
import { TramitesCiudadanoNuevoslisComponent } from './pages/tramites-ciudadano/tramites-ciudadano-nuevoslis/tramites-ciudadano-nuevoslis.component';
import { TramitesCiudadanoAsignadosComponent } from './pages/tramites-ciudadano/tramites-ciudadano-asignados/tramites-ciudadano-asignados.component';
import { TramitesCiudadanoFinalizadosComponent } from './pages/tramites-ciudadano/tramites-ciudadano-finalizados/tramites-ciudadano-finalizados.component';
import { TramitesCiudadanoPrincipalComponent } from './pages/tramites-ciudadano/tramites-ciudadano-principal/tramites-ciudadano-principal.component';
import { TramitesAdministrarComponent } from './pages/tramites-administrar/tramites-administrar.component';
@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                children: [
                    {path: '', component: TramitesPrincipalComponent},
                    {path: 'home/principal', component: TramitesPrincipalComponent},
                    {path: 'ciudadanos/mantenimiento', component: CiudadanosComponent},
                    {path: 'tramites/nuevo', component: TramitesNuevoComponent},
                    {path: 'tramites/nuevoslis', component: TramitesNuevoslisComponent},
                    {path: 'tramites/administrar', component: TramitesAdministrarComponent},
                    {path: 'tramites/asignados', component: TramitesAsignadosComponent},
                    {path: 'tramites/finalizados', component: TramitesFinalizadosComponent},
                    {path: 'tramites/ciudadano/principal', component: TramitesCiudadanoPrincipalComponent},
                    {path: 'tramites/ciudadano/nuevo', component: TramitesCiudadanoNuevoComponent},
                    {path: 'tramites/ciudadano/nuevoslis', component: TramitesCiudadanoNuevoslisComponent},
                    {path: 'tramites/ciudadano/asignados', component: TramitesCiudadanoAsignadosComponent},
                    {path: 'tramites/ciudadano/finalizados', component: TramitesCiudadanoFinalizadosComponent}
                    
                ],
            },
            {path:'pages/landing', component: LandingComponent},
            {path:'login', component: LoginComponent},
            {path:'registrar', component: RegistroComponent },
            {path:'pages/error', component: ErrorComponent},
            {path:'pages/notfound', component: NotfoundComponent},
            {path:'pages/access', component: AccessComponent},
            {path: '**', redirectTo: 'pages/notfound'},
        ], {scrollPositionRestoration: 'enabled', anchorScrolling:'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
