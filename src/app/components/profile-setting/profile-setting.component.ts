import { ApiService } from '../../services/api.service';
import { Component, Directive, Input, OnInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { ImageCroppedEvent , base64ToFile } from 'ngx-image-cropper';
import { ToastService } from '../../services/toast.service';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.css']
})
export class ProfileSettingComponent implements OnInit {
validateImage:string='null';
image:any;
profilePic:any;
validate:string='null';
data:any;
country:any;
userData:any;
state:any;
city:any;
postData:any=[];
selectedItemsRegion:any=[];
modalRef?: BsModalRef;
thumbnail: any;
fileToUpload:string='';
imageChangedEvent: any = '';
croppedImage: any = '';
public imagePath;
privacy:any;
loginId:any;
personalInfo:any;
friends:any;
storage = window.localStorage;
privacyform: FormGroup = new FormGroup({});


  constructor(private http: ApiService,
    private modalService: BsModalService,
    public router: Router,
     public toast:ToastService,
     private fb: FormBuilder,
     private _route:ActivatedRoute) {

      this.privacyform = this.fb.group({
        Privacy: ['', Validators.required ],
        });
      }

  ngOnInit(): void {
    this.userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.profilePic = this.userData.ProfileImage;

    this.http.get('/ProfileDetail/'+this.userData.Email).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.personalInfo = res.data.PersonalInfo;
          this.privacyform.controls['Privacy'].setValue(this.personalInfo.AccessTypeId);
          res.data.personalInfo.AccessTypeId = this.privacyform.controls['Privacy'].value;
          console.log(this.personalInfo.AccessTypeId);
        }else{          }
      },
      (error: any) => {
      }
    );

    this.http.get('/DashboardData/'+this.userData.Email+'/10/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.friends = res.data.acceptedFriends;
        }else{          }
      },
      (error: any) => {
      }
    );
    

    this.http.get('/AllDemographic').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.data = res.data;
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
    
    this.http.get('/GetProfileAccessOptions').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.privacy = res.data;
        }else{          }
      },
      (error: any) => {
      }
    );

    this.getPrivacy();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  
imageCropped(event: ImageCroppedEvent) {
  this.thumbnail = event.base64;
}

dataURItoBlob(dataURI): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}
imageLoaded() {
  // show cropper
}
cropperReady() {
  // cropper ready
}
loadImageFailed() {
  // show message
}
processFile(file){
  this.imageChangedEvent = file;
  var files = file.target.files;
this.image = files.item(0);
    this.validateImage = 'null';

    var reader = new FileReader();
  this.imagePath = files;
  reader.readAsDataURL(files[0]); 
  reader.onload = (_event) => { 
    this.thumbnail = reader.result; 
  }
}


  upload(){
  	var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    const formData: FormData = new FormData();
    const fileToUpload: File = new File([this.dataURItoBlob(this.thumbnail)], 'filename.png');
    console.log(fileToUpload);
    formData.append('file',fileToUpload);

       this.http.postMultipart('/UploadProfilePhoto/'+userData.Mobile,formData).subscribe(
        (res: any) => {
          if (res.status==true) {
            this.toast.success('Profile Updated Successfully','Great !!');
            this.router.navigate(['/profile-setting']);
            this.profilePic = res.data;
            userData.ProfileImage = res.data;
            this.modalRef?.hide();
            this.storage.setItem('userData',JSON.stringify(userData)); 
          } else {
            console.log(res.message);
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

savePrivacy(){
  var userData = JSON.parse(this.storage.getItem('userData') || '{}');
  this.loginId = this.userData.Email;
  console.log(this.loginId);
  

this.http.post('/ModifyProfilePermission/'+ this.privacyform.value.Privacy+ '/'+ this.loginId ,this.privacyform.value).subscribe(
  (res: any) => {
    if (res.status==true) {
      this.toast.success(res.message,'Settings Updated Successfully!!');
    } else {
      console.log(this.privacyform.value.Privacy);
    }
  },
  (error: any) => {
    console.log(this.privacyform.value.Privacy);
  }
);
}

getPrivacy(){
  
  this.privacyform.controls['Privacy'].setValue(this.personalInfo.AccessTypeId);

}

}
