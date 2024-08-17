import { MatSnackBar} from '@angular/material/snack-bar';
import { inject } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const roles = route.data['roles'] as string[];
  const authService = inject(AuthService);
  const matSnackBar = inject(MatSnackBar);
  const router = inject(Router);

  const userRoles = authService.getRoles();

  if(!authService.isLoggedIn()){
    router.navigate(['/login']);

    matSnackBar.open("you must log in to view this page.", "OK", {
      duration : 5000
    })

    return false;
  }

  if(roles.some((role) => userRoles?.includes(role))) return true;

  router.navigate(['/']);
  matSnackBar.open("you do not have permission to view this page", 'Ok', {
    duration : 4000,

  })

  return false

};
