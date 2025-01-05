import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormField } from '@angular/material/input';
import { MatInputModule } from '@angular/material/input';
import { MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DeveloperService } from '../../services/developer.service';
import { ProjectService } from '../../services/project.service';
import { Developer } from '../../models/developer.model';
import { Project } from '../../models/project.model';
import { MatSelectModule } from '@angular/material/select'; // Import for dropdown
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ProjectFormComponent } from './project-form/project-form.component';
import { environment } from '../../../environment/environments';


@Component({
  selector: 'app-developers',
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormField, MatInputModule, 
    MatLabel, MatSort, MatTableModule, MatIcon, MatSelectModule, MatProgressSpinnerModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  displayedColumns: string[] = ['logo', 'name', 'status', 'createdDate', 'actions'];
  dataSource = new MatTableDataSource<Project>();
  developers: Developer[] = []; // List of developers for dropdown
  selectedDeveloperId: string = ''; // Holds the currently selected developer ID
  searchTerm: string = '';
  isLoading: boolean = false;  // Loading state
  link:string = environment.backend;


  @ViewChild(MatSort) sort!: MatSort;

  constructor(private developerService: DeveloperService, private projectService: ProjectService,  private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchDevelopers();
  }

  // Fetch the list of developers
  fetchDevelopers(): void {
    this.developerService.getAllDevelopers().subscribe((developers) => {
      this.developers = developers;
      // Automatically select the first developer by default
      if (developers.length > 0) {
        this.selectedDeveloperId = developers[0]._id;
        this.fetchProjectsByDeveloper(this.selectedDeveloperId);
      }
    });
  }

  // Fetch projects for the selected developer
  fetchProjectsByDeveloper(developerId: string): void {
    this.isLoading = true;  // Set loading to true when a new developer is selected

    this.projectService.getProjectsByDeveloper(developerId).subscribe({
      next: (projects) => {
        this.dataSource.data = projects;
        this.dataSource.sort = this.sort;
      },
      complete: () => (this.isLoading = false)  // Set loading to false once data is loaded
    });    
  }

  // Apply filter for search functionality
  applyFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  // Add new project action
  openAddProjectDialog(): void {
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      data: { isEditMode: false, developerId: this.selectedDeveloperId },
      panelClass: 'custom-dialog-container',
      // width: '700px',      // Set desired width
      // maxHeight: '80vh'   // Limit height to 80% of viewport height
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchProjectsByDeveloper(this.selectedDeveloperId);  // Refresh list after adding a new developer
      }
    });
  }

   // Open the form in "Edit" mode
   openEditProjectDialog(project: Project): void {
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      data: { isEditMode: true, project },
      panelClass: 'custom-dialog-container',
      // width: '700px',      // Set desired width
      // maxHeight: '80vh'   // Limit height to 80% of viewport height
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchProjectsByDeveloper(this.selectedDeveloperId);  // Refresh list after editing a developer
      }
    });
  }

  // Open project record
  openProject(projectId: string): void {
    // Implement navigation or modal opening for project details here
  }
}
