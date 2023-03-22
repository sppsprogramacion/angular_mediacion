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
import { CiudadanosListaComponent } from './pages/ciudadanos/ciudadanos-lista/ciudadanos-lista.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { TramitesPrincipalComponent } from './pages/tramites-administrador/tramites-principal/tramites-principal.component';
import { TramitesNuevoComponent } from './pages/tramites-administrador/tramites-nuevo/tramites-nuevo.component';
import { TramitesAsignadosComponent } from './pages/tramites-administrador/tramites-asignados/tramites-asignados.component';
import { TramitesFinalizadosComponent } from './pages/tramites-administrador/tramites-finalizados/tramites-finalizados.component';
import { TramitesNuevoslisComponent } from './pages/tramites-administrador/tramites-nuevoslis/tramites-nuevoslis.component';
import { TramitesCiudadanoNuevoComponent } from './pages/tramites-ciudadano/tramites-ciudadano-nuevo/tramites-ciudadano-nuevo.component';
import { TramitesCiudadanoNuevoslisComponent } from './pages/tramites-ciudadano/tramites-ciudadano-nuevoslis/tramites-ciudadano-nuevoslis.component';
import { TramitesCiudadanoAsignadosComponent } from './pages/tramites-ciudadano/tramites-ciudadano-asignados/tramites-ciudadano-asignados.component';
import { TramitesCiudadanoFinalizadosComponent } from './pages/tramites-ciudadano/tramites-ciudadano-finalizados/tramites-ciudadano-finalizados.component';
import { TramitesCiudadanoPrincipalComponent } from './pages/tramites-ciudadano/tramites-ciudadano-principal/tramites-ciudadano-principal.component';
import { TramitesAdministrarComponent } from './pages/tramites-administrador/tramites-administrar/tramites-administrar.component';
import { UsuariosListaComponent } from './pages/usuarios/usuarios-lista/usuarios-lista.component';
import { CiudadanosAdministrarComponent } from './pages/ciudadanos/ciudadanos-administrar/ciudadanos-administrar.component';
import { UsuariosAdministrarComponent } from './pages/usuarios/usuarios-administrar/usuarios-administrar.component';
import { TramitesUsuarioAsignadosComponent } from './pages/tramites-usuario/tramites-usuario-asignados/tramites-usuario-asignados.component';
import { TramitesUsuarioFinalizadosComponent } from './pages/tramites-usuario/tramites-usuario-finalizados/tramites-usuario-finalizados.component';

import { CentroAdministrarComponent } from './pages/centros-mediacion/centro-administrar/centro-mediacion-administrar.component';
import { CentrosMediacionListaComponent } from './pages/centros-mediacion/centros-lista/centros-mediacion-lista.component';
import { CategoriasListaComponent } from './pages/categorias/categorias-lista/categorias-lista.component';
import { CategoriaAdministrarComponent } from './pages/categorias/categoria-administrar/categoria-administrar.component';
import { CiudadanoUsuarioComponent } from './pages/ciudadano-usuario/ciudadano-usuario.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                children: [
                    {path: '', component: TramitesPrincipalComponent},
                    {path: 'home/principal', component: TramitesPrincipalComponent},
                    {path: 'admin/categoria/lista', component: CategoriasListaComponent},
                    {path: 'admin/categoria/administrar', component: CategoriaAdministrarComponent},
                    {path: 'admin/ciudadanos/lista', component: CiudadanosListaComponent},
                    {path: 'admin/ciudadanos/administrar', component: CiudadanosAdministrarComponent},
                    {path: 'admin/ciudadanos-usuarios/administrar', component: CiudadanoUsuarioComponent},
                    {path: 'admin/centro-mediacion/lista', component: CentrosMediacionListaComponent},
                    {path: 'admin/centro-mediacion/administrar', component: CentroAdministrarComponent},
                    {path: 'admin/usuarios/administrar', component: UsuariosAdministrarComponent},
                    {path: 'admin/usuarios/lista', component: UsuariosListaComponent},
                    {path: 'admin/tramites/nuevo', component: TramitesNuevoComponent},
                    {path: 'admin/tramites/nuevoslis', component: TramitesNuevoslisComponent},
                    {path: 'admin/tramites/administrar', component: TramitesAdministrarComponent},
                    {path: 'admin/tramites/asignados', component: TramitesAsignadosComponent},
                    {path: 'admin/tramites/finalizados', component: TramitesFinalizadosComponent},
                    {path: 'ciudadano/tramites/principal', component: TramitesCiudadanoPrincipalComponent},
                    {path: 'ciudadano/tramites/nuevo', component: TramitesCiudadanoNuevoComponent},
                    {path: 'ciudadano/tramites/nuevoslis', component: TramitesCiudadanoNuevoslisComponent},
                    {path: 'ciudadano/tramites/asignados', component: TramitesCiudadanoAsignadosComponent},
                    {path: 'ciudadano/tramites/finalizados', component: TramitesCiudadanoFinalizadosComponent},
                    {path: 'usuario/tramites/asignados', component: TramitesUsuarioAsignadosComponent},
                    {path: 'usuario/tramites/finalizados', component: TramitesUsuarioFinalizadosComponent},
                    
                    
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
