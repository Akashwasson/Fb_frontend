import { Component, OnInit } from '@angular/core';
import {List} from '../../models/list';
import {chat} from '../../models/chat';
import {ChatService} from '../../services/chat.service';
import {DataService} from '../../services/data.service';
import {userdata} from '../../models/userdata';
import * as moment from 'moment';


@Component({
  selector: 'app-chatbar',
  templateUrl: './chatbar.component.html',
  styleUrls: ['./chatbar.component.css']
})
export class ChatbarComponent implements OnInit {
  userdata:userdata[];
  total_popups :number = 0;
  popups :Array<any>= [];
  list:List[];
  friendlistlength=null;
  loadchats:Array<any>=[];
  chatbox:Array<any>=[];
  friendlists:Array<any>=[];
  userlist:Array<any>=[];
  notify:Array<any>=[];
  togglearray:Array<any>=[];
  show:boolean = false;
  messages: chat[];
  interval: any;
  status:Array<any>=[];
  friendsid:Array<any>=[];
  userid="";
  chats:Array<any>=[];
  msgseen:Array<any>=[];
  one;
  two;

  email =localStorage.getItem('email');
  
  constructor(private chatService: ChatService,private dataservice:DataService) { }

  ngOnInit() {
      this.loadchats.length =0;
      this.msgseen.length = 0;
    
    //loading all chats history 
    this.one = this.chatService.getPrevMessages().subscribe((data)=>{
      if(data != null){
        this.loadchats.push(data); 
        var sender = data.messages;
         var array=[];

        for(var i=0; i<sender.length;i++){      
        //  this is for seenAt time stamp
         if(sender[i].sender != this.userid){
           if(sender[i].seenAt == null){
            let obj={
              _id:sender[i]._id,
              sender:sender[i].sender,
              reciever:this.userid,
         }
            array.push(obj);
           }
                        
        }      
        }       
        if(this.loadchats.length >0){
          setTimeout(() => {
            this.scrollfun(this.chatbox)
          }, 100);
        }
                 
          this.chatService.seen(array);
      } else{
        this.loadchats=[]
      }
     
    });
    
    // listing friends name in chatbar
     this.dataservice.getfriendslist(this.email).subscribe(result=>{
      this.friendlists.push(result)       
      var array: any[] = this.friendlists.map(item=> { return  item.friendsid});
      var friendsid = array[0].map(item =>{ return item._id});
      // total length of friends
      this.friendlistlength = friendsid.length ;
      //  registering loggedin user with  his all friends in socket 
        this.dataservice.getuserdata(this.email).subscribe(data => {
          this.userdata = data;
          this.userid = this.userdata.map(item => item._id).toString();
          this.chatService.registeruser(this.userid,friendsid);
     });
        
        //sending loggedin user status to all friends
        this.chatService.sendstatus(this.userid,friendsid);
          //for loading online/offline status of all friends on loading intially 
        this.chatService.getloadstatus().subscribe((data)=>{
          this.status.push(data)
        })
        
   });

    // get offline status of friend
   this.chatService.getofflinestatus().subscribe((data)=>{
    var index = this.status.findIndex(item=> item.userId == data.userId)
    if(index!=-1){ this.status.splice(index,1)} 
  })
 //get online status of friend
  this.chatService.getonlinestatus().subscribe((data)=>{
    var index = this.status.findIndex(item=> item.userId == data.userId)
    if(index!=-1){ this.status.splice(index,1)} 
      this.status.push(data)
  })
 
    //  get live messages from friends
  this.two=this.chatService.getMessages().subscribe((data) => {
  
     let chat =document.getElementById('chatwindow_'+data.reciever);
     let chat1 =document.getElementById('chatwindow_'+data.sender);

     if(chat1!=null){

       if(this.loadchats.length >0){
        let data_index = this.loadchats.filter(function (element) {
          return element.participants.some( function (subElement) {
              return subElement.id == data.sender
          });
        });
        data_index[0].messages.push(data);
        setTimeout(() => {
          this.scrollfun(this.chatbox)
        }, 50);
       }
       else{
        this.chatService.loadmessages(data.sender,data.reciever);
       }
      
     }

     if(chat!=null){
      if(this.loadchats.length >0){
        let data_index = this.loadchats.filter(function (element) {
          return element.participants.some( function (subElement) {
              return subElement.id == data.reciever
          });
        });
        data_index[0].messages.push(data);
        setTimeout(() => {
        this.scrollfun(this.chatbox)
        }, 50);
      }
      else{
        this.chatService.loadmessages(data.sender,data.reciever);
      }
        
     }

 if(this.chatbox.length>0){
  // messages seen at function when chatbox is opened
   if(chat1!=null){
       var array=[];
    let obj1={
      _id:data._id,
      sender:data.sender,
      reciever:data.reciever
  }
     array.push(obj1)
     this.chatService.seen(array)
   } 
 }
  
  // notification light on user name
  var obj ={
    id: data.from,
  }
this.notify.push(obj)

 });

 this.chatService.getMsgSeen().subscribe(data=>{
    this.msgseen.push(data)
 });
  
}
 
  register_popup(id,name,pic){
    // for loading chat of users 
    this.chatbox = id;
    this.chatService.loadmessages(this.userid,id);
      
    let index=this.userlist.findIndex(item=> id ==item.id);
    let idno=this.userlist.filter(item=> id==item.id).map(item=>item.id);
 
    //if chatbox is already opened then unshift it
    if(idno == id){
    let same=this.userlist.find(item=> id==item.id);
    this.userlist.unshift(same);
    this.userlist.splice(index+1,1)
    
    }
    
    else{
      //for new chatbox
      let input={id:id,name:name,profilepic: pic};
      this.userlist.unshift(input);
      // for toggle button
      if (this.userlist.length >3){
        let last=this.userlist.pop();
        this.togglearray.push(last);
        let idno1=this.togglearray.filter(item=> id==item.id).map(item=>item.id);
        let index1=this.togglearray.findIndex(item=> id ==item.id);
      
        if(idno1 ==id){
        let sp=this.togglearray.splice(index1,1)
          }

      }
    }
  }
    
  //on closing chatbox
  remove(id){

   let data_index = this.loadchats.findIndex(function (element) {
      return element.participants.some( function (subElement) {
          return subElement.id == id
      });
  });
 // removing from loadchats array
     this.loadchats.splice(data_index,1);

    let sp=this.userlist.findIndex(item=>item.id ==id);
    this.userlist.splice(sp,1)
    if (this.userlist.length < 3){

      if(this.togglearray.length>0){
        let last=this.togglearray.pop();
        this.userlist.push(last);
    }
  }
  
  }

  // sending msgs here
 send(id,name){
    let msg=(document.getElementById("msg_"+id) as HTMLInputElement).value;
     this.chatService.sendMessage(msg,id,this.userid);  

     (document.getElementById("msg_"+id) as HTMLInputElement).value = ''
 }
 
// always scroll down to bottom of chatbox
 scrollfun(id){
   var messageBody = document.querySelector('#chatwindow_'+id);
   messageBody.scrollTop  = messageBody.scrollHeight - messageBody.clientHeight ;
}
 

//toggle button functionthis.msgseen.length = 0;
 toggle(){
   this.show=!this.show;
 }
 // for removing from toggle button
 removetglist(id){
  let sp=this.togglearray.findIndex(item=>item.id ==id);
  this.togglearray.splice(sp,1)

 }
 // for toggling the chat box
 togglemin(id){
   let min=document.getElementById('chat_'+id);
   min.classList.toggle('tray')
   
  }
// toggling the chatbar
  toggleminibar(){
    let top= document.getElementById('tophead');
    top.classList.toggle('toggleminibar');
  }

  //unsubscribing chat component
  ngOnDestroy() { 
    this.one.unsubscribe();
    this.two.unsubscribe();
}

 }

 


