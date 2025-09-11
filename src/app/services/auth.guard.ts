import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private msalService: MsalService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Check Microsoft authentication only
    const msalAccount = this.msalService.instance.getActiveAccount();
    const isMsalLoggedIn = !!msalAccount;
    
    if (!isMsalLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
  
    // Check if route is restricted by role
    const requiredRoles = route.data['roles'] as Array<string>;
    if (requiredRoles) {
      const userRole = this.authService.getUserRole();
      if (!userRole || !requiredRoles.includes(userRole)) {
        // Role not authorized, redirect to developers page
        this.router.navigate(['/developers']);
        return false;
      }
    }

    return true;
  }


}
