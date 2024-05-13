import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthCiudadanoGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router:Router
){  }
  
  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    console.log("Can activate");
    return this.authService.checkAutenticationCiudadano()
      .pipe(
        tap( isAutenticado => {
          if( !isAutenticado ){
            this.router.navigate(['login']);
          }          
        } )
      )
  }
  
}
