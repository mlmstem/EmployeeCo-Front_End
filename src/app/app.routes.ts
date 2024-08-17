import {Component} from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { AccountComponent } from './pages/account/account.component';
import { authGuard } from './guards/auth.guard';
import { UsersComponent } from './users/users.component';
import { roleGuard } from './guards/role.guard';
import { ServiceComponent } from './pages/service/service.component';
import { AboutComponent } from './pages/about/about.component';
import { RoleComponent } from './pages/role/role.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TasksreviewComponent } from './pages/tasksreview/tasksreview.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { ForumComponent } from './pages/forum/forum.component';


export const routes: Routes = [
  {
    path : "login",
    component : LoginComponent,
  },
  {
    path : "",
    component : HomeComponent,
  },
  {
    path : "register",
    component : RegisterComponent,
  },
  {
    path : "account/:id",
    component : AccountComponent,
    canActivate : [authGuard],
  },
  {
    path : "users",
    component : UsersComponent,
    canActivate : [roleGuard],
    data:{
      roles : ['admin'],
    }
  },
  {
    path : "role",
    component : RoleComponent,
    canActivate : [roleGuard],
    data:{
      roles : ['admin'],
    }
  },

  {
    path : "service",
    component : ServiceComponent,
  },
  {
    path : "about",
    component : AboutComponent,
  },

  {
    path : "dashboard",
    component : DashboardComponent,
  },

  {
    path : "tasks-review",
    component : TasksreviewComponent,
    canActivate : [roleGuard],
    data:{
      roles : ['admin'],
    }
  },

  {
    path : "tasks",
    component : TasksComponent,
  },

  {
    path : "calendar",
    component : CalendarComponent,
  },


  {
    path : "forum",
    component : ForumComponent,
  },


];
