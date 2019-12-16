import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {HomepageComponent} from './components/homepage/homepage.component';
import {ProfilebarComponent} from './components/profilebar/profilebar.component';
import {NavComponent} from './components/nav/nav.component';
import {InfoComponent} from './components/info/info.component';
import {ChatbarComponent} from './components/chatbar/chatbar.component';
import {PostsComponent} from './components/posts/posts.component';
import {UserprofileComponent} from './components/userprofile/userprofile.component'; 
import {PhotosComponent} from './components/photos/photos.component';
import {FindfriendsComponent} from './components/findfriends/findfriends.component';
import {FriendslistComponent} from './components/friendslist/friendslist.component';
import {FriendrequestsComponent} from './components/friendrequests/friendrequests.component';
import {SearchbarComponent} from './components/searchbar/searchbar.component';
import {EditprofileComponent} from './components/editprofile/editprofile.component';
import {ResetpasswordComponent} from './components/resetpassword/resetpassword.component';
import { AuthGuardService  } from './guards/auth-guard.service';
const routes: Routes = [
  {
    path: '', component:LoginComponent
  },
  {
    path: 'resetpassword', component:ResetpasswordComponent
  },
  {
    path: 'homepage', component:HomepageComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'profilebar', component:ProfilebarComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'chatbar', component:ChatbarComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'posts', component:PostsComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'nav', component:NavComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'info', component:InfoComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'photos', component:PhotosComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'userprofile', component:UserprofileComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'findfriends', component:FindfriendsComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'friendslist', component:FriendslistComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'friendrequests', component:FriendrequestsComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'searchbar', component:SearchbarComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'editprofile', component:EditprofileComponent, canActivate: [AuthGuardService]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
