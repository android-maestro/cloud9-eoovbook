import { Component, OnInit,TemplateRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastService } from '../../services/toast.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-guest-news',
  templateUrl: './guest-news.component.html',
  styleUrls: ['./guest-news.component.css']
})
export class GuestNewsComponent implements OnInit {
data:any;
demographic:any;
categoryId:string='null';
selectedOption: string='Sort by';
modalRef?: BsModalRef;
message?: string;
categories:any;
storage = window.localStorage;
filteredItem:any=[];
baseUrl: string;
notEmptyPost = true;
notscrolly = true;


  constructor(private http: ApiService,
    public router: Router,
   private route: ActivatedRoute,
   public toast:ToastService,
   private spinner: NgxSpinnerService,
   private modalService: BsModalService) { 
        this.baseUrl = window.location.origin;
   }

  ngOnInit(): void {

    this.loadInitNews();

    this.http.get('/AllDemographic').subscribe(
    (res: any) => {
      if(res.status==true) {
        this.demographic = res.data;
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
  }

  registereModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef?.hide();
  }
 
  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }

  singleNews(id){
  	 let navigationExtras: NavigationExtras = {
      queryParams: {
        newsId:id,
      }
    };
    this.router.navigate(['/SingleNews'], navigationExtras);
  }

  sorting(){
    if(this.selectedOption=='order'){
        var sort = this.data.sort(function(a, b) {
            return a.NewsHeadline.localeCompare(b.NewsHeadline);
        });
      }else if(this.selectedOption=='old'){
        var sort = this.data.sort(function(a, b) {
            return a.PublishedOn.localeCompare(b.PublishedOn);
        });
      }else if(this.selectedOption=='new'){
        var sort = this.data.sort(function(a, b) {
            return b.PublishedOn.localeCompare(a.PublishedOn);
        });
      }else{
        this.ngOnInit();
      }
  }

  search(value){
       this.filteredItem = this.data.filter(function(element) {
    return element.NewsHeadline.toLowerCase().includes(value.toLowerCase());
  });

  }

  newsByCat(item: any){
    let sby = 'new';
    if(this.selectedOption=='old'){
      sby = 'old';
    }

    let action_url = '/NewsByCategory/'+item.DataValue+'/1000/0/'+sby+'/';
    var cat = this.categoryId;
    
    console.log(item);
   
      // NewsByCategory/{CategoryId}/{PageSize}/{RowsOffset}/{SortBy}/{FilterBy}")]

      this.http.get(action_url).subscribe(
        (res:any)=>{
          if(res.status==true){
            this.data= res.data;
            this.data.length = res.data;
            this.page = res.data.TotalCount;
            this.spinner.hide();
            this.notscrolly = false;
          }else{

          }
        },
        (error: any)=>{

        }
      );
      console.log(this.filteredItem.length);
    
   
    this.filteredItem = this.data.filter(function(element) {
    return element.NewsCategory.toLowerCase() == cat.toLowerCase();
  });

    console.log(this.filteredItem.length);
  }

  copyMessage(id){
    this.toast.success(this.message,'Link Copied !!');
    let navigationExtras: NavigationExtras = {
      queryParams: {
        newsId:id,
      }
    };
    // this.router.navigate(['/newsdetail'], navigationExtras);
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.baseUrl+'/newsdetail?newsId='+ id;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  
  openFacebook(id){
    console.log(id);
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.baseUrl+'/newsdetail?newsId='+ id;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('paste');
    document.body.removeChild(selBox)
    window.open('https://www.facebook.com/sharer/sharer.php?u='+selBox.value); 
  }

  loadInitNews(){

    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
  
    this.http.get('/NewsByCategory/00000000-0000-0000-0000-000000000000/12/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.data = res.data;
        }else{          }
      },
      (error: any) => {
      }
    );
  }
  
  page = 12;

  onScroll(){

    if (this.notscrolly && this.notEmptyPost) {
    console.log("OnScroll is runing");
  
    this.spinner.show(undefined,
      {
        type: 'ball-pulse-sync',
        size: 'medium',
        bdColor: 'rgba(237,242,246, 1)',
        color: '#685a9d',
        fullScreen: false
      }
    );
    this.notscrolly = false;
    
      this.loadNextNews(this.page);
     
    this.page += 12;
  
    }
    
  }
  

  loadNextNews(page: number){
  
    this.http.get(`/NewsByCategory/00000000-0000-0000-0000-000000000000/12/${page}`).subscribe(
      (res: any) => {
        if(res.status==true) {
          const newdata = res.data;
          this.spinner.hide();
          if (newdata.length === 0 ) {
            this.notEmptyPost =  false;
          }
          this.data = this.data.concat(newdata);
          this.notscrolly = true;
        }else{          }
      },
      (error: any) => {
      }
    );
  
  }

}
