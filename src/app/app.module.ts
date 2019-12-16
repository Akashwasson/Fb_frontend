import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ChatbarComponent } from './components/chatbar/chatbar.component';
import { PostsComponent } from './components/posts/posts.component';
import { ProfilebarComponent } from './components/profilebar/profilebar.component';
import { NavComponent } from './components/nav/nav.component';
import { InfoComponent } from './components/info/info.component';
import { PhotosComponent } from './components/photos/photos.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { FindfriendsComponent } from './components/findfriends/findfriends.component';
import { FriendslistComponent } from './components/friendslist/friendslist.component';
import { FriendrequestsComponent } from './components/friendrequests/friendrequests.component';
import {ChatService} from './services/chat.service';
import {DataService} from './services/data.service';
import {AuthService} from './services/auth.service';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { EditprofileComponent } from './components/editprofile/editprofile.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomepageComponent,
    ChatbarComponent,
    PostsComponent,
    ProfilebarComponent,
    NavComponent,
    InfoComponent,
    PhotosComponent,
    UserprofileComponent, 
    FindfriendsComponent, 
    FriendslistComponent,
    FriendrequestsComponent,
    SearchbarComponent,
    EditprofileComponent,
    ResetpasswordComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [ChatService,AuthService,DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
