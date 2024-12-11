import { Role } from './../interfaces/role';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LoginRequest } from '../interfaces/login-request';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../interfaces/auth-response';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';
import { UserDetail } from '../interfaces/user-detail';
import { UpdateUserDetail } from '../interfaces/UpdateUserDetail';
import { Task } from '../interfaces/Task';
import { CreateTaskRequest } from '../interfaces/create-task-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl: string = environment.apiUrl;
  private tokenKey = 'token';

  // Cache variables
  private userDetailCache = new BehaviorSubject<UserDetail | null>(null);
  private rolesCache = new BehaviorSubject<string[] | null>(null);
  private allUsersCache = new BehaviorSubject<UserDetail[] | null>(null);
  private completedTasksCache = new BehaviorSubject<Task[] | null>(null);

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/account/login`, data).pipe(
      map((response) => {
        if (response.isSuccess) {
          localStorage.setItem(this.tokenKey, response.token);
          this.clearCaches(); // Clear caches on login
        }
        return response;
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/account/register`, data);
  }

  getDetail(): Observable<UserDetail> {
    if (this.userDetailCache.value) {
      return of(this.userDetailCache.value);
    }
    return this.http.get<UserDetail>(`${this.apiUrl}/Account/detail`).pipe(
      tap((detail) => this.userDetailCache.next(detail))
    );
  }

  getUserDetail() {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);

    const userDetail: UserDetail = {
      id: decodedToken.nameid || '', // Adjust as necessary
      fullName: decodedToken.name || '', // Adjust as necessary
      email: decodedToken.email || '', // Adjust as necessary
      roles: decodedToken.role || [],
      phoneNumber: '', // Default or fetch from API if needed
      twoFactorEnabled: true, // Default or fetch from API if needed
      phoneNumberConfirmed: true, // Default or fetch from API if needed
      accessFailedCount: 0, // Default or fetch from API if needed
    };

    this.userDetailCache.next(userDetail); // Cache the user detail
    return userDetail;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired();
  }

  private isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded['exp']! * 1000;
    if (isTokenExpired) this.logout();
    return isTokenExpired;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.clearCaches(); // Clear all caches on logout
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || '';
  }

  getAll(): Observable<UserDetail[]> {
    if (this.allUsersCache.value) {
      return of(this.allUsersCache.value);
    }
    return this.http.get<UserDetail[]>(`${this.apiUrl}/account`).pipe(
      tap((users) => this.allUsersCache.next(users))
    );
  }

  getRoles(): string[] | null {
    if (this.rolesCache.value) {
      return this.rolesCache.value;
    }
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);

    const roles = decodedToken.role || [];
    this.rolesCache.next(roles); // Cache the roles
    return roles;
  }

  updateUserDetail(data: UpdateUserDetail): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/account/update`, data).pipe(
      tap(response => {
        if (response.isSuccess) {
          this.refreshUserDetailCache(data); // Update the user detail cache
        }
      })
    );
  }

  getTasksForUser(): Observable<Task[]> {
    const user = this.getUserDetail();
    if (!user) {
      return of([]);
    }
    const userEmail = user.email.trim().toLowerCase();
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`).pipe(
      map((tasks) =>
        tasks.filter((task) => {
          const relevantEmails = (task.relevantEmployeeEmails || []).map(email => email.trim().toLowerCase());
          const relevantEmployees = (task.relevantEmployees || []).map(email => email.trim().toLowerCase());
          return relevantEmails.includes(userEmail) || relevantEmployees.includes(userEmail);
        })
      )
    );
  }

  getAllCompletedTasks(): Observable<Task[]> {
    if (this.completedTasksCache.value) {
      return of(this.completedTasksCache.value);
    }
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`).pipe(
      map((tasks) => tasks.filter((task) => task.isCompleted)),
      tap((completedTasks) => this.completedTasksCache.next(completedTasks))
    );
  }

  completeTask(taskId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/tasks/${taskId}/complete`, {});
  }

  rateTask(taskId: number, rating: number, feedback: string): Observable<void> {
    const ratingData = { rating, feedback };
    return this.http.post<void>(`${this.apiUrl}/tasks/${taskId}/rate`, ratingData);
  }

  createTask(taskData: CreateTaskRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/tasks/create`, taskData);
  }

  // Cache Update Methods
  private updateCache<T>(cache: BehaviorSubject<T | null>, updatedValue: T): void {
    cache.next(updatedValue);
  }

  private refreshUserDetailCache(updatedDetail: Partial<UserDetail>): void {
    const current = this.userDetailCache.value;
    if (current) {
      const updated = { ...current, ...updatedDetail };
      this.userDetailCache.next(updated);
    }
  }

  private refreshCompletedTasksCache(taskId: number): void {
    const current = this.completedTasksCache.value;
    if (current) {
      const updatedTasks = current.map(task => task.id === taskId ? { ...task, isCompleted: true } : task);
      this.completedTasksCache.next(updatedTasks);
    }
  }

  private addToCompletedTasksCache(newTask: Task): void {
    const current = this.completedTasksCache.value;
    if (current) {
      this.completedTasksCache.next([...current, newTask]);
    } else {
      this.completedTasksCache.next([newTask]);
    }
  }


  addUserToCache(newEmployee: UserDetail): void {
    const cachedUsers = this.allUsersCache.value || [];
    const existingUser = cachedUsers.find(user => user.id === newEmployee.id);

    if (!existingUser) {
      this.allUsersCache.next([...cachedUsers, newEmployee]); // Add the new user only if not already in cache
      console.log('User added to cache:', newEmployee);
    } else {
      console.warn('User already exists in cache, skipping add:', newEmployee);
    }
  }

  updateUserCache(updatedEmployee: UserDetail): void {
    const cachedUsers = this.allUsersCache.value || [];
    const index = cachedUsers.findIndex(user => user.id === updatedEmployee.id);
    if (index !== -1) {
      cachedUsers[index] = updatedEmployee;
      this.allUsersCache.next([...cachedUsers]);
    }
  }

  createEmployee(employeeData: any): Observable<UserDetail> {
    return this.http.post<UserDetail>(`${this.apiUrl}/account/register`, employeeData).pipe(
      tap(newEmployee => this.addUserToCache(newEmployee)) // Update the cache
    );
  }

  updateEmployee(employeeData: any): Observable<UserDetail> {
    return this.http.post<UserDetail>(`${this.apiUrl}/account/update`, employeeData).pipe(
      tap(updatedEmployee => this.updateUserCache(updatedEmployee)) // Update cache
    );
  }


  // Utility to clear caches
  private clearCaches() {
    this.userDetailCache.next(null);
    this.rolesCache.next(null);
    this.allUsersCache.next(null);
    this.completedTasksCache.next(null);
  }
}
