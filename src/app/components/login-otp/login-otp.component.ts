import { Component, OnInit ,ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { AppComponent } from '../../app.component';
import { NgOtpInputModule } from 'ng-otp-input';
@Component({
  selector: 'app-login-otp',
  templateUrl: './login-otp.component.html',
  styleUrls: ['./login-otp.component.css']
})
export class LoginOtpComponent implements OnInit {
    @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;
LoginId:any;
  otp: string='';
  otpError:boolean=false;
clicked:boolean=false;
requestOtp:boolean=false;
mobileError:string='null';
emailError:string='null';
storage = window.localStorage;
  form: FormGroup = new FormGroup({});  
  constructor(private fb: FormBuilder,
    private http: ApiService,
     public router: Router,
    private appComponent:AppComponent,
    private route: ActivatedRoute) {
   
      this.form = this.fb.group({
      LoginId: ['', Validators.required], 
      LoginIdMobile: ['', Validators.required], 
      Password: ['', Validators.required],
      });
   }

  ngOnInit(): void {

  }
  onOtpChange(otp) {
     this.otpError = false;
    this.otp = otp;
    if(this.otp.length==4){
      this.clicked = true;
      this.submit();
    }else{
      this.clicked = false;
    }
  }
submit(){
	this.clicked = true;
  this.form.value.Password = this.otp;
  
     this.http.post('/SignInOTP',this.form.value).subscribe(
        (res: any) => {
          if (res.status==true) {
            this.storage.setItem('userData',JSON.stringify(res.data));
            localStorage.setItem('token',JSON.stringify(res.data.Token));
           this.router.navigate(['/dashboard'])
           .then(() => {
            window.location.reload();
          }); 
          
            this.appComponent.ngOnInit();
          } else {
          	this.clicked = false;
            console.log(res.message);
            this.otpError = true;
          }
        },
        (error: any) => {
        	this.clicked = false;
        }
      );
 
  
}

sendOtp(){
   this.clicked = true;
  if(this.form.value.LoginId.length==10){
   this.http.get('/CheckMobileExists/'+this.form.value.LoginId+'/91').subscribe(
        (res: any) => {
            if(res.data==true){
              this.mobileError = 'null';
               this.clicked = false;
               this.LoginId = this.form.value.LoginId;
               this.requestOtp = true;
            }else{
              this.mobileError = 'Mobile number does not exist!';
               this.clicked = false;
               console.log(this.clicked);
            }
        },
        (error: any) => {
        }
      );
  }else{
      this.http.get('/CheckEmailExists/'+this.form.value.LoginId).subscribe(
        (res: any) => {
            if(res.data==true){
              this.emailError = 'null';
              this.clicked = false;
              this.requestOtp = true;

               this.LoginId = this.form.value.LoginId;
            }else{
              this.emailError = 'Email-ID does not exist!';
              this.clicked = false;
            }
        },
        (error: any) => {
        }
      );
  }
}

}
