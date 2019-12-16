import { Component, OnInit } from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {userdata} from '../../models/userdata';
import {DataService} from '../../services/data.service';
import {AuthService} from '../../services/auth.service';
import { Router } from  '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  username:string;
  profilepic:string;
  userdata:userdata[];
  email =localStorage.getItem('email');
  blength=null;

  constructor(private chatService: ChatService,
    private router: Router ,
    private authService: AuthService,
    private dataservice:DataService) { }

  ngOnInit() {
// getting logged user profilepic and username
  this.dataservice.getuserdata(this.email).subscribe(data => {
    this.userdata = data;
    let username = this.userdata.map(item => item.username).toString();
    let userid =this.userdata.map(item => item._id).toString();
    let name = username.split(" ")
    var profpic = this.userdata.map(item=> item.profilepic).pop();
    this.username = name[0];
      //getting all friend requests
      this.dataservice.getallfrndrequests(userid).subscribe(data=>{
        var status = data.map(item=> item.status)
        var doc = data.map(item=> item.requester)
        for(var i=0; i<doc.length;i++){
          if (status[i] == "Requested"){
            let arr=[];
            arr.push('1') ;
            this.blength=arr.length
          }
        }
        
      })
    if(profpic !=""){
      var pf=[]
    pf.push(profpic[0])
    this.profilepic = pf.map(item=>item.profilepic).toString();
    }
    else{
      this.profilepic =""
    }
  });

   //1. getting live friend request notification using sockets
   this.chatService.getrequests().subscribe(data=>{
    let arr=[]
    arr.push('1') 
    this.blength=arr.length
});

}

//user can go to its profile page
emailfun(){
  localStorage.setItem('friendemail',this.email);
  this.router.navigateByUrl('/userprofile')
  this.ngOnInit();
}

// for toggling navbar options
displayfunction(){
  let modal=document.getElementById('mynewModal');
  if(modal.style.display =="block"){
    modal.style.display = "none";
  }
  else{
    modal.style.display = "block";
  }
}

logout(){
  this.chatService.userdisconnected();
 this.authService.logout();
}

// search by username
searchfun(){
  let name=(document.getElementById("searchbar") as HTMLInputElement).value;
  localStorage.setItem("searchedname",name);
  this.router.navigateByUrl('/searchbar')
}

}