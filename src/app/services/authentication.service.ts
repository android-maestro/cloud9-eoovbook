import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authState = new BehaviorSubject(false);
storage = window.localStorage;
  constructor(
    private router: Router
  ) {
 
  }

  ifLoggedIn() {

    this.storage.getItem('userData');
        this.authState.next(true);   
  }
  login(data:any) {
    this.storage.setItem('userData', data);
      // this.router.navigate(['/']);
      this.authState.next(true);
  }

  logout() {
      this.storage.removeItem('userData');
      this.storage.removeItem('token');
      this.authState.next(false);
      this.router.navigate(['/login']);
  }

  isAuthenticated() {
    return this.authState.value;
  }



}