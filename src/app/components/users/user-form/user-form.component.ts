import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../services/users.service';
import { DeveloperService } from '../../../services/developer.service';
import { ProjectService } from '../../../services/project.service';
import { CameraService } from '../../../services/camera.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})

export class UserFormComponent implements OnInit {

  userForm!: FormGroup;
  isEditing: boolean = false;
  submitted: boolean = false;
  resetEmail: string = '';
  userId: string | null = null; // Store user ID when editing
  hidepermissions: boolean = false;
  isAllDevSelected: boolean = false;
  isAllProjSelected: boolean = false;
  isAllCameraSelected: boolean = false;
  isAllServiceSelected: boolean = false;

  userRole: string | null = null;
  accessibleDeveloper: string[]=[];
  accessibleProject: string[]=[];
  accessibleCamera: string[]=[];
  isSuperAdmin: boolean = false;

  roles: string[] = ['Super Admin', 'Admin', 'User'];
  developers: any[] = []; // Replace with actual developer data
  projects: any[] = []; // Replace with actual project data
  cameras: any[] = []; // Replace with actual camera data
  services: string[] = [
    'Time lapse',
    'Live Streaming',
    'Drone Shooting',
    'Site Photography & Videography',
    '360 Photography & Videography',
    'Satellite Imagery'
  ];

  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private developerService: DeveloperService,
    private projectService: ProjectService,
    private cameraService: CameraService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) {}
  
  
  ngOnInit(): void {
    this.isSuperAdmin = this.authService.getUserRole() === 'Super Admin';
    this.accessibleDeveloper = this.authService.getAccessibleDevelopers();
    this.accessibleProject = this.authService.getAccessibleProjects();
    this.accessibleCamera = this.authService.getAccessibleCameras();


    this.userId = this.route.snapshot.paramMap.get('id'); // Get the user ID from the route
    this.isEditing = !!this.userId; // If there's an ID, it's edit mode
  
    this.initializeForm();

    const role = this.authService.getUserRole();
    if (role === 'Super Admin') {
      this.userForm.get('phone')?.enable(); // To enable the field
      this.userForm.get('role')?.enable(); // Disable the control programmatically
    }

    // Load necessary data
    this.loadDevelopers();

    // Watch for changes in the role field
    this.userForm.get('role')?.valueChanges.subscribe((role: string) => {
      if (role === 'Super Admin') {
        this.hidepermissions = true;
        this.clearAccessibles();
        this.clearPermissions();
      } else {
        this.hidepermissions = false;
      }
    });   
  }

  initializeForm(): void {
    this.userForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: [{ value: '', disabled: true}],
        role: [{value: 'User', disabled: true}, Validators.required],
        accessibleDevelopers: [[]],
        accessibleProjects: [[]],
        accessibleCameras: [[]],
        accessibleServices: [[]],
        canAddUser: [true],        // Permission to add user
        canGenerateVideoAndPics: [true],    // Permission to upload video
      }
    );
    if (this.isEditing) {
      this.loadUserData();
    }
  }

  loadDevelopers(): void {
    this.developerService.getAllDevelopers().subscribe({
      next: (developers) => {
        if (this.isSuperAdmin || (this.accessibleDeveloper[0] === 'all')) {
          this.developers = developers;
        } else {
          this.developers = developers.filter(dev => this.accessibleDeveloper.includes(dev._id));
        }
      },
      error: (error) => console.error('Error fetching developers:', error),
    });
  }



  loadProjectsByDevelopers(developerIds: string[]): void {
    if (developerIds.includes('all')) {
      // Automatically set "all" Project
      this.userForm.get('accessibleProject')?.setValue(['all']);
      this.projects = []; // Disable camera selection
      return;
    }

    this.projects = []; // Clear current projects
    if (developerIds && developerIds.length > 0) {
      developerIds.forEach((developerId) => {
        this.projectService.getProjectsByDeveloper(developerId).subscribe({
        next: (projects) => {        
            if (this.accessibleProject[0] !== 'all' && !this.isSuperAdmin) {
            this.projects = [...this.projects, 
              ...projects.filter(project => this.accessibleProject.includes(project._id))];    // Merge new projects with the existing list       
            } else {
              this.projects = [...this.projects, ...projects];
            }
        },
        error: (error) => console.error('Error fetching projects:', error),
       });
      });
    } else {
      this.projects = []; // Clear projects if no developer is selected
      this.userForm.get('accessibleProjects')?.setValue([]);
    }
  }

  loadCamerasByProjects(projectIds: string[]): void {
    if (this.isSuperAdmin || projectIds.includes('all')) {
      // Automatically set "all" cameras
      this.userForm.get('accessibleCameras')?.setValue(['all']);
      this.cameras = []; // Disable camera selection
      return;
    }

    this.cameras = []; // Clear current cameras
    if (projectIds && projectIds.length > 0) {
      projectIds.forEach((projectId) => {
        this.cameraService.getCamerasByProject(projectId).subscribe({
          next: (cameras) => {
            //this.cameras = [...this.cameras, ...cameras.filter(camera => accessibleCameras.includes(camera._id))]; // Merge new cameras with the existing list
            
            if (this.accessibleCamera[0] !== 'all') {
              this.cameras = [...this.cameras, 
                ...cameras.filter(cameras => this.accessibleProject.includes(cameras._id))];    // Merge new projects with the existing list       
              } else {
                this.cameras = [...this.cameras, ...cameras];
              }
          
          },
          error: (error) => console.error('Error fetching cameras:', error),
        });
      });
    } else {
      this.cameras = []; // Clear cameras if no project is selected
      this.userForm.get('accessibleCameras')?.setValue([]);
    }
  }

  loadUserData(): void {
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe((user) => {
        console.log(user);
        this.loadProjectsByDevelopers(user.accessibleDevelopers);
        this.userForm.patchValue(user);
        this.resetEmail = user.email;
      });
    }
  }


  onSelectionChange(field: string, event: any): void {
    const selectedValues = event.value;

    if (field === 'accessibleDevelopers') {
      if (selectedValues.includes('all')) {
        // When "All" is selected
        this.isAllDevSelected = true;
        this.userForm.get('accessibleDevelopers')?.setValue(['all']);

        // Automatically set "all" for projects and cameras
        this.userForm.get('accessibleProjects')?.setValue(['all']);
        this.userForm.get('accessibleCameras')?.setValue(['all']);
        this.projects = []; // Clear list to disable selection
        this.cameras = [];
      } else {
        // When "All" is deselected
        this.isAllDevSelected = false;
        this.userForm.get('accessibleDevelopers')?.setValue(selectedValues);

        // Reload projects and cameras based on the current developer selection
        this.loadProjectsByDevelopers(selectedValues);
        this.loadCamerasByProjects([]);
      }
    }

    if (field === 'accessibleProjects') {
      if (selectedValues.includes('all')) {
        // When "All" is selected
        this.isAllProjSelected = true;
        this.userForm.get('accessibleProjects')?.setValue(['all']);
        this.cameras = []; // Clear cameras since "all" projects are selected
      } else {
        // When "All" is deselected
        this.isAllProjSelected = false;
        this.userForm.get('accessibleProjects')?.setValue(selectedValues);

        // Reload cameras based on the current project selection
        this.loadCamerasByProjects(selectedValues);
      }
    }

    if (field === 'accessibleCameras') {
      if (selectedValues.includes('all')) {
        // When "All" is selected
        this.isAllCameraSelected = true;
        this.userForm.get('accessibleCameras')?.setValue(['all']);
      } else {
        // When "All" is deselected
        this.isAllCameraSelected = false;
        this.userForm.get('accessibleCameras')?.setValue(selectedValues);
      }
    }

    if (field === 'accessibleServices') {
      if (selectedValues.includes('all')) {
        // When "All" is selected
        this.isAllServiceSelected = true;
        this.userForm.get('accessibleServices')?.setValue(['all']);
      } else {
        // When "All" is deselected
        this.isAllServiceSelected = false;
        this.userForm.get('accessibleServices')?.setValue(selectedValues);
      }
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const userData = this.userForm.value;

    if (this.isEditing) {
      this.userService
        .updateUser(this.userId!, userData)
        .subscribe(() => {
          this.submitted = true;
          this.resetEmail = userData.email;
          console.log('User updated successfully');
        });
    } else {
      this.userService.addUser(userData).subscribe((response: any) => {
        this.submitted = true;
        this.userId = response._id; // Assuming the backend returns `user_id` in the response
        this.resetEmail = userData.email;
        console.log('User added successfully');
      });
    }
  }

  clearAccessibles(): void {
    // Clear accessible fields and their dependent dropdowns
    this.userForm.get('accessibleDevelopers')?.setValue([]);
    this.userForm.get('accessibleProjects')?.setValue([]);
    this.userForm.get('accessibleCameras')?.setValue([]);
    this.userForm.get('accessibleServices')?.setValue([]);
  }

  clearPermissions(): void {
    this.userForm.get('canAddUser')?.setValue(false);
    this.userForm.get('canGenerateVideoAndPics')?.setValue(false);
  }

  sendResetPasswordLink(): void {
    if (!this.resetEmail || !this.userId) {
      alert('Missing user ID or email address.');
      return;
    }

    this.userService.sendResetPasswordLink(this.userId, this.resetEmail).subscribe({
      next: () => { 
        alert('Reset password link sent successfully.');
        this.router.navigate(['/users']);
      },
      error: () => alert('Failed to send reset password link.'),
    });
  }

  useCurrentPassword(): void {
    this.router.navigate(['/users']);
  }


}
