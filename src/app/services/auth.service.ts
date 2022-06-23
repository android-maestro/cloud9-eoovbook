import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public jwtHelper: JwtHelperService) {}
  // ...
  public isAuthenticated(): boolean {
   
    var token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token??'');
  }

  public getAuthToken():string {
   
    var tkn = localStorage.getItem('token');
    if(tkn!==undefined&&tkn!==''&&tkn!==null){
      return tkn;
    }
    else{
      return '';
    }
  }
}