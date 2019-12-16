import { Component, OnInit } from '@angular/core';
import { Router } from  '@angular/router';
import {data} from '../../models/data';
import {post} from '../../models/post';
import {likes} from '../../models/likes';
import {userdata} from '../../models/userdata';
import {DataService} from '../../services/data.service';
import {ChatService} from '../../services/chat.service';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
data:data[];
tempuserdata:Array<any>=[]
alluser:Array<any>=[]
profilepic:string;
display:Array<any>=[];
userdata:userdata[];
newuserdata:Array<any>=[]
userid="";
friends:Array<any>=[]
likes:likes[];
posts:post[];
fileData: File = null;
inputValue : null;
commentValue : null;
filename= "";
ids:Array<any>=[]
obj1:[];

email =localStorage.getItem('email');

  constructor(private router: Router,
    private dataservice:DataService, private chatService: ChatService) { }

 ngOnInit() {
    // 1. getting all users from database
 this.dataservice.getallusersdata().subscribe(data => {
    // removing myself from findfriends components
   var userdata = data.filter(item=>{ return item.email != this.email})
   this.tempuserdata = userdata
   var result = this.tempuserdata.map(item=>item._id)
   //getting my friendlist
   this.dataservice.getfriendslist(this.email).subscribe(data=>{  
     this.alluser.push(data);
     var friendsid = this.alluser.map(item=>item.friendsid)
     this.friends = friendsid.pop()
     this.ids = this.friends.map(item=>item._id)
     // show only those user which are not my friend
     this.newuserdata.length=0;
     for(var i=0;i<result.length;i++){
       var found=[];
       for(var k=0; k< this.ids.length ;k++){
          if(result[i] == this.ids[k]){
            found.push('true')           
            break;
          }
         } 
          if(found.length == 0){
           this.newuserdata.push(userdata[i])
           found =[];
          }
      }
   })
 
   });
     // getting  logged in userdata
    this.dataservice.getuserdata(this.email).subscribe(data => {
      this.userdata = data;
      const userid = this.userdata.map(item => item._id).toString();
      const profpic = this.userdata.map(item=> item.profilepic).pop();
      var pf=[]
      pf.push(profpic[0])
      this.profilepic = pf.map(item=>item.profilepic).toString();
      this.userid = userid;
      //getting all friends posts and reversing there order
      this.dataservice.getfriendpost(userid).subscribe(data=>{
        var post = [];
        post.push(data);
        var sdata= post[0].map(item=>item.posts)
        var arr = []
        for(var i=0;i<sdata[0].length;i++){        
         arr.unshift(sdata[0][i])
        }  
        this.posts = arr;
        
      })
     
    });
      
  }

  focusoutHandler(event) {   
   this.inputValue = event.target.value;    
    }

  focusoutHandlerComments(event) {
    if(event.target.value != ""){
    this.commentValue = event.target.value;
    }   
  }

  onFileSelected(event){
  this.fileData = <File> event.target.files[0];
   let x=event.target.files[0].name;
    this.filename = x;
  }  

  // doing comments on posts
  comment(id,value){   
    if (value != undefined){
      let obj={
        comment_post: value,
        post_id: id,
        userid: this.userid
      }
      this.dataservice.addcomments(obj).subscribe(data=>{
         this.ngOnInit();
     });
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
 
  // doing likes on posts 
  addlikes(postid){
    var posts = this.posts.map(item=>{return item._id})
    var likes= this.posts.filter(item=> item._id == postid ).map(item=> {return item.likes}).pop()  
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
        this.dataservice.deletelikes(obj).subscribe();
         this.ngOnInit();
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
  
  // uploading text and text + image posts here
  addpost1(){
    let reader =new FileReader();
    const id = this.userdata.map(item => item._id).toString();
    const username = this.userdata.map(item => item.username).toString();
    let profpic = this.userdata.map(item => item.profilepic)
    var profile=[];
    profile.push(profpic[0][0])
    //profilepic id
    var profilepic=profile.map(item=> item._id).toString()
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

//sharing friends post
sharepost(id){
 let obj ={
   _id:this.userid,
   postid: id
 }
 this.dataservice.addsharedpost(obj).subscribe(data=>{
  this.router.navigateByUrl('/userprofile');
 })
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

//sending friend request
addfriends(id){
  // req,rec,id,reqemail
  this.chatService.sendrequest(this.userid,id,this.email);
  let remove = document.getElementById('friend_'+id);
  remove.classList.add("remove")
  
}

removebtn(id){
let remove = document.getElementById('friend_'+id);
remove.classList.add("remove")
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
  localStorage.setItem('friendemail',email)
}

}
