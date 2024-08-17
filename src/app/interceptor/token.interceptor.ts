import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if(authService.getToken()){
    const cloned = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authService.getToken())
    });

    return next(cloned);
  }

  return next(req);
};
