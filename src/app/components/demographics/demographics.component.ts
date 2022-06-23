import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AppComponent } from '../../app.component';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';
import { Country, State, City }  from 'country-state-city';

@Component({
  selector: 'app-demographics',
  templateUrl: './demographics.component.html',
  styleUrls: ['./demographics.component.css']
})
export class DemographicsComponent implements OnInit {
  data:any;
  loginError:any;
  validate:string='null';
  then:any;
  country: any = [];
  state: any = [];
  cities: any = [];
  stateiso: string = "";

selectedItemsRegion:any=[];
storage = window.localStorage;
postData:any=[];
    form: FormGroup = new FormGroup({});  
    constructor(private fb: FormBuilder,private http: ApiService,
       public router: Router,
       private appComponent:AppComponent,
      private route: ActivatedRoute) {
 
      }



  ngOnInit(): void {

  	 this.http.get('/AllDemographic').subscribe(
        (res: any) => {
          if(res.status==true) {
          	this.data = res.data;
          }else{          }
        },
        (error: any) => {
        }
      );
  	//   this.http.get('/AllCountry').subscribe(
    //     (res: any) => {
    //       if(res.status==true) {
    //       	this.country = res.data;
    //       	console.log(this.country);
    //       }else{          }
    //     },
    //     (error: any) => {
    //     }
    //   );

    //     this.http.get('/AllState/cadca237-5897-42e4-a138-bc11c2639d2f').subscribe(
    //     (res: any) => {
    //       if(res.status==true) {
    //       	this.state = res.data;
    //       	console.log(this.state);
    //       }else{     
    //            }
    //     },
    //     (error: any) => {
    //     }
    //   );

    //        this.http.get('/AllCity/56684f3f-547a-4a34-9f80-5dd44cbec28f').subscribe(
    //     (res: any) => {
    //       if(res.status==true) {
    //       	this.city = res.data;
    //       }else{     
    //            }
    //     },
    //     (error: any) => {
    //     }
    //   );

    this.country = Country.getAllCountries();

	  }

	  // fetchCity(event,value){
	  // 	console.log(value)
	  // this.http.get('/AllCity/'+value).subscribe(
    //     (res: any) => {
    //       if(res.status==true) {
    //       	this.city = res.data;
    //       	console.log(this.state);
    //       }else{     
    //            }
    //     },
    //     (error: any) => {
    //     }
    //   );
	  // }
	  // fetchState(event,value){
	  // 	console.log(value)
	  // this.http.get('/AllCity/'+value).subscribe(
    //     (res: any) => {
    //       if(res.status==true) {
    //       	this.city = res.data;
    //       	console.log(this.state);
    //       }else{     
    //            }
    //     },
    //     (error: any) => {
    //     }
    //   );
	  // }

    onChangeCountry(id: string){

      this.state = State.getStatesOfCountry(id);
        
      
      
      // console.log(this.state);
    
    }
  
    onChangeState(iso : any, cid: any){
  
      
      this.cities = City.getCitiesOfState(cid[0].countryCode, iso);
      // console.log(this.cities);
      // console.log(iso);
      // console.log(cid[0].countryCode);
      // console.log(cs);
    }

  onItemSelectItem(event){
  	if(event.target.checked){
  		this.validate='null';
  		this.selectedItemsRegion.push(event.target.value);
  	}else{
  		this.selectedItemsRegion.forEach((element,index)=>{
		   if(element==event.target.value) delete this.selectedItemsRegion[index];
		});
		if(this.selectedItemsRegion.length==0){
			this.validate ="Please choose atleast 1 demographics";
		}
  	}
  	console.log(this.selectedItemsRegion);
  }

  submit(){
  	if(this.selectedItemsRegion.length>0){
  		var userData = JSON.parse(this.storage.getItem('userData') || '{}');
  		 this.form.value.Mobile = userData.Mobile;
  		 this.form.value.Email = userData.Email;
  		 this.form.value.CountryId = this.postData.CountryId;
  		 this.form.value.StateId = this.postData.StateId;
  		 this.form.value.CityId = this.postData.CityId;
  		 this.form.value.Demographics = this.selectedItemsRegion;
  		console.log(this.form.value);
     this.http.post('/SaveUserLocation',this.form.value).subscribe(
        (res: any) => {
          if (res.status==true) {
            this.router.navigate(['/dashboard'])
            .then(() => {
              window.location.reload();
            });
          } else {
           this.validate = 'Something went wrong, Please try again later.';
          }
        },
        (error: any) => {
        }
      );

        this.http.post('/SaveUserDemographic',this.form.value).subscribe(
        (res: any) => {
          if (res.status==true) {
            localStorage.setItem('userData',JSON.stringify(res.data));
              localStorage.setItem('token',JSON.stringify(res.data.Token));
            this.router.navigate(['/redirect']);
            this.appComponent.ngOnInit();
            this.loginError = false;
            
          } else {
           this.validate = 'Something went wrong, Please try again later.';
          }
        },
        (error: any) => {
        }
      );
  }else{
    this.validate = 'Please choose atleast 1 demographics';
  }
  }

  skip(){
    this.router.navigate(['/dashboard'])
            .then(() => {
              window.location.reload();
            });
}
	  
     
     }
