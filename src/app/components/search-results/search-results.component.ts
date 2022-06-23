import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  item = [];
  show:any;
  search:any;
  searchResults:any;
  newsFilter :any;
  profileFilter :any;
  communityFilter :any;
  newsCount: number = 0;
  profileCount: number = 0;
  communityCount: number = 0;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private http: ApiService
  ) {

    this.route.queryParams.subscribe(params => {
      if (params) {
        this.search = params['search'];             }
       });

   }

  ngOnInit(): void {

    this.searchResult();

  }

  handleResults($event) {
   let searchObj= $event;
    console.log(searchObj);
  }

  searchResult(){

    let action_url = '/SearchEoovbook/'+this.search+'/100/0';
  
    console.log(action_url);
    
    this.http.get(action_url).subscribe(
      (res:any)=>{
        if(res.status==true){
          this.searchResults = res.data;
          let searchObj = this.searchResults;
          // this.found.emit(searchObj);
          var newsjsons = new Array();

          var profilejsons = new Array();

          var communityjsons = new Array();

          for (let i = 0; i < Object.keys(searchObj).length; i++) {

            
            
            if (searchObj[i].SearchType == 'News') {

              // this.newsFilter = searchObj[i];

              
                newsjsons.push(searchObj[i]);
                // jsons.push(second_json);

             
              
            }else if (searchObj[i].SearchType == 'Profile') {

              // this.profileFilter = searchObj[i];

              profilejsons.push(searchObj[i]);

              // console.log(this.profileFilter);

            }else if (searchObj[i].SearchType == 'Community') {

              // this.communityFilter = searchObj[i];

              communityjsons.push(searchObj[i]);

              // console.log(this.communityFilter);
              
            }
            
          }

          this.newsFilter = newsjsons;

          this.profileFilter = profilejsons;

          this.communityFilter = communityjsons;

          this.newsCount = Object.keys(this.newsFilter).length;

          this.profileCount = Object.keys(this.profileFilter).length;

          this.communityCount = Object.keys(this.communityFilter).length;

          
        }else{

        }
      },
      (error: any)=>{

      }
    );
  }

  getCommunity(id){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        groupId:id
      }
    };
    this.router.navigate(['/aboutcommunity'], navigationExtras);
  }

}
