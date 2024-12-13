import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule for ngFor and ngIf
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../../services/auth.service';  // Import the AuthService
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports:[
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule,
    CommonModule, 
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() sidenav!: MatSidenav;
  username: string = 'Admin';  // You can replace this with dynamic user data
  breadcrumbs: { label: string; url?: string }[] = [];

  constructor(
    private authService: AuthService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit() {
    this.breadcrumbService.breadcrumbs$.subscribe((breadcrumbs) => {
      this.breadcrumbs = breadcrumbs;
      console.log(this.breadcrumbs);
    });
  }

 
  // Toggle the sidenav
  toggleSidenav() {
    this.sidenav.toggle();
  }

  logout() {
    this.authService.logout();  // Call the logout function in AuthService
  }
}
