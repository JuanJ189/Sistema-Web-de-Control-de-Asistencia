import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const aunthGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);
  const token = sessionStorage.getItem('token');
  const user = sessionStorage.getItem('user');

  if (!token || !user){
    router.navigate(['/']);
    return false;
  }

  const userData = JSON.parse(user || '{}');
  const roledata = route.data?.['role'];

  if(roledata && userData.role !== roledata){

    if(userData.role === 'ADMIN'){
      router.navigate(['home']);
    } else if(userData.role === 'OBRERO'){
      router.navigate(['Inicio']);
    }
    return false;
  }

  return true;

};
