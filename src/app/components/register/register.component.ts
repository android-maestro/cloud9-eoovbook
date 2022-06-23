
import { ApiService } from '../../services/api.service';
import { Component, Directive, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';
// import { AuthenticationService } from '../../services/authentication.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastService } from '../../services/toast.service';
import {CountryISO, SearchCountryField } from "ngx-intl-tel-input";
// import {
//   SocialAuthService,
//   GoogleLoginProvider,
//   SocialUser,
// } from 'angularx-social-login';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  bsInlineValue = new Date();
  
  bsValue = new Date();
  token:any='';
   maxDate = new Date();
   minDate = new Date();
   currentData: Date;
   res:any;
   fieldTextType: boolean=false;
   fieldTextTypeconfirm: boolean=false;
   trending:any;
   separateDialCode = false;
  SearchCountryField = SearchCountryField;
   CountryISO = CountryISO;
   number:any;
  //  socialUser!: SocialUser;
   isLoggedin?: boolean;
   preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom
  ];
  
   public message = "Please Fill all required fields";

   toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
    
  }
  toggleFieldTextTypeConfirm(){
    this.fieldTextTypeconfirm = !this.fieldTextTypeconfirm;
  }

validationStatus:boolean = true;
 postData = {
    name: '',
    email: '',
    mobile: '',
    Password: ''
  };
emailError:string='null';
mobileError:string='null';
storage = window.localStorage;

  form: FormGroup = new FormGroup({});  
  constructor(private fb: FormBuilder,private http: ApiService,
     public router: Router,private route: ActivatedRoute,
     public toast:ToastService,
     )
      {
      this.minDate.setDate(this.minDate.getDate() - 100*365);
      this.maxDate.setDate(this.maxDate.getDate());
      this.currentData = new Date();
     this.currentData.setFullYear(this.minDate.getFullYear() +78);
    this.form = this.fb.group({
      Name: ['', Validators.required ],
      Email: ['', Validators.required], 
      Gender: ['', Validators.required], 
      agree: ['', Validators.required], 
      Password: ['', Validators.required],
      ConfirmPassword: ['', Validators.required],
      DateOfBirth: ['', Validators.required],
      Mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
      });

    this.token = this.route.snapshot.queryParamMap.get('token');
   }



  ngOnInit(): void {
    
    
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
  	 	 this.http.get('/TrendingNewsLeftPanel/'+userData.Email+'/4/0').subscribe(
        (res: any) => {
          if(res.status==true) {
          	this.trending = res.data;
          }else{          }
        },
        (error: any) => {
        }
      );

      // this.socialAuthService.authState.subscribe((user) => {
      //   this.socialUser = user;
      //   this.isLoggedin = user != null;
      //   console.log(this.socialUser);
      // });
 
  }

  
submit(){
  this.number = this.form.value.Mobile;
  this.form.value.Token = this.token; 
  this.form.value.CountryCode = '91';
  // this.form.value.Mobile= this.number.number;
    if(this.form.valid){
     this.http.post('/RegisterEoovBookUser',this.form.value).subscribe(
        (res: any) => {
          if (res.status==true) {  
            this.otp(this.form.value.Mobile,this.form.value.Email); 
          } else {
            console.log(res.message);
            
          }
        },
        (error: any) => {
          
        }
      );
  }else{
    console.log('invalid');
    this.toast.warning(this.message,'Oops!!');
  }
  
}

 otp(mobile,email) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        mobile:mobile,
        email:email,
      }
    };
    this.router.navigate(['/otp'], navigationExtras);
  }

emailVerify(){
    this.http.get('/CheckEmailExists/'+this.form.value.Email).subscribe(
        (res: any) => {
          if (res.status==true) {
            if(res.data==true){
              this.emailError = 'Email-ID is already exist!';
            }else{
              this.emailError = 'null';
            }
          } else {
            this.emailError = 'null';
          }
        },
        (error: any) => {
        }
      );
}

mobileVerify(){
    this.http.get('/CheckMobileExists/'+this.form.value.Mobile+'/91').subscribe(
        (res: any) => {
          if (res.status==true) {
            if(res.data==true){
              this.mobileError = 'Mobile number already exist!';
            }else{
              this.mobileError = 'null';
            }
          } else {
             this.mobileError = 'null';
          }
        },
        (error: any) => {
        }
      );

}

singleNews(id){
  let navigationExtras: NavigationExtras = {
   queryParams: {
     newsId:id,
   }
 };
 this.router.navigate(['/SingleNews'], navigationExtras);
}

// loginWithGoogle(): void {
//   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
// }


}

@Directive({
  selector: '[appConfirmEqualValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ConfirmEqualValidatorDirective,
    multi: true
  }]
})

export class ConfirmEqualValidatorDirective implements Validators{
  @Input() appConfirmEqualValidator: string = '';
  validate(control:AbstractControl):{[key:string]: any} | null{
    const controlToCompare = control.parent?.get(this.appConfirmEqualValidator);
    if(controlToCompare && controlToCompare.value !== control.value){
      return{'notEqual' : true};
    }
    return null;

  }

}


