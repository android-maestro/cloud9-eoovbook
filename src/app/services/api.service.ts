import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

 headers = new HttpHeaders().set('Content-Type','application/json');
  options = { headers: this.headers};

  constructor(private http: HttpClient ) { }

  post(serviceName: string, data: any) {
    
    var env = environment.API_URL;
    const url = env+serviceName;
    return this.http.post(url, JSON.stringify(data), this.options);
  }

    get(serviceName: string) {

    var env = environment.API_URL;
    const url = env+serviceName;
    return this.http.get(url);
  }
  delete(serviceName: string) {

    var env = environment.API_URL;
    const url = env+serviceName;
    return this.http.delete(url);
  }
  postMultipart(serviceName: string, data: any) {

    var env = environment.API_URL;
    const url = env+serviceName;
    return this.http.post<any>(url, data, {}).pipe(
      map((result) => {
        return result;
      })
    );
    return this.http.post(url, data, this.options);
  }
  put(serviceName: string, data: any) {

    var env = environment.API_URL;
    const url = env+serviceName;
    return this.http.put<any>(url, data, {}).pipe(
      map((result) => {
        return result;
      })
    );
    return this.http.put(url, data, this.options);
  }

  communitydelete(serviceName: string, data: any){
    
    var env = environment.API_URL;
    const url = env+serviceName;
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: data,
    };
    return this.http.delete(url, option);
  }
}
