import { Role } from './../interfaces/role';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LoginRequest } from '../interfaces/login-request';
import { Observable, map, of } from 'rxjs';

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

  apiUrl : string  = environment.apiUrl;
  private tokenKey = 'token'

  constructor(private http: HttpClient) {}

  login(data : LoginRequest): Observable<AuthResponse>{

    return this.http.post<AuthResponse>(`${this.apiUrl}/account/login`, data).pipe(
      map((response) =>{

        if(response.isSuccess){
          localStorage.setItem(this.tokenKey,response.token);
        }

        return response;
      })
    )
  }

  register(data : RegisterRequest): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}/account/register`, data);
  }


  getDetail =():Observable<UserDetail>=>
    this.http.get<UserDetail>(`${this.apiUrl}/Account/detail`)

  getUserDetail =()=>{
    const token = this.getToken();
    if(!token) return null;
    const decodedToken : any = jwtDecode(token);

    const UserDetail = {
      id : decodedToken.nameid,
      fullName : decodedToken.name,
      email : decodedToken.email,
      roles : decodedToken.role || [],
    }

    return UserDetail;
  }

  isLoggedIn = ():boolean =>{
    const token = this.getToken();
    if(!token) return false;

    return !this.isTokenExpired();

  }


  private isTokenExpired() {
    const token = this.getToken();
    if(!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded['exp']! *1000;
    if(isTokenExpired) this.logout;
    return isTokenExpired;
  }

  logout=():void =>{
    localStorage.removeItem(this.tokenKey);
  };


  getToken = ():string|null => localStorage.getItem(this.tokenKey)|| '';

  getAll = (): Observable<UserDetail[]> => this.http.get<UserDetail[]>(`${this.apiUrl}/account`);

  getRoles = (): string[] | null =>{
    const token = this.getToken();
    if(!token) return null;
    const decodedToken : any = jwtDecode(token);

    return decodedToken.role || null;

  }
  updateUserDetail(data: UpdateUserDetail): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/account/update`, data);
  }

  getTasksForUser(): Observable<Task[]> {
    const user = this.getUserDetail();

    if (!user) {
      // console.log("User details are not available.");
      return of([]); // Using 'of' from RxJS to return an observable with an empty array
    }

    const userEmail = user.email.trim().toLowerCase();
    // console.log("User email:", userEmail); // Log the user email

    return this.http.get<Task[]>(`${this.apiUrl}/tasks`).pipe(
      map((tasks) => {
        // console.log("Fetched tasks:", tasks); // Log all fetched tasks

        // Filter tasks based on the user's email
        const filteredTasks = tasks.filter((task) => {
          const relevantEmails = (task.relevantEmployeeEmails || []).map(email => email.trim().toLowerCase());
          const relevantEmployees = (task.relevantEmployees || []).map(email => email.trim().toLowerCase());

          const match = relevantEmails.includes(userEmail) || relevantEmployees.includes(userEmail);

          if (match) {
            // console.log("Matched task:", task); // Log each matched task
          } else {
            // console.log("Task did not match:", task); // Log each task that did not match
          }

          return match;
        });

        // console.log("Filtered tasks:", filteredTasks); // Log the filtered tasks array

        return filteredTasks;
      })
    );
  }

  getAllCompletedTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`).pipe(
      map((tasks) => tasks.filter((task) => task.isCompleted))
    );
  }

  completeTask(taskId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/tasks/${taskId}/complete`, {});
  }

  // New method: Add rating and feedback to a task
  rateTask(taskId: number, rating: number, feedback: string): Observable<void> {
    const ratingData = { rating, feedback };
    return this.http.post<void>(`${this.apiUrl}/tasks/${taskId}/rate`, ratingData);
  }

  createTask(taskData: CreateTaskRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/tasks/create`, taskData);
  }



}
