import { Component, OnInit } from '@angular/core';
import {data} from '../../models/data';
import {likes} from '../../models/likes';
import {userdata} from '../../models/userdata';
import {DataService} from '../../services/data.service';
import {ChatService} from '../../services/chat.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  data:data[];
  images:Array<any>=[]
  newdata:Array<any>=[]
  username:string;
  info:Array<any>=[];
  display:Array<any>=[];
  display1:boolean =false;
  userdata:userdata[];
  userid="";
  newuserid =""
  postslength = null;
  friends:Array<any>=[]
  likes:likes[];
  posts:Array<any>=[];
  fileData: File = null;
  inputValue : null;
  commentValue : null;
  friendlists:Array<any>=[];
  allfriends:Array<any>=[];
  friendsid:Array<any>=[];
  filename= "";
  profilepic:string;
  coverpic:string;
  newprofilepic:string;
  obj1:[];
  email =localStorage.getItem('friendemail');
  useremail = localStorage.getItem('email');
  
  
  constructor(private dataservice:DataService, private chatService: ChatService) {}

  ngOnInit() {

  //getting user intro details
 this.dataservice.getuserinfo(this.useremail).subscribe(data=>{
   this.info.length = 0 ;
   this.info.push(data);
 })   
 
// getting logged in user id and profile pic
this.dataservice.getuserdata(this.useremail).subscribe(data => {
  const userdata = data;
  const userid = userdata.map(item => item._id).toString();
  this.userid = userid
  

  const profpic = userdata.map(item=> item.profilepic).pop();
  var pf=[]
  pf.push(profpic[0])
this.profilepic = pf.map(item=>item.profilepic).toString();
});

    // getting selected  user   id and profile pic
this.dataservice.getuserdata(this.email).subscribe(data => {
  this.userdata = data;
  this.username = this.userdata.map(item => item.username).toString();
  const userid = this.userdata.map(item => item._id).toString();
  const profpic = this.userdata.map(item=> item.profilepic).pop();
  const coverpic = this.userdata.map(item=> item.coverpic).pop();
  var cp=[]
  var pf=[]
  pf.push(profpic[0])
  cp.push(coverpic[0])
  this.newprofilepic = pf.map(item=>item.profilepic).toString();
  this.coverpic = cp.map(item=>item.coverpic).toString();
  this.newuserid = userid;
  this.dataservice.getpost(userid).subscribe(data=>{
    // these are all posts
    this.posts = data
    //getting shared posts
   this.dataservice.getsharedpostbyid(userid).subscribe(data=>{
    let sharedpost=data.map(item=>item.posts)
       var fpost=sharedpost;
       fpost = fpost.pop();
       if(fpost !=undefined && fpost.length>0 && this.posts.length >0){
        this.posts = fpost.concat(this.posts)
       }
       else if(this.posts.length <1 && fpost!=undefined){
         this.posts = fpost
       }
       
   });

    this.postslength = this.posts.length;
    var sdata = this.posts.map(item => item.image);
    this.images.length=0;
    for(var i=0;i<sdata.length;i++){
      if (sdata[i]!= ""){
        this.display1 = true;
        // pushing posts images in images array to display in photos section
        this.images.push(this.posts[i]);
      }
    }
  });
});


    
// getting friendlist
this.dataservice.getfriendslist(this.email).subscribe(data=>{
  this.newdata.push(data)  
  var friendsid = this.newdata.map(item=>item.friendsid)
  this.allfriends = friendsid.pop();
});

}

  focusoutHandler(event) { 
  this.inputValue = event.target.value;   
  }

  focusoutComments(event) {
    if(event.target.value != ""){
    this.commentValue = event.target.value;
    }   
  }

  //getting filename
  onFileSelected(event){
   this.fileData = <File> event.target.files[0];
   let file=event.target.files[0].name;
   this.filename = file;
  }

//doing comments on posts
  comment(id,value){   
    if (value != undefined){
      let obj={
        comment_post: value,
        post_id: id,
        userid: this.userid
      }
      this.dataservice.addcomments(obj).subscribe(data=>{
         this.ngOnInit();
     })
    }
    else{
      let obj={
        comment_post: this.commentValue,
        post_id: id,
        userid: this.userid
      }
      this.dataservice.addcomments(obj).subscribe(data=>{
         this.ngOnInit();
     })
    }
     
  }
 
  // doing like on posts
  addlikes(postid){
    var posts = this.posts.map(item=>{return item._id})
    var likes= this.posts.filter(item=> item._id == postid ).map(item=> {return item.likes}).pop();
     // if no likes on the post  
    if(likes.length == 0){
      let obj={
        postid: postid,
        userid:this.userid
     }
      this.dataservice.addlikes(obj).subscribe();
     }
     else{ 
      for(var i=0; i<likes.length; i++){
        if(this.userid == likes[i].toString()){
          let obj={
            postid: postid,
            userid:this.userid
         }
         // if user have already liked then remove its like 
        this.dataservice.deletelikes(obj).subscribe(data=>{
          this.ngOnInit();
        });       
         return;
        }
      }  
      let obj={
        postid: postid,
        userid:this.userid
     }
      this.dataservice.addlikes(obj).subscribe();    
  }
  this.ngOnInit();

  }
  //uploading text + video posts here
  videopost(text){
    let reader =new FileReader();
    const id = this.userdata.map(item => item._id).toString();
    const username = this.userdata.map(item => item.username).toString();
    let profpic = this.userdata.map(item => item.profilepic)
    var profile=[];
    profile.push(profpic[0][0])
    var profilepic=profile.map(item=> item._id).toString()
    if(this.fileData != null){
      reader.readAsDataURL(this.fileData);
      reader.onload = (e: any) =>{
      const base64 = reader.result;        
        let obj={
          filename: this.filename,
          username: username,
          profilepic: profilepic,
          userid: id,
          text_post: text,
          base64Data: base64,
          email: this.email
        }
        
        this.dataservice.addvideopost(obj).subscribe(data=>{
          this.ngOnInit();
        });
        
      }            
  }
  }
  addpost1(){
    let reader =new FileReader();
    const id = this.userdata.map(item => item._id).toString();
    const username = this.userdata.map(item => item.username).toString();
    let profpic = this.userdata.map(item => item.profilepic)
    var profile=[];
    profile.push(profpic[0][0]);
    var profilepic=profile.map(item=> item._id).toString();
     //if user has selected an image
    if(this.fileData != null){
      reader.readAsDataURL(this.fileData);
      reader.onload = (e: any) =>{
      const base64 = reader.result; 
      let obj={
        filename: this.filename,
        username: username,
        profilepic: profilepic,
        userid: id,
        text_post: this.inputValue,
        base64Data: base64,
        email: this.email
      }
      this.dataservice.addpost(obj).subscribe(data=>{
        this.ngOnInit();
      });
      }            
  }
    else{
      let obj={
        userid: id,
        text_post: this.inputValue,
        base64Data: "",
        username: username,
        profilepic: profilepic,
        email: this.email
      }
    this.dataservice.addpost(obj).subscribe(data=>{
      this.ngOnInit();
    });
  }
  
}

displayfunc(id){
  let min=document.getElementById('drop_'+id);
  min.classList.toggle('dropdisplay');
}

//delete post
delpost(id){
  this.dataservice.deletepost(id).subscribe(data=>{
  this.dataservice.getfriendslist(this.email).subscribe(result=>{
  this.friendlists.push(result)
   //  this.friendlists = result;     
  var array: any[] = this.friendlists.map(item=> { return  item.friendsid
  });
  var friendsid = array[0].map(item =>{ return item._id})
  for(var i=0; i<friendsid.length;i++){
    this.dataservice.delfriendspost(friendsid[i],id).subscribe();
  }
  this.ngOnInit()
    
  });
});
}

poptext(){
  let modal = document.getElementById('myModal');
  modal.style.display = "block";
}
popimg(){
  let modal = document.getElementById('myModal1');
  modal.style.display = "block";
}
popvideo(){
  let modal = document.getElementById('myModal2');
  modal.style.display = "block";
}
closepop(){
  let modal = document.getElementById('myModal');
  let modal1 = document.getElementById('myModal1');
  let modal2 = document.getElementById('myModal2');
  modal.style.display = "none";
  modal1.style.display = "none";
  modal2.style.display = "none";

}

emailfun(email){
  localStorage.setItem('friendemail',email);
  
}

}
