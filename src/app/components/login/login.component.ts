import { Component, OnInit, ElementRef, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  // Import CommonModule for *ngIf
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { HeaderService } from '../../services/header.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginError: string | null = null;
  isMobileView: boolean = false;
  isIOS: boolean = false;
  
  @ViewChild('backgroundVideo', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  constructor(
    private authService: AuthService,
    private router: Router, 
    private headerService: HeaderService) {
      this.isIOS = Capacitor.getPlatform() === 'ios';
    }

    ngOnInit(): void {
      this.headerService.showHeaderAndSidenav = false;
      this.checkScreenSize();

      // Handle Microsoft login redirect
      this.authService.handleMicrosoftLogin().subscribe({
        next: (isLoggedIn) => {
          if (isLoggedIn) {
            this.router.navigate(['/developers']); // Redirect to developers page
            this.headerService.showHeaderAndSidenav = true;
          }
        },
        error: (error) => {
          console.error('Microsoft login error:', error);
          this.loginError = 'Login failed. Please try again.';
        }
      });
    }
  
    private checkScreenSize() {
      this.isMobileView = this.isIOS || window.innerWidth <= 768;
    }
  
    ngAfterViewInit(): void {
      if (!this.isMobileView && this.videoElement && this.videoElement.nativeElement) {
        this.videoElement.nativeElement.muted = true;
        this.videoElement.nativeElement.play(); // Ensures the video starts playing muted
      } 
    } 

 

  // Microsoft Login
  onMicrosoftLogin(): void {
    this.loginError = null;
    this.authService.loginWithMicrosoft();
  }
}