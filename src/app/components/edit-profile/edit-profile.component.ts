import { Component, OnInit, TemplateRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  userData:any;
  profilePic:any;
  personalInfo:any;
  UserEmail:any;
  country:any;
  state:any;
  city:any;
  Education:any;
  Occupation : any;
  postData:any=[];
  isAddMode: boolean=false;
  storage = window.localStorage;
  InsertProfileform: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder,public http: ApiService,
    public router: Router, private _route:ActivatedRoute,
    public toast:ToastService,
    private modalService: BsModalService) {

      this.InsertProfileform = this.fb.group({
        AboutMe: ['', [Validators.required,Validators.maxLength(100) ]],
        BloodGroup: ['', Validators.required ],
        Hobbies: ['', Validators.required],
        CountryId: ['', Validators.required],
        CityId: ['', Validators.required],
        StateId: ['', Validators.required],
        Education: ['', Validators.required],
        WorkExperience: ['', Validators.required],
        FacebookLink: ['', Validators.required],
        TwitterLink: ['', Validators.required],
        GoogleLink: ['', Validators.required],
        InstragramLink: ['', Validators.required],
        LinkedInLink: ['', Validators.required],
        VKLink: ['', Validators.required]
        });

     }

  ngOnInit(): void {
    this.userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.profilePic = this.userData.ProfileImage;
    this.UserEmail = this.userData.Email;

    this.isAddMode = this.UserEmail; 

    this.http.get('/ProfileDetail/'+this.userData.Email).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.personalInfo = res.data.PersonalInfo;
          this.Education = res.data.Educations;
          this.Occupation = res.data.Occupations;
        }else{          }
      },
      (error: any) => {
      }
    );

    this.http.get('/AllCountry').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.country = res.data;
          console.log(this.country);
        }else{          }
      },
      (error: any) => {
      }
    );

      this.http.get('/AllState/cadca237-5897-42e4-a138-bc11c2639d2f').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.state = res.data;
          console.log(this.state);
        }else{     
             }
      },
      (error: any) => {
      }
    );

         this.http.get('/AllCity/56684f3f-547a-4a34-9f80-5dd44cbec28f').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.city = res.data;
        }else{     
             }
      },
      (error: any) => {
      }
    );
  }

  fetchCity(event,value){
    console.log(value)
  this.http.get('/AllCity/'+value).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.city = res.data;
          console.log(this.state);
        }else{     
             }
      },
      (error: any) => {
      }
    );
  }
  fetchState(event,value){
    console.log(value)
  this.http.get('/AllCity/'+value).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.city = res.data;
          console.log(this.state);
        }else{     
             }
      },
      (error: any) => {
      }
    );
  }

  addDetails(){ 
    debugger;
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    // this.InsertProfileform.value.CountryId = this.postData.CountryId;
  	// 	 this.InsertProfileform.value.StateId = this.postData.StateId;
  	// 	 this.InsertProfileform.value.CityId = this.postData.CityId;
    console.log(this.InsertProfileform.value);
    this.http.post('/InsertProfileDetail/'+userData.Email,this.InsertProfileform.value).subscribe(
      (res: any) => {
        if (res.status==true) {  
          this.toast.success('Profile Added Successfully','Great !!');
            this.router.navigate(['/profile/'+userData.Email]);
        } else {
          console.log(res.message);
          
        }
      },
      (error: any) => {
        
      }
    );
  }

  UpdateDetails(){
    debugger;
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    // this.InsertProfileform.value.CountryId = this.postData.CountryId;
  	// 	 this.InsertProfileform.value.StateId = this.postData.StateId;
  	// 	 this.InsertProfileform.value.CityId = this.postData.CityId;
    console.log(this.InsertProfileform.value);
    this.http.post('/ModifyProfileDetail/'+userData.Email,this.InsertProfileform.value).subscribe(
      (res: any) => {
        if (res.status==true) {  
          this.toast.success('Profile Updated Successfully','Great !!');
            this.router.navigate(['/profile/'+userData.Email]);
        } else {
          console.log(res.message);
          
        }
      },
      (error: any) => {
        
      }
    );
  }

}
