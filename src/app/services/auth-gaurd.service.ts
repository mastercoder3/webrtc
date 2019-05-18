import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurdService implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean{
    if(localStorage.getItem('rid') != null || undefined)
      return true;
    else{
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
