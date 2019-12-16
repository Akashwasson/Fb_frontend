import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { identifierModuleUrl } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private url = 'http://localhost:4000';
  private socket;  
  
  constructor() { 
    this.socket = io(this.url)
  }


  loadmessages(from,to){
    this.socket.emit('prevmsgs',{from:from, to:to});
}

 sendMessage(message,to,from) {
    this.socket.emit('sendmessage', {from:from, to:to,msg:message})
}

seen(obj){
  this.socket.emit('messageseen',obj)
}

registeruser(id,friendsid){
  this.socket.emit('registeruser',{_id:id, frndsids:friendsid})
}

userdisconnected(){
  this.socket.emit('end',{msg:"anything"})
}
sendstatus(id,friendsid){
  this.socket.emit('sendstatus',{_id:id, frndsids:friendsid})
}

sendrequest(req,rec,reqemail){
  this.socket.emit('sendrqst',{requester:req, recipient:rec, email:reqemail })
}

getrequests =()=> {
  return Observable.create((observer) => {
      this.socket.on('sendrequest', (data) => {
          observer.next(data);
      });
  });
}

getMsgSeen =()=> {
  return Observable.create((observer) => {
      this.socket.on('seen', (data) => {
          observer.next(data);
      });
  });
}

 getMessages = () => {
    return Observable.create((observer) => {
        this.socket.on('new_msg', (data) => {
            observer.next(data);
        });
    });
}
getPrevMessages = () => {
  return Observable.create((observer) => {
      this.socket.on('receiveprevmessage', (data) => {
          observer.next(data);
      });
  });
}

getloadstatus = () =>{
  return Observable.create((observer) => {
    this.socket.on('status', (data) => {
        observer.next(data);
    });
})
}

getonlinestatus = () =>{
  return Observable.create((observer) => {
    this.socket.on('online', (data) => {
        observer.next(data);
    });
});
}
getofflinestatus = () =>{
  return Observable.create((observer) => {
    this.socket.on('offline', (data) => {
        observer.next(data);
    });
});
}
}
