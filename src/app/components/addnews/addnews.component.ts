import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastService } from '../../services/toast.service';
import { ImageCroppedEvent , base64ToFile } from 'ngx-image-cropper';
import { CdkDragDrop, CdkDragEnter, CdkDragMove, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-addnews',
  templateUrl: './addnews.component.html',
  styleUrls: ['./addnews.component.css']
})

@Injectable({
    providedIn: 'root'
  })

export class AddnewsComponent implements OnInit {
  public Editor = ClassicEditor;
  name = 'Angular';
  demographics:any;
  categories:any;
  validateImage:string='null';
  image:any;
  VideoFile:any;
  videoCount:number=0;
  catVal:any;
  id: any;
  vdoURL:any;
  public videoPath;
  data:any;
  newsId:any;
  news: any;
  FormBuilder:any;
  isActive?: boolean;
  selectedDemo: string = '';
  isAddMode: boolean=false;
  isLoading:boolean=false;
  ImageFile:string = '';
  thumbnail: any;
  fileToUpload:string='';
  imageChangedEvent: any = '';
  croppedImage: any = '';
  public imagePath;
  Name:any;
  userData:any;
  UserRole:any;
  isUpdate:boolean = false;
  maxDate = new Date();
  minDate = new Date();
  bsInlineValue = new Date();
    bsValue = new Date();
    currentData: Date;
    country:any;
    state:any;
    city:any;
    validate:string='null';
    then:any;
  selectedItemsRegion:any=[];
  postData:any=[];
  ImageFiles1: File[] = [];
  ImageFiles: any;
  imageCount:number=0;
  emailError:string='null';
  mobileError:string='null';
  
  
  selectChangeHandler (event: any) {
    this.selectedDemo = event.target.value;
    console.warn(this.selectedDemo);
  }
  
  storage = window.localStorage;
  newsform: FormGroup = new FormGroup({});  
  catform: FormGroup = new FormGroup({});
  sortform: FormGroup = new FormGroup({});
  NewsAuthorform: FormGroup = new FormGroup({});
  
  constructor( private fb: FormBuilder,public http: ApiService,
  public router: Router, private _route:ActivatedRoute,
     public toast:ToastService) {
      this._route.queryParams.subscribe(params => {
        if (params) {
          this.newsId = params['newsId'];             }
         });

         this.minDate.setDate(this.minDate.getDate() - 100*365);
         this.maxDate.setDate(this.maxDate.getDate());
         this.currentData = new Date();
        this.currentData.setFullYear(this.minDate.getFullYear() +78);

    this.newsform = this.fb.group({
      NewsHeadline: ['', [Validators.required,Validators.maxLength(100) ]],
      DemographicId: ['', Validators.required ],
      ImageFile: ['',Validators.required],
      IsPublic: ['', Validators.required],
      IsTrending: ['', Validators.required],
      NewsCategory: ['', Validators.required],
      LoginId: ['', Validators.required],
      NewsBody: ['', Validators.required],
      fileToUpload: [''],
      NewsImageLinks:[''],
      NewsVideoLinks:[''],
      VideoFiles:[],
      ImageFiles:[]
      });

      this.catform = this.fb.group({
        Name: ['', Validators.required ]
        });

        this.sortform = this.fb.group({
          SourceCategoryId: ['', Validators.required ],
          DestinationCategoryId: ['', Validators.required],
          LoginId: ['', Validators.required]
        });

      this.NewsAuthorform = this.fb.group({
          Name: ['', Validators.required ],
          Email: ['', Validators.required],
          Mobile: ['', Validators.required],
          DateOfBirth: ['', Validators.required],
          Gender:['', Validators.required],
          CountryCode: ['', Validators.required],
          CountryId: ['', Validators.required],
          StateId: ['', Validators.required],
          CityId: ['', Validators.required],
          Demographics: ['', Validators.required]
          });

          this.adminNews();
      }

  ngOnInit(): void {
    this.id = this._route.snapshot.params['id'];
    this.isAddMode = this.id; 

      this._route.paramMap.subscribe(parameterMap => {
        var id = parameterMap.get('id');
        this.getNews(id);
      });

  		 this.http.get('/AllDemographic').subscribe(
        (res: any) => {
          if(res.status==true) {
          	this.demographics = res.data;
          }else{          }
        },
        (error: any) => {
        }
      );

      this.http.get('/Categories').subscribe(
        (res:any)=>{
          if(res.status==true){
            this.categories= res.data;
          }else{

          }
        },
        (error: any)=>{

        }
      );

      var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.UserRole = userData.UserRole;
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
  
  processImage(file){
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
  

  private getNews(id){
    this.http.get('/NewsDetail/'+id).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.data = res.data;
          let objectURL = res.data.Detail.ImageName;
          this.thumbnail = objectURL;
          console.log(this.thumbnail);
          this.newsform.controls['NewsHeadline'].setValue(res.data.Detail.NewsHeadline);
          this.newsform.controls['NewsBody'].setValue(res.data.Detail.NewsBody);
          this.newsform.controls['DemographicId'].setValue(res.data.Detail.CategoryId);
          this.newsform.controls['IsPublic'].setValue(res.data.Detail.IsPublic);
          this.newsform.controls['IsTrending'].setValue(res.data.Detail.IsTrending);
          // this.newsform.controls['ImageFile'].setValue(res.data.ImageName);
          this.newsform.controls['NewsCategory'].setValue(res.data.Detail.CategoryId);
          this.newsform.controls['NewsImageLinks'].setValue((res.data.NewsImageLinks[0].DataText == "null")? "":res.data.NewsImageLinks[0].DataText);
          this.newsform.controls['NewsVideoLinks'].setValue((res.data.NewsVideoLinks[0].DataText == "null")? "":res.data.NewsVideoLinks[0].DataText);
          
        }else{          }
      },
      (error: any) => {
      }
    );
  }

   
   
  submit(){
    this.isLoading= true;
    const fileToUpload: File = new File([this.dataURItoBlob(this.thumbnail)], 'filename.png');
    console.log(fileToUpload);
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    let model: FormData = new FormData();
    
    model.append('ImageFile',fileToUpload);
    model.append('DemographicId',this.newsform.value.DemographicId);
    model.append('NewsHeadline',this.newsform.value.NewsHeadline);
    model.append('NewsBody',this.newsform.value.NewsBody);
    model.append('LoginId',userData.Email);// login id should pick from local storage
    model.append('IsPublic',(this.newsform.value.IsPublic==undefined||this.newsform.value.IsPublic==''||this.newsform.value.IsPublic==null)?false:this.newsform.value.IsPublic);
    model.append('IsTrending',(this.newsform.value.IsTrending==undefined||this.newsform.value.IsTrending==''||this.newsform.value.IsTrending==null)?false:this.newsform.value.IsTrending);
    model.append('NewsCategory',this.newsform.value.NewsCategory);
    model.append('SubCategoryId','00000000-0000-0000-0000-000000000000');

    
      model.append('VideoFiles', (this.VideoFile)? this.VideoFile: null);
      model.append('NewsImageLinks', (this.newsform.value.NewsImageLinks)? this.newsform.value.NewsImageLinks: null);
      model.append('NewsVideoLinks',(this.newsform.value.NewsVideoLinks)? this.newsform.value.NewsVideoLinks: null);
      

      for (let i = 0; i < this.ImageFiles1.length; i++) {
        model.append('ImageFiles',this.ImageFiles1[i], this.ImageFiles1[i].name);
      }
  
    
    this.http.postMultipart('/SaveNews',model)
        .subscribe((res) => {
          console.log(res);
         if(res!==null && res !==undefined){
           if(res.status){
            this.toast.success('News Added Successfully','Great !!');
            this.router.navigate(['/ebnews']);
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

  update(){
    this.isLoading= true;
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    let model: FormData = new FormData();
    model.append('ImageFile',this.image);
    model.append('DemographicId',this.newsform.value.DemographicId);
    model.append('NewsHeadline',this.newsform.value.NewsHeadline);
    model.append('NewsBody',this.newsform.value.NewsBody);
    model.append('LoginId',userData.Email);// login id should pick from local storage
    model.append('IsPublic',(this.newsform.value.IsPublic==undefined||this.newsform.value.IsPublic==''||this.newsform.value.IsPublic==null)?false:this.newsform.value.IsPublic);
    model.append('IsTrending',(this.newsform.value.IsTrending==undefined||this.newsform.value.IsTrending==''||this.newsform.value.IsTrending==null)?false:this.newsform.value.IsTrending);
    model.append('SubCategoryId','00000000-0000-0000-0000-000000000000');
    model.append('Id',this.id);
    model.append('VideoFiles', (this.VideoFile)? this.VideoFile: null);
    model.append('NewsImageLinks', (this.newsform.value.NewsImageLinks)? this.newsform.value.NewsImageLinks: null);
    model.append('NewsVideoLinks',(this.newsform.value.NewsVideoLinks)? this.newsform.value.NewsVideoLinks: null);
    

    for (let i = 0; i < this.ImageFiles1.length; i++) {
      model.append('ImageFiles',this.ImageFiles1[i], this.ImageFiles1[i].name);
    }
    
    this.http.put('/ModifyNews',model)
        .subscribe((res) => {
          console.log(res);
         if(res!==null && res !==undefined){
           if(res.status){
            this.toast.success('News Updated Successfully','Great !!');
            this.router.navigate(['/ebnews']);
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

  submitCat(){
    
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.catform.value.LoggedInUser= userData.Email;
    if(!this.isUpdate){
    this.catform.value.Mode= "1";
    }else{
      this.catform.value.Mode = "2";
    }
    
    this.http.post('/SaveCategory',this.catform.value).subscribe(
      (res: any) => {
        if (res.status==true) {
          this.catform.reset();
        } else {
         
        }
      },
      (error: any) => {
      }
    );
  }

  updateCat(catName){
    this.isUpdate = true;
    this.catform.controls['Name'].setValue(catName);
  }

  deleteCat(catId,catName){
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.catform.value.LoggedInUser= userData.Email;
    this.catform.value.Mode= "3";
    this.catform.value.Id= catId;
    this.catform.value.Name= catName;
    this.http.post('/SaveCategory',this.catform.value).subscribe(
      (res: any) => {
        if (res.status==true) {
          this.data = res.data;
          this.router.navigate(['/addnews'])
            .then(() => {
              window.location.reload();
            });
        } else {
         
        }
      },
      (error: any) => {
      }
    );

  }

  

  drop(event: CdkDragDrop<any>){

    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
    let currentData = event.currentIndex;
    let previousData = event.previousIndex;

    var userData = JSON.parse(this.storage.getItem('userData') || '{}');

    this.sortform.value.LoginId= userData.Email;
    this.sortform.value.SourceCategoryId= event.container.data[currentData].DataValue;
    this.sortform.value.DestinationCategoryId= event.container.data[previousData].DataValue;


    this.http.post('/CategoryOrderChange',this.sortform.value).subscribe(
      (res: any) => {
        if (res.status==true) {
          this.catform.reset();
        } else {
         
        }
      },
      (error: any) => {
      }
    );
    console.log(event);
    console.log(event.container.data[currentData].DataValue);
    console.log(event.container.data[previousData].DataValue);
    console.log(event.previousIndex);
    console.log(event.currentIndex);

  }

  AddAuthor(){
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.NewsAuthorform.value.LoginId= userData.Email;
    this.NewsAuthorform.value.Mobile = this.postData.Mobile;
  		 this.NewsAuthorform.value.CountryId = this.postData.CountryId;
  		 this.NewsAuthorform.value.StateId = this.postData.StateId;
  		 this.NewsAuthorform.value.CityId = this.postData.CityId;
       this.NewsAuthorform.value.CountryCode = '91';
  		 this.NewsAuthorform.value.Demographics = this.selectedItemsRegion;
       console.log(this.NewsAuthorform.value);
       console.log(this.postData.CountryId);

    this.http.post('/NewsAuthorInsert',this.NewsAuthorform.value).subscribe(
      (res: any) => {
        if (res.status==true) {
          this.toast.success('Author Added Successfully','Great !!');
        } else {
         
        }
      },
      (error: any) => {
      }
    );
  }

  ProcessVideo(e){
    let extensionAllowed = { "mp4": true, "webm": true, "mkv": true };
 
  for (let file of e.target.files) {
    if (file.size / 1024 / 1024 > 20) {
      alert("File size should be less than 20MB")
      return;
    }
    if (extensionAllowed) {
      var nam = file.name.split('.').pop();
      if (!extensionAllowed[nam]) {
        alert("Please upload " + Object.keys(extensionAllowed) + " file.")
        return;
      }
    }
    this.VideoFile = file;
  }
  console.log(this.VideoFile.size);
  
  this.videoCount = (+[Object.keys(this.VideoFile).length] + 1);
}

previewvideo(files) {
  if (files.length === 0)
    return;

  var mimeType = files[0].type;
  if (mimeType.match(/video\/*/) == null) {
    return;
  }

  var reader = new FileReader();
  this.videoPath = files;
  reader.readAsDataURL(files[0]); 
  reader.onload = () => { 
    this.vdoURL = reader.result; 
  }
}

urls=[];
postImage(event){
  console.log(event);
  if(event.target.files){
    for(let i=0; i<=File.length+15; i++){
      var reader= new FileReader();
      reader.readAsDataURL(event.target.files[i]);
      reader.onload=(events:any)=>{
        this.urls.push(events.target.result as never);
        
      }
     this.ImageFiles= this.ImageFiles1.push(event.target.files[i]); 
     this.imageCount= this.ImageFiles;
     console.log(this.ImageFiles);
     
    }
  }
  console.log(event);
}

totalNewsCount: number = 0;
page: number =1;
adminNews(){
  let action_url = '/AdminNewsList/00000000-0000-0000-0000-000000000000/1000/0/';

  this.http.get(action_url).subscribe(
    (res:any)=>{
      if(res.status==true){
        this.news = res.data;
        var totalNewsCount = this.news.TotalCount;
      }else{

      }
    },
    (error: any)=>{

    }
  );

}


deactivateNews(id){
  
  var userData = JSON.parse(this.storage.getItem('userData') || '{}');
  let action_url = '/DectivateNews/'+id+'/'+userData.Email;

  this.http.get(action_url).subscribe(
    (res:any)=>{
      if(res.status==true){
        this.toast.success('News Deactivate Successfully','Great !!');
      }else{

      }
    },
    (error: any)=>{

    }
  );

}

activateNews(id){

  var userData = JSON.parse(this.storage.getItem('userData') || '{}');
  let action_url = '/ActivateNews/'+id+'/'+userData.Email;

  this.http.get(action_url).subscribe(
    (res:any)=>{
      if(res.status==true){
        this.toast.success('News Activated Successfully','Great !!');
      }else{

      }
    },
    (error: any)=>{

    }
  );

}

emailVerify(){
  this.http.get('/CheckEmailExists/'+this.NewsAuthorform.value.Email).subscribe(
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
  console.log(this.NewsAuthorform.value.Mobile);
  this.http.get('/CheckMobileExists/'+this.NewsAuthorform.value.Mobile+'/91').subscribe(
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
     newsId:id
   }
 };
 this.router.navigate(['/newsdetail'], navigationExtras);
 
}

}
