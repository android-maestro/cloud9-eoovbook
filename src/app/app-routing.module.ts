import { NgModule } from '@angular/core';
import { AuthGuard } from './services/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { GuestNewsComponent } from './components/guest-news/guest-news.component';
import { GuestSingleNewsComponent } from './components/guest-single-news/guest-single-news.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { GuestCommunityComponent } from './components/guest-community/guest-community.component';
import { EbnewsComponent } from './components/ebnews/ebnews.component';
import { NewsdetailComponent } from './components/newsdetail/newsdetail.component';
import { AddnewsComponent } from './components/addnews/addnews.component';
import { TimelinePhotosComponent } from './components/timeline-photos/timeline-photos.component';
import { TimelineVideosComponent } from './components/timeline-videos/timeline-videos.component';
import { TimelineFriendsComponent } from './components/timeline-friends/timeline-friends.component';
import { TimelineProfileComponent } from './components/timeline-profile/timeline-profile.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';

import { CommunityComponent } from './components/community/community.component';
import { CreateCommunityComponent } from './components/create-community/create-community.component';
import { CommunityDashboardComponent } from './components/community-dashboard/community-dashboard.component';
import { CommunityAboutComponent } from './components/community-about/community-about.component';
import { ProfileSettingComponent } from './components/profile-setting/profile-setting.component';
import { CommunityMemberComponent } from './components/community-member/community-member.component';
import { CommunitySettingsComponent } from './components/community-settings/community-settings.component';
import { EditCommunityMemberComponent } from './components/edit-community-member/edit-community-member.component';
import { SuggestedUsersComponent } from './components/suggested-users/suggested-users.component';
import { CommunityViewNewuserComponent } from './components/community-view-newuser/community-view-newuser.component';
import { FriendsTimelineComponent } from './components/friends-timeline/friends-timeline.component';
import { FriendsProfileDetailComponent } from './components/friends-profile-detail/friends-profile-detail.component';
import { FriendsFriendComponent } from './components/friends-friend/friends-friend.component';
import { FriendsPhotosComponent } from './components/friends-photos/friends-photos.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { OtpComponent } from './components/otp/otp.component';
import { LoginOtpComponent } from './components/login-otp/login-otp.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { DemographicsComponent } from './components/demographics/demographics.component';
import { SuggestedFriendsComponent } from './components/suggested-friends/suggested-friends.component';
import { SinglePostComponent } from './components/single-post/single-post.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/register',
    pathMatch: 'full'
  },
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent,  canActivate: [AuthGuard]},
  {path: 'news', component: GuestNewsComponent},
  { path: 'SingleNews', component: GuestSingleNewsComponent},
  { path: 'marketplace', component:  MarketplaceComponent },
  { path: 'guest-community', component:  GuestCommunityComponent },
  { path: 'ebnews', component: EbnewsComponent,  canActivate: [AuthGuard]},
  { path: 'newsdetail', component: NewsdetailComponent,  canActivate: [AuthGuard] },
  { path: 'addnews', component: AddnewsComponent,  canActivate: [AuthGuard] },
  { path: 'photos', component:  TimelinePhotosComponent,  canActivate: [AuthGuard] },
  { path: 'videos', component:  TimelineVideosComponent ,  canActivate: [AuthGuard]},
  { path: 'friends', component:  TimelineFriendsComponent,  canActivate: [AuthGuard] },
  { path: 'profile/:Email', component: TimelineProfileComponent,  canActivate: [AuthGuard] },
  { path: 'timeline', component: TimelineComponent,  canActivate: [AuthGuard] },
  { path: 'edit-post', component:  EditPostComponent,  canActivate: [AuthGuard] },
  { path: 'edit-profile/:Email', component:  EditProfileComponent,  canActivate: [AuthGuard] },
  { path: 'community', component: CommunityComponent,  canActivate: [AuthGuard] },
  { path: 'editcommunity/:id', component: CreateCommunityComponent,  canActivate: [AuthGuard] },
  { path: 'create-community', component: CreateCommunityComponent,  canActivate: [AuthGuard] },
  { path: 'community-dashboard', component: CommunityDashboardComponent,  canActivate: [AuthGuard] },
  { path: 'community-about', component: CommunityAboutComponent,  canActivate: [AuthGuard] },
  { path: 'profile-setting', component: ProfileSettingComponent,  canActivate: [AuthGuard] },
  
  { path: 'community-member', component: CommunityMemberComponent,  canActivate: [AuthGuard] },
  { path: 'community-settings', component:  CommunitySettingsComponent,  canActivate: [AuthGuard] },
  { path: 'edit-community-member', component:  EditCommunityMemberComponent,  canActivate: [AuthGuard] },
  { path: 'suggested-user', component:  SuggestedUsersComponent,  canActivate: [AuthGuard] },
  { path: 'community-view-newuser', component:  CommunityViewNewuserComponent },
  // {path: '**', component: LoginComponent},
  { path: 'UserTimeline/:Email/:id', component:  FriendsTimelineComponent,  canActivate: [AuthGuard] },
  { path: 'profileDetail/:Email/:id', component:  FriendsProfileDetailComponent,  canActivate: [AuthGuard] },
  { path: 'UserFriends/:Email/:id', component:  FriendsFriendComponent,  canActivate: [AuthGuard] },
  { path: 'UserPhotos/:Email/:id', component:  FriendsPhotosComponent,  canActivate: [AuthGuard] },
  { path: 'notifications', component:  NotificationsComponent,  canActivate: [AuthGuard] },
  { path: 'search-results', component:  SearchResultsComponent, canActivate: [AuthGuard] },
  { path: 'otp', component: OtpComponent },
  { path: 'loginOtp', component: LoginOtpComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: 'singlepost/:id', component:  SinglePostComponent },
  { path: 'demographics', component: DemographicsComponent },
  { path: 'suggested-friends', component:  SuggestedFriendsComponent },
  { path: 'editnews/:id', component: AddnewsComponent },
];

@NgModule({
 imports: [RouterModule.forRoot(routes,{
    anchorScrolling:'enabled',
    scrollPositionRestoration: 'enabled',
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
