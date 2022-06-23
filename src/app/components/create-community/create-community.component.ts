import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-create-community',
  templateUrl: './create-community.component.html',
  styleUrls: ['./create-community.component.css']
})
export class CreateCommunityComponent implements OnInit {

  public Editor = ClassicEditor;
  public name:string="";
  FormBuilder:any;
  communityform: FormGroup = new FormGroup({});
  storage = window.localStorage;
  ImageFiles: any;
  thumbnail: any;
  communityId: any;
  public imagePath;
  public IsPublic="";
  isAddMode: boolean=false;
  id: any;
  communityData: any;
  demographics:any;
  selectedDemo: any;

  selectChangeHandler (event: any) {
    this.selectedDemo = event.target.value;
    console.warn(this.selectedDemo);
  }
 

  constructor(public forms:FormsModule,
    private http: ApiService,
    private fb: FormBuilder,
    public router: Router, private _route:ActivatedRoute,
    public toast:ToastService,) {


      this.communityform = this.fb.group({
        GroupName: ['', Validators.required],
        GroupDescription: ['', Validators.required],
        GroupImage: [''],
        LoginId: ['', Validators.required],
        IsPublic: [''],
        GuideLines: [''],
        CategoryId: ['']
      })

     }

  ngOnInit(): void {

    this.id = this._route.snapshot.params['id'];
    this.isAddMode = this.id; 

      this._route.paramMap.subscribe(parameterMap => {
        var id = parameterMap.get('id');
        if (id != null) {
          
          this.getCommunityId(id);

        }
        
      });

      this.CommunityType();

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

  uploadFile(event) {
    var files = event.target.files;
  this.ImageFiles = files.item(0);
      // this.validateImage = 'null';

      var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.thumbnail = reader.result; 
    }
    }
  

  submit(){
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    const fileToUpload: File = new File([this.dataURItoBlob(this.thumbnail)], 'filename.png');
    let model: FormData = new FormData();

    model.append('GroupName', this.communityform.value.GroupName);
    model.append('GroupDescription', this.communityform.value.GroupDescription);
    model.append('GroupImage', fileToUpload);
    model.append('LoginId', userData.Email);
    model.append('IsPublic', this.IsPublic);
    model.append('GuideLines', this.communityform.value.GuideLines);
    model.append('CategoryId', this.communityform.value.CategoryId);

    this.http.postMultipart('/AddCommunity',model)
        .subscribe((res) => {
          console.log(res);
          console.warn(this.communityform.value);
         if(res!==null && res !==undefined){
           if(res.status){
            this.toast.success('Your Community created Successfully','Great !!');
          this.router.navigate(['/community']);
            
           }
           else{
           }
         }
         else{
         }
        }),(error) => {
        console.log(error);
        }
  }


  getCommunityId(id){
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.http.get('/GetCommunityById/'+id+'/'+userData.Email).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.communityData = res.data;
          let groupImg = res.data.GroupImageName;
          this.thumbnail = groupImg;
          console.log(this.thumbnail);
          this.communityform.controls['GroupName'].setValue(res.data.GroupName);
          this.communityform.controls['GroupDescription'].setValue(res.data.GroupDescription);
          // this.communityform.controls['GroupImage'].setValue(res.data.Detail.CategoryId);
          this.communityform.controls['LoginId'].setValue(userData.Email);
          this.communityform.controls['GuideLines'].setValue(res.data.GuideLines);
          this.communityform.controls['CategoryId'].setValue(res.data.CategoryId);
          this.communityform.controls['GroupImage'].setValue(res.data.GroupImageName);
          // this.communityform.controls['IsPublic'].setValue(this.IsPublic);
          
        }else{          }
      },
      (error: any) => {
      }
    );
  }


  update(){

    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    const fileToUpload: File = new File([this.dataURItoBlob(this.thumbnail)], 'filename.png');

    let model: FormData = new FormData();

    model.append('GroupName', this.communityform.value.GroupName);
    model.append('GroupDescription', this.communityform.value.GroupDescription);
    model.append('GroupImage', fileToUpload);
    model.append('LoginId', userData.Email);
    model.append('GroupId', this.id);
    model.append('IsPublic', this.IsPublic);
    model.append('GuideLines', this.communityform.value.GuideLines);
    model.append('CategoryId', this.communityform.value.CategoryId);

    this.http.put('/UpdateCommunity',model)
        .subscribe((res) => {
          console.log(res);
         if(res!==null && res !==undefined){
           if(res.status){
            this.toast.success('Community Updated Successfully','Great !!');
            this.router.navigate(['/community']);
           }
           else{
           }
         }
         else{
         }
        }),(error) => {
        console.log(error);
        }

  }


  selectPrivacy(event){

    this.IsPublic = event.target.value;

  }

  cancel(){

    this.router.navigate(['/community']);

  }

  CommunityType(){
    
    this.http.get('/AllDemographic').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.demographics = res.data;
        }else{          }
      },
      (error: any) => {
      }
    );
  }

}
