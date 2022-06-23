import { Component, OnInit,TemplateRef,ViewEncapsulation,VERSION } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { ImageCroppedEvent , base64ToFile } from 'ngx-image-cropper';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-timeline-photos',
  templateUrl: './timeline-photos.component.html',
  styleUrls: ['./timeline-photos.component.css']
})
export class TimelinePhotosComponent implements OnInit {
  personalInfo:any;
  BeforeSlideDetail:any;
  storage = window.localStorage;
  showFlag: boolean = false;
  selectedImageIndex: number = -1;
  currentIndex:any;
  popupImages: any = '';
  userImages:any;
  userData:any;
  profilePic:any;

  constructor(private http: ApiService,
    private modalService: BsModalService,public toast:ToastService,
    private route: ActivatedRoute,public router: Router) { }

  ngOnInit(): void {
    this.userData = JSON.parse(this.storage.getItem('userData') || '{}');

    this.http.get('/GetLoggedInUserImages/'+this.userData.Email+'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.userImages = res.data;
          this.popupImages = res.data[0].PostImageName;
          console.log(this.popupImages);
        }else{          }
      },
      (error: any) => {
      }
    );

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


  imageObject: Array<object> =[{
    image: this.popupImages,
    thumbimage: this.popupImages
  }];

  showLightbox(index) {
    this.selectedImageIndex = index;
    this.showFlag = true;
}

closeEventHandler() {
    this.showFlag = false;
    this.currentIndex = -1;
}

}
