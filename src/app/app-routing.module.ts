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
import { LoginUsuarioComponent } from './auth/login-usuario/login-usuario.component';
import { CiudadanoPrincipalComponent } from './pages/ciudadano-perfil/ciudadano-principal/ciudadano-principal.component';
import { CiudadanoTramitesNuevoComponent } from './pages/ciudadano-perfil/ciudadano-tramites-nuevo/ciudadano-tramites-nuevo.component';
import { CiudadanoTramitesAdministrarComponent } from './pages/ciudadano-perfil/ciudadano-tramites-administrar/ciudadano-tramite-administrar.component';
import { TramitesAdministrarMediadorComponent } from './pages/tramites-administrador/tramites-administrar-mediador/tramites-administrar-mediador.component';
import { CiudadanoTramitesNuevoslistaComponent } from './pages/ciudadano-perfil/ciudadano-tramites-nuevoslista/ciudadano-tramites-nuevoslista.component';
import { CiudadanoTramitesFinalizadosComponent } from './pages/ciudadano-perfil/ciudadano-tramites-finalizados/ciudadano-tramites-finalizados.component';
import { CiudadanoDatospersonalesComponent } from './pages/ciudadano-perfil/ciudadano-datospersonales/ciudadano-datospersonales.component';
import { CiudadanosBuscarComponent } from './pages/ciudadanos/ciudadanos-buscar/ciudadanos-buscar.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {path: '', redirectTo: 'login', pathMatch: 'full'},
            {
                path: 'admin', component: AppMainComponent,
                children: [
                    {path: '', component: TramitesPrincipalComponent},
                    {path: 'principal', component: TramitesPrincipalComponent},

                    {path: 'categoria/lista', component: CategoriasListaComponent},
                    {path: 'categoria/administrar', component: CategoriaAdministrarComponent},
                    
                    {path: 'ciudadanos/administrar', component: CiudadanosAdministrarComponent},
                    {path: 'ciudadanos/buscar', component: CiudadanosBuscarComponent},
                    {path: 'ciudadanos/lista', component: CiudadanosListaComponent},
                    {path: 'ciudadanos-usuarios/administrar', component: CiudadanoUsuarioComponent},
                    
                    {path: 'centro-mediacion/lista', component: CentrosMediacionListaComponent},
                    {path: 'centro-mediacion/administrar', component: CentroAdministrarComponent},
                    
                    {path: 'usuarios/administrar', component: UsuariosAdministrarComponent},
                    {path: 'usuarios/lista', component: UsuariosListaComponent},
                    
                    {path: 'tramites/administrar', component: TramitesAdministrarComponent},
                    {path: 'tramites/administrar-med', component: TramitesAdministrarMediadorComponent},
                    {path: 'tramites/asignados', component: TramitesAsignadosComponent},
                    {path: 'tramites/finalizados', component: TramitesFinalizadosComponent},
                    {path: 'tramites/nuevo', component: TramitesNuevoComponent},
                    {path: 'tramites/nuevoslis', component: TramitesNuevoslisComponent},
                                        
                ],                
            },
            {
                path: 'ciudadano', component: AppMainComponent,
                children: [
                    {path: '', component: CiudadanoPrincipalComponent},
                    {path: 'principal', component: CiudadanoPrincipalComponent},
                    {path: 'cambiarcontrasenia', component: CiudadanoDatospersonalesComponent},
                    {path: 'datospersonales', component: CiudadanoDatospersonalesComponent},
                    {path: 'tramites/administrar', component: CiudadanoTramitesAdministrarComponent},
                    {path: 'tramites/finalizados', component: CiudadanoTramitesFinalizadosComponent},
                    {path: 'tramites/nuevo', component: CiudadanoTramitesNuevoComponent},
                    {path: 'tramites/nuevos', component: CiudadanoTramitesNuevoslistaComponent},
                    
                    {path: 'usuario/tramites/administrar', component: TramitesAdministrarComponent},
                    {path: 'usuario/tramites/asignados', component: TramitesUsuarioAsignadosComponent},
                    {path: 'usuario/tramites/finalizados', component: TramitesUsuarioFinalizadosComponent},
                                        
                ],
                
            },
            // {
            //     path: 'pages', component: AppMainComponent,
            //     children: [
            //         {path: '', component: TramitesPrincipalComponent},
            //         {path: 'home/principal', component: TramitesPrincipalComponent},

            //         {path: 'admin/categoria/lista', component: CategoriasListaComponent},
            //         {path: 'admin/categoria/administrar', component: CategoriaAdministrarComponent},
                    
            //         {path: 'admin/ciudadanos/administrar', component: CiudadanosAdministrarComponent},
            //         {path: 'admin/ciudadanos/buscar', component: CiudadanosBuscarComponent},
            //         {path: 'admin/ciudadanos/lista', component: CiudadanosListaComponent},
            //         {path: 'admin/ciudadanos-usuarios/administrar', component: CiudadanoUsuarioComponent},
                    
            //         {path: 'admin/centro-mediacion/lista', component: CentrosMediacionListaComponent},
            //         {path: 'admin/centro-mediacion/administrar', component: CentroAdministrarComponent},
                    
            //         {path: 'admin/usuarios/administrar', component: UsuariosAdministrarComponent},
            //         {path: 'admin/usuarios/lista', component: UsuariosListaComponent},
                    
            //         {path: 'admin/tramites/administrar', component: TramitesAdministrarComponent},
            //         {path: 'admin/tramites/administrar-med', component: TramitesAdministrarMediadorComponent},
            //         {path: 'admin/tramites/asignados', component: TramitesAsignadosComponent},
            //         {path: 'admin/tramites/finalizados', component: TramitesFinalizadosComponent},
            //         {path: 'admin/tramites/nuevo', component: TramitesNuevoComponent},
            //         {path: 'admin/tramites/nuevoslis', component: TramitesNuevoslisComponent},
                                        
            //         {path: 'ciudadano/principal', component: CiudadanoPrincipalComponent},
            //         {path: 'ciudadano/cambiarcontrasenia', component: CiudadanoDatospersonalesComponent},
            //         {path: 'ciudadano/datospersonales', component: CiudadanoDatospersonalesComponent},
            //         {path: 'ciudadano/tramites/administrar', component: CiudadanoTramitesAdministrarComponent},
            //         {path: 'ciudadano/tramites/finalizados', component: CiudadanoTramitesFinalizadosComponent},
            //         {path: 'ciudadano/tramites/nuevo', component: CiudadanoTramitesNuevoComponent},
            //         {path: 'ciudadano/tramites/nuevos', component: CiudadanoTramitesNuevoslistaComponent},
                    
            //         {path: 'usuario/tramites/administrar', component: TramitesAdministrarComponent},
            //         {path: 'usuario/tramites/asignados', component: TramitesUsuarioAsignadosComponent},
            //         {path: 'usuario/tramites/finalizados', component: TramitesUsuarioFinalizadosComponent},
                                        
            //     ],
                
            // },
            {path:'pages/landing', component: LandingComponent},
            {path:'login', component: LoginComponent},
            {path:'login-admin-mediacion', component: LoginUsuarioComponent},
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
