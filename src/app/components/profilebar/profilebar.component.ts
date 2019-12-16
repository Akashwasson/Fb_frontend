import { Component, OnInit } from '@angular/core';
import { Router } from  '@angular/router';
import {userdata} from '../../models/userdata';
import {DataService} from '../../services/data.service';
import {ChatService} from '../../services/chat.service';


@Component({
  selector: 'app-profilebar',
  templateUrl: './profilebar.component.html',
  styleUrls: ['./profilebar.component.css']
})
export class ProfilebarComponent implements OnInit {
  username:string;
  profilepic:string;
  userdata:userdata[];
  userid="";
  email =localStorage.getItem('email');
  blength=null;

  constructor(private dataservice:DataService,private chatService: ChatService) { }

  ngOnInit() {
      //1. getting live friend request using sockets
      this.chatService.getrequests().subscribe(data=>{
          let arr=[]
          arr.push('1') 
          this.blength=arr.length
    });

    this.dataservice.getuserdata(this.email).subscribe(data => {
      this.userdata = data;
      const username = this.userdata.map(item => item.username).toString();
      this.userid =this.userdata.map(item => item._id).toString();
      const profpic = this.userdata.map(item=> item.profilepic).pop()
      this.username = username;
        var pf=[]
        pf.push(profpic[0])
      this.profilepic = pf.map(item=>item.profilepic).toString();
      
     //getting all friend requests
     this.dataservice.getallfrndrequests(this.userid).subscribe(data=>{
      var status = data.map(item=> item.status)
      var doc = data.map(item=> item.requester)
      for(var i=0; i<doc.length;i++){
        if (status[i] == "Requested"){
          let arr=[]
          arr.push('1') ;
          this.blength=arr.length;
        }
      }
      
    })
       
    });
  }

  emailfun(){
    localStorage.setItem('friendemail',this.email);
  }

}
