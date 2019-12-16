import { Component, OnInit } from '@angular/core';
import {userdata} from '../../models/userdata';
import {ChatService} from '../../services/chat.service';
import {DataService} from '../../services/data.service';
import { isDate } from 'moment';
@Component({
  selector: 'app-findfriends',
  templateUrl: './findfriends.component.html',
  styleUrls: ['./findfriends.component.css']
})
export class FindfriendsComponent implements OnInit {
  userdata:Array<any>=[]
  tempuserdata:Array<any>=[]
  alluser:Array<any>=[]
  friends:Array<any>=[]
  ids:Array<any>=[]
  userid="";
  usermail =localStorage.getItem('email');
  constructor(private chatService: ChatService,private dataservice:DataService) { }

  ngOnInit() {
    // 1. get all users
    this.dataservice.getallusersdata().subscribe(data => {
      // my user id
     var datad= data.find(item=>  item.email == this.usermail)
     this.userid=datad._id
      // removing myself from findfriends components
    var userdata = data.filter(item=>{ return item.email != this.usermail})
    this.tempuserdata = userdata
    var result = this.tempuserdata.map(item=>item._id)
 
    // getting friendlist
    this.dataservice.getfriendslist(this.usermail).subscribe(data=>{  
      this.alluser.push(data);
      var friendsid = this.alluser.map(item=>item.friendsid)
      this.friends = friendsid.pop()
     this.ids = this.friends.map(item=>item._id)
      // show only those user which are not my friend
      for(var i=0;i<result.length;i++){
        var found=[];
         for(var k=0; k< this.ids.length ;k++){
           if(result[i] == this.ids[k]){
             found.push('true')           
             break;
           }
          } 
           if(found.length == 0){
            this.userdata.push(userdata[i])
            found =[];
           }
       }
    })
         
    });

  }

  addfriends(id){
    // req,rec,id,reqemail
    this.chatService.sendrequest(this.userid,id,this.usermail);
    let remove = document.getElementById('friend_'+id);
    remove.classList.add("remove")
    
  }

  removebtn(id){
  let remove = document.getElementById('friend_'+id);
  remove.classList.add("remove")
  }

  emailfun(email){
    localStorage.setItem('friendemail',email)
  }
}
