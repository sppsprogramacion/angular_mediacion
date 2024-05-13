import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {  

  constructor(
      private authService: AuthService,
      private router:Router
  ){  }
  
  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    console.log("Can activate");
    return this.authService.checkAutenticationUsuario()
      .pipe(
        tap( isAutenticado => {
          if( !isAutenticado ){
            this.router.navigate(['login']);
          }
        } )
      )
  }
  
}
