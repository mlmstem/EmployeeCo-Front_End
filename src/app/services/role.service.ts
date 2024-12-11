import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Role } from '../interfaces/role';
import { RoleCreateRequest } from '../interfaces/role-create-requests';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  apiUrl = environment.apiUrl;

  // Cache for roles
  private rolesCache = new BehaviorSubject<Role[] | null>(null);

  constructor(private http: HttpClient) {}

  fetchRoles(): void {
    // Populate the cache by fetching from the API
    this.http.get<Role[]>(`${this.apiUrl}/Roles`).subscribe((roles) => {
      this.rolesCache.next(roles);
    });
  }

  getRoles(): Observable<Role[]> {
    return this.rolesCache.asObservable();
  }

  createRole(role: RoleCreateRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/Roles`, role).pipe(
      tap(() => this.refreshRolesCache()) // Refresh the cache after creation
    );
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/Roles/${id}`).pipe(
      tap(() => this.refreshRolesCache()) // Refresh the cache after deletion
    );
  }

  assignRole(userId: string, roleId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/Roles/assign`, { userId, roleId }).pipe(
      tap(() => this.refreshRolesCache()) // Refresh the cache after assignment
    );
  }

  // Refresh the roles cache by re-fetching from the API
  private refreshRolesCache(): void {
    this.http.get<Role[]>(`${this.apiUrl}/Roles`).subscribe((roles) => {
      this.rolesCache.next(roles);
    });
  }
}

