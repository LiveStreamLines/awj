import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginError: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router, 
    private headerService: HeaderService) {}

    ngOnInit(): void {
      this.headerService.showHeaderAndSidenav = false;

      // Handle Microsoft login redirect
      this.authService.handleMicrosoftLogin().subscribe({
        next: (isLoggedIn) => {
          console.log('Microsoft login result:', isLoggedIn);
          if (isLoggedIn) {
            console.log('Redirecting to home page...');
            this.router.navigate(['/home']); // Redirect to home page
            this.headerService.showHeaderAndSidenav = true;
          } else {
            console.log('Microsoft login not successful, staying on login page');
          }
        },
        error: (error) => {
          console.error('Microsoft login error:', error);
          this.loginError = 'Login failed. Please try again.';
        }
      });
    }
  
  // Microsoft Login
  onMicrosoftLogin(): void {
    this.loginError = null;
    console.log('User clicked Microsoft login button');
    this.authService.loginWithMicrosoft();
  }
}