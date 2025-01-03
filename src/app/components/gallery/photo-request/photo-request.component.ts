import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PhotoRequestService } from '../../../services/photo-request.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../../../../environment/environments';

@Component({
  selector: 'app-photo-request',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, // For mat-table
    MatPaginatorModule, // For mat-paginator
    MatSortModule, // For mat-sort
    MatProgressSpinnerModule, // For mat-spinner
    MatFormFieldModule, // For mat-form-field
    MatInputModule, // For matInput inside form fields
    MatIcon,
  ],
  templateUrl: './photo-request.component.html',
  styleUrls: ['./photo-request.component.css'],
})
export class PhotoRequestComponent implements OnInit {
  displayedColumns: string[] = [
    'developerProject',
    'dates',
    'hours',
    'RequestTime',
    'filteredImageCount',
    'status',
    'zipLink',
  ];
  dataSource = new MatTableDataSource<any>();
  isLoading: boolean = false;
  errorMessage: string | null = null;
  serverUrl: string = environment.backend + '/media/upload';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private photoRequestService: PhotoRequestService) {}

  ngOnInit(): void {
    this.fetchPhotoRequests();
  }

  fetchPhotoRequests(): void {
    this.isLoading = true;
    this.photoRequestService.getPhotoRequests().subscribe({
      next: (data) => {
        this.dataSource.data = data.map((request) => ({
          developerProject: `${request.developer} (${request.project})`,
          dates: `${this.formatDate(request.startDate)} to ${this.formatDate(request.endDate)}`,
          hours: `${request.startHour} to ${request.endHour}`,
          RequestTime: request.RequestTime,
          filteredImageCount: request.filteredImageCount,
          status: request.status,
          zipLink:
            request.status === 'ready'
              ? `${this.serverUrl}/${request.developerTag}/${request.projectTag}/${request.camera}/videos/photos_${request.id}.zip`
              : null,
        }));
        this.isLoading = false;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load photo requests.';
        console.error(error);
        this.isLoading = false;
      },
    });
  }

  formatDate(date: string): string {
    // Extract year, month, and day from the YYYYMMDD format
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);

    // Return formatted date in YYYY-MM-DD format
    return `${year}-${month}-${day}`;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
