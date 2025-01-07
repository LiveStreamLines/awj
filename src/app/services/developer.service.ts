import { Injectable } from '@angular/core';
import { environment } from '../../environment/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Developer } from '../models/developer.model';
import { AuthService } from './auth.service';  // Import AuthService to access the auth token


@Injectable({
  providedIn: 'root'
})
export class DeveloperService {
  //private apiUrl = 'https://lslcloud.com/api/main/developers';  // API URL for fetching developers
  private apiUrl = environment.backend + '/api/developers'; 
  private baseUrl = environment.backend + '/api/developers'; 

 // private baseUrl = 'https://liveview.lslcloud.com/api/admin';

  //private apiUrl = 'http://192.168.8.73:5000/api/main/developers';  // API URL for fetching developers
  private developers: Developer[] = [];  // Store developers here

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Fetch all developers
  getAllDevelopers(): Observable<Developer[]> {
    const authh = this.authService.getAuthToken();  // Get auth token from AuthService
    // Set the custom header with the authh token
    const headers = new HttpHeaders({
      'Authorization': authh ? `Bearer ${authh}` : ''  // Send authh header
    });
    // if (this.developers.length > 0) {
    //   // Return the developers if already loaded
    //   return of(this.developers);
    // } else {
      return this.http.get<Developer[]>(this.apiUrl, { headers }).pipe(
        tap((data)=> {
          this.developers = data;
        })
      );
    //}
  }

  getDeveloperIdByTag(developerTag: string): Observable<Developer[]> {
   
    const authh = this.authService.getAuthToken();  // Get auth token from AuthService
    // Set the custom header with the authh token
    const headers = new HttpHeaders({
      'Authorization': authh ? `Bearer ${authh}` : ''  // Send authh header
    });

    return this.http.get<Developer[]>(`${this.apiUrl}/tag/${developerTag}`, {headers});


  }
  
  // Helper function to find the developer ID by tag
  private findDeveloperIdByTag(developerTag: string): string | undefined {
    const developer = this.developers.find(dev => dev.developerTag === developerTag);
    return developer ? developer._id : undefined;
  }

  addOrUpdateDeveloper(formData: FormData, isEditMode: boolean, developerId?: string): Observable<any> {
    const authh = this.authService.getAuthToken(); 
    const headers = new HttpHeaders({ 
      'Authorization': authh ? `Bearer ${authh}` : ''  // Send authh header
    });
    if (isEditMode && developerId) {
      return this.http.put(`${this.baseUrl}/${developerId}`, formData, { headers });
    } else {
      return this.http.post(`${this.baseUrl}/`, formData, { headers });
    }
  }

  // Method to get developer details for editing
  getDeveloperById(developerId: string): Observable<Developer> {
    const authh = this.authService.getAuthToken(); 
    const headers = new HttpHeaders({ 
      'Authorization': authh ? `Bearer ${authh}` : ''  // Send authh header
    });
    return this.http.get<Developer>(`${this.baseUrl}/${developerId}`, { headers });
  }


}
