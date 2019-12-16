import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-friendslist',
  templateUrl: './friendslist.component.html',
  styleUrls: ['./friendslist.component.css']
})
export class FriendslistComponent implements OnInit {
  friends:Array<any>=[]; 
  userdata:Array<any>=[];
  userid="";
  profilepic:string;
  coverpic:string;
  username:string;
  email=localStorage.getItem('email');
  constructor(private dataservice:DataService) { }

  ngOnInit() {
      // getting logged in user  profilepic ,userid and coverpic
    this.dataservice.getuserdata(this.email).subscribe(data => {
      const userdata = data;
      this.username = userdata.map(item => item.username).toString();
      const userid = userdata.map(item => item._id).toString();
       this.userid = userid
      const profpic = userdata.map(item=> item.profilepic).pop();
      const coverpic = userdata.map(item=> item.coverpic).pop();
      var cp=[]
      var pf=[]
      pf.push(profpic[0])
      cp.push(coverpic[0])
    this.coverpic = cp.map(item=>item.coverpic).toString();
    this.profilepic = pf.map(item=>item.profilepic).toString();
    });

      // getting logged in user friendlist
    this.dataservice.getfriendslist(this.email).subscribe(data=>{  
       this.userdata.push(data);
       var friendsid = this.userdata.map(item=>item.friendsid)
       this.friends = friendsid.pop()
       var ids = this.friends.map(item=>item._id)
    });
  }

  //unfriend a friend
 unfriendfun(id,email){
  this.dataservice.unfriend(this.email,id).subscribe();
  this.dataservice.unfriend(email,this.userid).subscribe();
  this.dataservice.removefrndstatus(id,this.userid).subscribe();
  let doc = document.getElementById('friend_'+id);
  doc.classList.add("remove")
 }

  emailfun(email){
    localStorage.setItem('friendemail',email)
  }

}
