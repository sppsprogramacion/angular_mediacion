import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginModel } from '../models/login.model';
import { UsuarioModel } from '../models/usuario.model';
import { DataService } from './data.service';
import { CiudadanoModel } from '../models/ciudadano.model';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { LoginResponseUsuarioModel } from '../models/login_response_usuario.model';
import { LoginResponseCiudadanoModel } from '../models/login_response_ciudadano.model';
//import { ClassGetter } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //MODELOS
  private ciudadanoLoggedIn: CiudadanoModel;
  private ciudadanoLoginResponse: LoginResponseCiudadanoModel;
  private usuarioLoggedIn: UsuarioModel;
  private usuarioLoginResponse: LoginResponseUsuarioModel;

  private base_url: string = environment.URL_BASE;

  constructor(
    private readonly http: HttpClient,
    //private router: Router,
    //public dataService: DataService,
  ) { }

  //LOGUEO DE CIUDADANO
  loginCiudadano(dataLogin: LoginModel){
    const url= `${this.base_url}/auth/login-ciudadano`;

    return this.http.post(url, dataLogin)
      .pipe(
        tap(
          ciudadano =>{
            this.ciudadanoLoggedIn = ciudadano;
          }),
        tap(
          ciudadano =>{
            this.ciudadanoLoginResponse = ciudadano;
          }),
        tap(ciudadano => localStorage.setItem('token-ciudadano', this.ciudadanoLoginResponse.token)),
        tap(ciudadano => this.usuarioLoggedIn = null)
      );    
  }
  //FIN LOSGUEO DE CIUDADANO...........................................

  //LOGUEO DE USUARIO
  loginUsuario(dataLogin: LoginModel): Observable<UsuarioModel>{
    const url= `${this.base_url}/auth/login-usuario`;

    return this.http.post(url, dataLogin)
      .pipe(        
        tap(
          usuario =>{
            this.usuarioLoggedIn = usuario;
          }),
        tap(
          usuario =>{
            this.usuarioLoginResponse = usuario;
          }),
        tap(usuario => localStorage.setItem('token-usuario', this.usuarioLoginResponse.token)),
        tap(usuario => this.ciudadanoLoggedIn = null)
      ); 
  }
  //FIN LOGUEO DE USUARIO................................

  //OBTENER USUARIO LOGUEADO
  get currentUserLogin(): UsuarioModel | undefined{

    if(!this.usuarioLoggedIn) return undefined;

    return this.usuarioLoggedIn
  }
  //FIN OBTENER USUARIO LOGUEADO.........................

  //OBTENER CIUDADANO LOGUEADO
  get currentCiudadanoLogin(): CiudadanoModel | undefined{

    if(!this.ciudadanoLoggedIn) return undefined;

    return this.ciudadanoLoggedIn;
  }
  //FIN OBTENER CIUDADANO LOGUEADO..........................

  //CONTROLAR AUTENTICACION USUARIO
  checkAutenticationUsuario(): Observable<boolean> {

    if( !localStorage.getItem('token-usuario') ) return of(false);

    const token = localStorage.getItem('token-usuario');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.base_url}/auth/check-auth-status-usuario`, { headers })
      .pipe(
        tap( usuario => this.usuarioLoggedIn = usuario),
        tap( usuario => this.usuarioLoginResponse = usuario),
        tap(usuario => localStorage.setItem('token-usuario', this.usuarioLoginResponse.token)),
        tap( usuario => this.ciudadanoLoggedIn = null),
        map( usuario => !!usuario),
        catchError( err => of(false) )
      )
  }
  //FIN CONTROLAR AUTENTICACION USUARIO.............................

  //CONTROLAR AUTENTICACION CIUDADANO
  checkAutenticationCiudadano(): Observable<boolean> {

    if( !localStorage.getItem('token-ciudadano') ) return of(false);

    const token = localStorage.getItem('token-ciudadano');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.base_url}/auth/check-auth-status-ciudadano`, { headers })
      .pipe(
        tap( ciudadano => this.ciudadanoLoggedIn = ciudadano),        
        tap(
          ciudadano =>{
            this.ciudadanoLoginResponse = ciudadano;
          }),        
        tap( ciudadano => this.usuarioLoggedIn = null),
        tap( ciudadano => localStorage.setItem('token-ciudadano', this.ciudadanoLoginResponse.token)),
        map( ciudadano => !!ciudadano),
        catchError( err => of(false) )
      )
  }
  //FIN CONTROLAR AUTENTICACION CIUDADANO.........................................

  //CERRAR SESION CIUDADANO
  logoutCiudadano(){
    this.ciudadanoLoggedIn = undefined;
    localStorage.removeItem('token-ciudadano');
  }
  //FIN CERRAR SESION CIUDADANO................................................

  //CERRAR SESION CIUDADANO
  logoutUsuario(){
    this.usuarioLoggedIn = undefined;
    localStorage.removeItem('token-usuario');
  }
  //FIN CERRAR SESION CIUDADANO................................................

}
