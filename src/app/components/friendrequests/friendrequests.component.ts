import { Component, OnInit } from '@angular/core';
import {userdata} from '../../models/userdata';
import {ChatService} from '../../services/chat.service';
import {DataService} from '../../services/data.service';
import { Router } from  '@angular/router';

@Component({
  selector: 'app-friendrequests',
  templateUrl: './friendrequests.component.html',
  styleUrls: ['./friendrequests.component.css']
})
export class FriendrequestsComponent implements OnInit {
  userdata:Array<any>=[];
  requests:Array<any>=[];
  userid="";
  usermail =localStorage.getItem('email');
  constructor(private router: Router,private chatService: ChatService,private dataservice:DataService) { }

  ngOnInit() {
      //getting logged in user data
    this.dataservice.getuserdata(this.usermail).subscribe(data => {
      this.userid =data.map(item => item._id).toString();
      //getting all friend requests
      this.dataservice.getallfrndrequests(this.userid).subscribe(data=>{
        var status = data.map(item=> item.status)
        var doc = data.map(item=> item.requester)
        for(var i=0; i<doc.length;i++){
          if (status[i] == "Requested"){
           this.requests.unshift(doc[i].pop())
          }
        }
        
      })

    });

     //1. getting live friend request using sockets
     this.chatService.getrequests().subscribe(data=>{
        // getting userdata
        this.dataservice.getuserdata(data.email).subscribe(data => {
          this.requests.unshift(data.pop());
        });
    });

  }

 confirmrqst(id,email){
   var obj={
    email: this.usermail,
    id:id,
  }

  var obj1={
    email: email,
    id:this.userid,
  } 
  this.dataservice.acceptfrndrqst(obj1).subscribe();
  this.dataservice.acceptfrndrqst(obj).subscribe(doc=>{this.router.navigateByUrl('/homepage');});
  var obj3={
    requester:this.userid,
    recipient:id
  }
   this.dataservice.changestatus(obj3).subscribe();
  
 }

rejectrqst(id){
  this.dataservice.removefrndstatus(id,this.userid).subscribe();
  let doc = document.getElementById('friend_'+id);
      doc.classList.add("remove")

}

}
