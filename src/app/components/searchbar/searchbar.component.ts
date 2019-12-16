import { Component, OnInit } from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {
  userdata:Array<any>=[]
  userid="";
  usermail =localStorage.getItem('email');
  loggeduserdata:Array<any>=[]
  searchedname = localStorage.getItem('searchedname');
  constructor(private chatService: ChatService,private dataservice:DataService) { }

  ngOnInit() {

    this.dataservice.getuserdata(this.usermail).subscribe(data => {
      this.loggeduserdata = data;
       this.userid = this.loggeduserdata.map(item => item._id).toString();
    })
    // 1. get all users
    this.dataservice.getdatabyusername(this.searchedname).subscribe(data => {
       this.userdata = data

    });

  }

  addfriends(id){
    // req,rec,id,reqemail
    localStorage.removeItem('searchedname')
    this.chatService.sendrequest(this.userid,id,this.usermail);
    let remove = document.getElementById('friend_'+id);
    remove.classList.add("remove")
    
  }

  removebtn(id){
    localStorage.removeItem('searchedname')
  let remove = document.getElementById('friend_'+id);
  remove.classList.add("remove")
  
  }
  emailfun(email){
    localStorage.setItem('friendemail',email)
  }

}

