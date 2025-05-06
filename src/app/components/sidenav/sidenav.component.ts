import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule for NgIf
import { MatSidenavModule } from '@angular/material/sidenav';  // Import Angular Material Sidenav
import { MatListModule } from '@angular/material/list';  // Import Angular Material List
import { MatIconModule } from '@angular/material/icon';  // Import MatIconModule
import { AuthService } from '../../services/auth.service';
import { ManualVideoDialogComponent } from '../manual-video-dialog/manual-video-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable , map, tap } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    RouterModule, 
    CommonModule, 
    MatSidenavModule, 
    MatListModule,
    MatIconModule
  ], 
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  memoryRole: string | null = '';
  invenotryRole: string | null = '';
  
  isSuper$: Observable<boolean> | undefined;
  isAdmin$: Observable<boolean> | undefined;
  isAddingUser$: Observable<boolean> | undefined;

  constructor(
    private authService:AuthService,
    private dialog: MatDialog
  ){}

  ngOnInit(): void {

    // Convert authService observables into boolean streams
    this.isSuper$ = this.authService.userRole$.pipe(
      map(role => role === 'Super Admin')
    );

    this.isAdmin$ = this.authService.userRole$.pipe(
      map(role => role === 'Admin')
    );

   

    this.isAddingUser$ = this.authService.canAddUser$.pipe(
      map(permission => {
        if (permission === null || permission === undefined) return false;
        if (typeof permission === 'boolean') return permission;
        return String(permission).toLowerCase() === 'true';
      }),
      tap(data => console.log('adding User updated: ', data))
    );
    
  }

  openManual() {
    this.dialog.open(ManualVideoDialogComponent, {
      data: { title: 'Manual', videoUrl: 'assets/videos/manual.mp4' },
      panelClass: 'fullscreen-dialog', // Add a custom class for fullscreen styling
    });
  }

}
