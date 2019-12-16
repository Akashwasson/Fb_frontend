import { Component, OnInit } from '@angular/core';
import {post} from '../../models/post';
import {userdata} from '../../models/userdata';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {
  userdata:userdata[];
  display:boolean =false;
  posts:post[];
  userid="";
  profilepic:string;
  coverpic:string;
  username:string;
  email =localStorage.getItem('email');
  constructor(private dataservice:DataService,) { }

  ngOnInit() {

    //getting logged in user profilepic,userid and coverpic
this.dataservice.getuserdata(this.email).subscribe(data => {
  this.userdata = data;
  const userid = this.userdata.map(item => item._id).toString();
  const userdata = data;
  this.username = userdata.map(item => item.username).toString();
  this.userid = userid
  const profpic = userdata.map(item=> item.profilepic).pop();
  const coverpic = userdata.map(item=> item.coverpic).pop();
  var cp=[]
  var pf=[]
  pf.push(profpic[0])
  cp.push(coverpic[0])
  this.coverpic = cp.map(item=>item.coverpic).toString();
  this.profilepic = pf.map(item=>item.profilepic).toString();
// getting uploaded posts photos
   this.dataservice.getpost(userid).subscribe(data => {
    this.posts = data;     
    var img = this.posts.map(item => item.image)    
    for(var i=0;i<img.length;i++){
      if (img[i]!= ""){
        this.display = true
      }
    }
  })  
});
}

}
