import { Component, OnInit,TemplateRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { ImageCroppedEvent , base64ToFile } from 'ngx-image-cropper';
import { ToastService } from '../../services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-timeline-header',
  templateUrl: './timeline-header.component.html',
  styleUrls: ['./timeline-header.component.css']
})
export class TimelineHeaderComponent implements OnInit {
  validateImage:string='null';
  image:any;
  profilePic:any;
  validate:string='null';
  fileToUpload:string='';
  imageChangedEvent: any = '';
  croppedImage: any = '';
  public imagePath;
  thumbnail: any;
  userData:any;
  modalRef?: BsModalRef;
  personalInfo:any;
  message: string = '';

  storage = window.localStorage;

  constructor(private http: ApiService,
    private modalService: BsModalService,
    public router: Router,
     public toast:ToastService,
     private route: ActivatedRoute,
     private fb: FormBuilder,  private modalSer:NgbModal) { }

  ngOnInit(): void {
    this.userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.profilePic = this.userData.ProfileImage;

    this.http.get('/ProfileDetail/'+this.userData.Email).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.personalInfo = res.data.PersonalInfo;
        }else{          }
      },
      (error: any) => {
      }
    );
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  deleteModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef?.hide();
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
}
