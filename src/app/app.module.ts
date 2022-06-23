import { NgModule, Injectable, NO_ERRORS_SCHEMA, Component  } from '@angular/core';
import { NgOtpInputModule } from  'ng-otp-input';
import { JwtHelperService, JWT_OPTIONS  } from '@auth0/angular-jwt';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GuestNewsComponent } from './components/guest-news/guest-news.component';
import { ToastrModule } from 'ngx-toastr';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';  
import {NgxSpinnerModule} from 'ngx-spinner';
import { RouterModule, Routes } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { GuestSingleNewsComponent } from './components/guest-single-news/guest-single-news.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { GuestCommunityComponent } from './components/guest-community/guest-community.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from './services/authentication.service';
import { PusherServiceProvider } from './services/pusher.service';
import { EbnewsComponent } from './components/ebnews/ebnews.component';
import { NewsdetailComponent } from './components/newsdetail/newsdetail.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NgxEmojiPickerModule  }  from  'ngx-emoji-picker';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { AddnewsComponent } from './components/addnews/addnews.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TimelineHeaderComponent } from './components/timeline-header/timeline-header.component';
import { TimelinePhotosComponent } from './components/timeline-photos/timeline-photos.component';
import { LightgalleryModule } from 'lightgallery/angular';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { TimelineVideosComponent } from './components/timeline-videos/timeline-videos.component';
import { TimelineFriendsComponent } from './components/timeline-friends/timeline-friends.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TimelineProfileComponent } from './components/timeline-profile/timeline-profile.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { ViewPostComponent } from './components/view-post/view-post.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { CommunityComponent } from './components/community/community.component';
import { CreateCommunityComponent } from './components/create-community/create-community.component';
import { CommunityDashboardComponent } from './components/community-dashboard/community-dashboard.component';
import { CommunityNavbarComponent } from './components/community-navbar/community-navbar.component';
import { CommunityAboutComponent } from './components/community-about/community-about.component';
import { ProfileSettingComponent } from './components/profile-setting/profile-setting.component';
import { CommunityMemberComponent } from './components/community-member/community-member.component';
import { CommunitySettingsComponent } from './components/community-settings/community-settings.component';
import { EditCommunityMemberComponent } from './components/edit-community-member/edit-community-member.component';
import { SuggestedUsersComponent } from './components/suggested-users/suggested-users.component';
import { TagInputModule } from 'ngx-chips';
import { CommunityViewNewuserComponent } from './components/community-view-newuser/community-view-newuser.component';
import { FriendsHeaderComponent } from './components/friends-header/friends-header.component';
import { FriendsTimelineComponent } from './components/friends-timeline/friends-timeline.component';
import { FriendsProfileDetailComponent } from './components/friends-profile-detail/friends-profile-detail.component';
import { FriendsFriendComponent } from './components/friends-friend/friends-friend.component';
import { FriendsPhotosComponent } from './components/friends-photos/friends-photos.component';
import { FriendsVideosComponent } from './components/friends-videos/friends-videos.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { AuthGuard } from './services/auth.guard';
import { JwtInterceptor } from './jwt.interceptor';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { OtpComponent } from './components/otp/otp.component';
import { LoginOtpComponent } from './components/login-otp/login-otp.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { RegisterComponent } from './components/register/register.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { DemographicsComponent } from './components/demographics/demographics.component';
import { Country, State, City }  from 'country-state-city';
import { SuggestedFriendsComponent } from './components/suggested-friends/suggested-friends.component';
import { SinglePostComponent } from './components/single-post/single-post.component';
import { ViewCommunitypostComponent } from './components/view-communitypost/view-communitypost.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    GuestNewsComponent,
    GuestSingleNewsComponent,
    MarketplaceComponent,
    GuestCommunityComponent,
    NavbarComponent,
    EbnewsComponent,
    NewsdetailComponent,
    AddnewsComponent,
    TimelineHeaderComponent,
    TimelinePhotosComponent,
    TimelineVideosComponent,
    TimelineFriendsComponent,
    TimelineProfileComponent,
    TimelineComponent,
    EditPostComponent,
    ViewPostComponent,
    EditProfileComponent,
    CommunityComponent,
    CreateCommunityComponent,
    CommunityDashboardComponent,
    CommunityNavbarComponent,
    CommunityAboutComponent,
    ProfileSettingComponent,
    CommunityMemberComponent,
    CommunitySettingsComponent,
    EditCommunityMemberComponent,
    SuggestedUsersComponent,
    CommunityViewNewuserComponent,
    FriendsHeaderComponent,
    FriendsTimelineComponent,
    FriendsProfileDetailComponent,
    FriendsFriendComponent,
    FriendsPhotosComponent,
    FriendsVideosComponent,
    NotificationsComponent,
    SearchResultsComponent,
    OtpComponent,
    LoginOtpComponent,
    ForgotpasswordComponent,
    RegisterComponent,
    DemographicsComponent,
    SuggestedFriendsComponent,
    ViewCommunitypostComponent,
    SinglePostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InfiniteScrollModule, 
    NgxSpinnerModule,
    RouterModule,
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    PickerModule,
    EmojiModule,
    NgxEmojiPickerModule.forRoot(),
    CarouselModule.forRoot(),
    CKEditorModule,
    ImageCropperModule,
    BsDatepickerModule.forRoot(),
    MatCardModule,
    DragDropModule,
    LightgalleryModule,
    NgImageFullscreenViewModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    ToastrModule.forRoot(),
    TagInputModule,
    NgxIntlTelInputModule,
    NgOtpInputModule 
  ],
  providers: [
    PusherServiceProvider,
    AuthenticationService,
    BsDatepickerConfig,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    {provide: String, useValue: "dummy"} ,
    [AuthGuard],
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  
  ],
   bootstrap: [AppComponent],
   schemas: [ 
    NO_ERRORS_SCHEMA ]
})
export class AppModule { }
