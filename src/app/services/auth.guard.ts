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
    // Wait for MSAL to initialize
    if (!this.msalService.instance) {
      console.log('AuthGuard - MSAL not initialized, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }

    // Check Microsoft authentication
    const msalAccount = this.msalService.instance.getActiveAccount();
    const isMsalLoggedIn = !!msalAccount;
    
    console.log('AuthGuard check - MSAL account:', msalAccount);
    console.log('AuthGuard check - isMsalLoggedIn:', isMsalLoggedIn);
    console.log('AuthGuard check - Route:', route.routeConfig?.path);
    console.log('AuthGuard check - State URL:', state.url);
    
    // Check legacy authentication (for temporary login)
    const isLegacyLoggedIn = this.authService.isLoggedIn();
    console.log('AuthGuard check - isLegacyLoggedIn:', isLegacyLoggedIn);
    
    // If trying to access login page, allow it
    if (state.url === '/login') {
      console.log('AuthGuard - Allowing access to login page');
      return true;
    }
    
    if (!isMsalLoggedIn && !isLegacyLoggedIn) {
      console.log('AuthGuard - Not logged in, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
  
    // Check if route is restricted by role
    const requiredRoles = route.data['roles'] as Array<string>;
    if (requiredRoles) {
      const userRole = this.authService.getUserRole();
      if (!userRole || !requiredRoles.includes(userRole)) {
        // Role not authorized, redirect to home page
        this.router.navigate(['/home']);
        return false;
      }
    }

    return true;
  }


}
