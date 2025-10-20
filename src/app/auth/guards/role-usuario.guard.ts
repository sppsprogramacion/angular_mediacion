import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleUsuarioGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as string[];
    const userRole = this.authService.getRolUsuario();

    if (!userRole || !expectedRoles.includes(userRole)) {
      this.router.navigate(['/login-admin-mediacion']); // o login
      return false;
    }

    return true;
  }
  
}
