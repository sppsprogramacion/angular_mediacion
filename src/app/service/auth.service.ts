import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginModel } from '../models/login.model';
import { UsuarioModel } from '../models/usuario.model';
import { DataService } from './data.service';
import { CiudadanoModel } from '../models/ciudadano.model';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //MODELOS
  private ciudadanoLogin: CiudadanoModel;
  private usuarioLogin: UsuarioModel;

  private base_url: string = environment.URL_BASE;

  constructor(
    private readonly http: HttpClient,
    //private router: Router,
    public dataService: DataService,
  ) { }

  //LOGUEO DE CIUDADANO
  loginCiudadano(dataLogin: LoginModel){
    const url= `${this.base_url}/auth/login-ciudadano`;

    return this.http.post(url, dataLogin)
      .pipe(
        tap(
          ciudadano =>{
            this.ciudadanoLogin = ciudadano;
          }),
        tap(ciudadano => localStorage.setItem('token_ciudadano', this.ciudadanoLogin.id_ciudadano.toString())),
        tap(ciudadano => this.usuarioLogin = null)
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
            this.usuarioLogin = usuario;
          }),
        tap(usuario => localStorage.setItem('token_usuario', this.usuarioLogin.id_usuario.toString())),
        tap(usuario => this.ciudadanoLogin = null)
      ); 
  }
  //FIN LOGUEO DE USUARIO................................

  //OBTENER USUARIO LOGUEADO
  get currentUserLogin(): UsuarioModel | undefined{

    if(!this.usuarioLogin) return undefined;

    return this.usuarioLogin
  }
  //FIN OBTENER USUARIO LOGUEADO.........................

  //OBTENER CIUDADANO LOGUEADO
  get currentCiudadanoLogin(): CiudadanoModel | undefined{

    if(!this.ciudadanoLogin) return undefined;

    return this.ciudadanoLogin;
  }
  //FIN OBTENER CIUDADANO LOGUEADO..........................

  //CONTROLAR AUTENTICACION USUARIO
  checkAutenticationUsuario(): Observable<boolean> {

    if( !localStorage.getItem('token_usuario') ) return of(false);

    const token = localStorage.getItem('token_usuario');

    return this.http.get<UsuarioModel>(`${this.base_url}/usuarios/${token}`)
      .pipe(
        tap( usuario => this.usuarioLogin = usuario),
        tap( usuario => this.ciudadanoLogin = null),
        map( usuario => !!usuario),
        catchError( err => of(false) )
      )
  }
  //FIN CONTROLAR AUTENTICACION USUARIO.............................

  //CONTROLAR AUTENTICACION CIUDADANO
  checkAutenticationCiudadano(): Observable<boolean> {

    if( !localStorage.getItem('token_usuario') ) return of(false);

    const token = localStorage.getItem('token_ciudadano');

    return this.http.get<UsuarioModel>(`${this.base_url}/ciudadanos/${token}`)
      .pipe(
        tap( ciudadano => this.ciudadanoLogin = ciudadano),
        tap( ciudadano => this.usuarioLogin = null),
        map( ciudadano => !!ciudadano),
        catchError( err => of(false) )
      )
  }
  //FIN CONTROLAR AUTENTICACION CIUDADANO.........................................

  //CERRAR SESION CIUDADANO
  logoutCiudadano(){
    this.ciudadanoLogin = undefined;
    localStorage.removeItem('token_ciudadano');
  }
  //FIN CERRAR SESION CIUDADANO................................................

  //CERRAR SESION CIUDADANO
  logoutUsuario(){
    this.usuarioLogin = undefined;
    localStorage.removeItem('token_usuario');
  }
  //FIN CERRAR SESION CIUDADANO................................................

}
