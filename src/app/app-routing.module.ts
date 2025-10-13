import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppMainComponent } from './app.main.component';
import { ErrorComponent } from './components/error/error.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

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
import { TramitesAdministrarFinalizadoComponent } from './pages/tramites-administrador/tramites-administrar-finalizado/tramites-administrar-finalizado.component';
import { AuthCiudadanoGuard } from './auth/guards/auth-ciudadano.guard';
import { AuthUsuarioGuard } from './auth/guards/auth-usuario.guard';
import { CiudadanoCambiarPasswordComponent } from './pages/ciudadano-perfil/ciudadano-cambiar-password/ciudadano-cambiar-password.component';
import { UsuarioDatosPersonalesComponent } from './pages/usuario-perfil/usuario-datos-personales/usuario-datos-personales.component';
import { UsuarioCambiarContraseniaComponent } from './pages/usuario-perfil/usuario-cambiar-contrasenia/usuario-cambiar-contrasenia.component';
import { TramitesAdministrarSupervisorComponent } from './pages/tramites-administrador/tramites-administrar-supervisor/tramites-administrar-supervisor.component';
import { ObjetosComponent } from './pages/objetos/objetos.component';
import { DepartamentosListaComponent } from './pages/departamentos/departamentos-lista/departamentos-lista.component';
import { DescargasAudienciasComponent } from './pages/descargas/descargas-audiencias/descargas-audiencias.component';
import { DescargasTramitesComponent } from './pages/descargas/descargas-tramites/descargas-tramites.component';
import { DescargasTramitesAsignadosComponent } from './pages/descargas/descargas-tramites-asignados/descargas-tramites-asignados.component';
import { TramitesVencidosComponent } from './pages/tramites-administrador/tramites-vencidos/tramites-vencidos.component';
import { TramitesAdministrarVencidoComponent } from './pages/tramites-administrador/tramites-administrar-vencido/tramites-administrar-vencido.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {path: '', redirectTo: 'login', pathMatch: 'full'},
            {
                path: 'admin', component: AppMainComponent, canActivate: [AuthUsuarioGuard],
                children: [
                    {path: '', component: TramitesPrincipalComponent},
                    {path: 'principal', component: TramitesPrincipalComponent},

                    {path: 'categoria/lista', component: CategoriasListaComponent},
                    {path: 'categoria/administrar', component: CategoriaAdministrarComponent},
                    
                    {path: 'ciudadanos/administrar', component: CiudadanosAdministrarComponent},
                    {path: 'ciudadanos/buscar', component: CiudadanosBuscarComponent},
                    {path: 'ciudadanos/lista', component: CiudadanosListaComponent},
                    {path: 'ciudadanos/tramites/nuevo', component: CiudadanoTramitesNuevoComponent},
                    {path: 'ciudadanos-usuarios/administrar', component: CiudadanoUsuarioComponent},
                    
                    {path: 'centro-mediacion/lista', component: CentrosMediacionListaComponent},
                    {path: 'centro-mediacion/administrar', component: CentroAdministrarComponent},

                    {path: 'departamentos/lista', component: DepartamentosListaComponent},
                    
                    {path: 'descargas/audiencias', component: DescargasAudienciasComponent},
                    {path: 'descargas/tramites', component: DescargasTramitesComponent},
                    {path: 'descargas/tramites-asignacion', component: DescargasTramitesAsignadosComponent},

                    {path: 'miperfil/datospersonales', component: UsuarioDatosPersonalesComponent},
                    {path: 'miperfil/cambiarcontrasenia', component: UsuarioCambiarContraseniaComponent},

                    //{path: 'categoria/lista', component: CategoriasListaComponent},
                    {path: 'objetos', component: ObjetosComponent},                    

                    {path: 'usuarios/administrar', component: UsuariosAdministrarComponent},
                    {path: 'usuarios/lista', component: UsuariosListaComponent},
                    
                    {path: 'tramites/administrar', component: TramitesAdministrarComponent},
                    {path: 'tramites/administrar-finalizado', component: TramitesAdministrarFinalizadoComponent},
                    {path: 'tramites/administrar-med', component: TramitesAdministrarMediadorComponent},
                    {path: 'tramites/administrar-vencido', component: TramitesAdministrarVencidoComponent},
                    {path: 'tramites/administrar-visor', component: TramitesAdministrarSupervisorComponent},
                    {path: 'tramites/asignados', component: TramitesAsignadosComponent},
                    {path: 'tramites/finalizados', component: TramitesFinalizadosComponent},
                    {path: 'tramites/nuevo', component: TramitesNuevoComponent},
                    {path: 'tramites/nuevoslis', component: TramitesNuevoslisComponent},
                    {path: 'tramites/vencidos', component: TramitesVencidosComponent},
                                        
                ],                
            },
            {
                path: 'ciudadano', component: AppMainComponent, canActivate: [AuthCiudadanoGuard],
                children: [
                    {path: '', component: CiudadanoPrincipalComponent},
                    {path: 'principal', component: CiudadanoPrincipalComponent},
                    {path: 'cambiarcontrasenia', component: CiudadanoCambiarPasswordComponent},
                    {path: 'datospersonales', component: CiudadanoDatospersonalesComponent},
                    {path: 'tramites/administrar', component: CiudadanoTramitesAdministrarComponent},
                    {path: 'tramites/finalizados', component: CiudadanoTramitesFinalizadosComponent},
                    {path: 'tramites/nuevo', component: CiudadanoTramitesNuevoComponent},
                    {path: 'tramites/nuevos', component: CiudadanoTramitesNuevoslistaComponent},
                                                 
                ],
                
            },
            
            {path:'login', component: LoginComponent},
            {path:'login-admin-mediacion', component: LoginUsuarioComponent},
            {path:'registrar', component: RegistroComponent },
            {path:'pages/error', component: ErrorComponent},
            {path:'pages/notfound', component: NotfoundComponent},
            {path: '**', redirectTo: 'pages/notfound'},
        ], {scrollPositionRestoration: 'enabled', anchorScrolling:'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
