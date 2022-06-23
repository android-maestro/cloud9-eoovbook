
import { ApiService } from '../../services/api.service';
import { Component, Directive, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';
// import { AuthenticationService } from '../../services/authentication.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
mobileError:string='null';
emailError:string='null';

 form: FormGroup = new FormGroup({});  
  constructor(private fb: FormBuilder,private http: ApiService,
     public router: Router) { 
  	 this.form = this.fb.group({
        Mobile: ['', Validators.required]
      });
  }

  ngOnInit(): void {
  }
mobileVerify(){
    this.http.get('/CheckMobileExists/'+this.form.value.Mobile+'/91').subscribe(
        (res: any) => {
          if (res.status==true) {
            if(res.data==true){
              this.mobileError = 'null';
            }else{
              this.mobileError = 'Mobile number does not exist!';
            }
          } else {
          }
        },
        (error: any) => {
        }
      );

}

submit(){

  this.form.value.CountryCode = '91';
    if(this.form.valid && this.mobileError=='null'){
     this.http.get('/ResetPasswordOTPRequest/'+this.form.value.Mobile).subscribe(
        (res: any) => {
          if (res.status==true) {
               let navigationExtras: NavigationExtras = {
			      queryParams: {
			        mobile:this.form.value.Mobile
			      }
			    };
			    this.router.navigate(['/reset-password'], navigationExtras);
			  
          } else {
            console.log(res.message);
          }
        },
        (error: any) => {
        }
      );
  }else{
    this.mobileError = 'Mobile number does not exist!';
    this.emailError = "Email does not exist";
  }
  
}
}
