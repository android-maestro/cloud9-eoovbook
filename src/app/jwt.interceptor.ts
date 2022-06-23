import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {       
        // add auth header with jwt if user is logged in and request is to api url
        if(this.authService.isAuthenticated()){
            const _token=this.authService.getAuthToken().replace(/['"]+/g, '');
            request = request.clone({
                setHeaders: {
                    Authorization: "Bearer "+ _token
                }
            });
        }
        
        return next.handle(request);
    }
}