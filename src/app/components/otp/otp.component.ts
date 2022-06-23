import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {
mobile:any;
email:any;
count:any;
clicked:boolean=false;
storage = window.localStorage;
  form: FormGroup = new FormGroup({});  
  constructor(private fb: FormBuilder,private http: ApiService,
     public router: Router,
    private route: ActivatedRoute) {
    this.form = this.fb.group({ 
      MobileOTP: ['', Validators.required],
      EmailOTP: ['', Validators.required]
      });

      this.route.queryParams.subscribe(params => {
      if (params) {
        this.mobile = params['mobile'];
        this.email = params['email'];
             }
       });
   }

  ngOnInit(): void {
    
  }

submit(){
  this.clicked = true;
  this.form.value.Code = '91';
  this.form.value.Mobile = this.mobile;
  this.form.value.Email = this.email;

     this.http.post('/VerifyAccount',this.form.value).subscribe(
        (res: any) => {
          if (res.status==true) {
            this.storage.setItem('userData',JSON.stringify(res.data));
            this.storage.setItem('token',JSON.stringify(res.data.Token));
           this.router.navigate(['/demographics']); 
            this.clicked = false;
          } else {
            console.log(res.message);
            this.clicked = false;
          }
        },
        (error: any) => {
        }
      );
 
  
}

  onOtpChangeMobile(otp) {
    this.form.value.MobileOTP = otp;
    if(otp.length==4){
      this.count = 4;
      console.log(this.count);
    }else{
      this.clicked = false;
    }
  }

    onOtpChangeEmail(otp) {
    this.form.value.EmailOTP = otp;
    if(otp.length==4){
      this.count = this.count+4;
    }else{
      this.clicked = false;
    }
    if(this.count==8){
      this.submit();
    }
  }

}
