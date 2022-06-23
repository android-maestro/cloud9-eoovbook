import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  storage = window.localStorage;
  clicked:boolean=false;
  fieldTextTypepassword: boolean=false;
  fieldTextType: boolean=false;
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  
  socialUser: any;
  isLoggedin?: boolean;
  
  otpError:string='null';
  form: FormGroup = new FormGroup({});  
  loginError:boolean=false;

    constructor(private fb: FormBuilder,
      private http: ApiService,
      private appComponent:AppComponent,
      public router: Router,
      ) {
        
      this.form = this.fb.group({
        LoginId: ['', Validators.required], 
        Password: ['', Validators.required],
        });
     }
  
    ngOnInit(): void {

      
    }
  
  
  login(){ 
      if(this.form.valid){
        this.clicked = true;
       this.http.post('/SignIn',this.form.value).subscribe(
          (res: any) => {
            if(res.status==true) {
              localStorage.setItem('userData',JSON.stringify(res.data));
              localStorage.setItem('token',JSON.stringify(res.data.Token));
              this.router.navigate(['/dashboard'])
              .then(() => {
                window.location.reload();
              });
  
              this.appComponent.ngOnInit();
              this.loginError = false;
  
            }else{
              this.loginError = true;
              this.clicked = false;
            }
          },
          (error: any) => {
            this.clicked = false;
          }
        );
    }else{
      console.log('not validated');
    }
    
  }
  
  // loginWithGoogle(): void {
  //   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }
  
  // logOut(): void {
  //   this.socialAuthService.signOut();
  // }
  
  // signInWithGoogle(): void {
  //   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(x => console.log(x));
  // }
}
