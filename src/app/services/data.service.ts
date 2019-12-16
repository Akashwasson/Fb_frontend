import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {post} from '../models/post';
import {likes} from '../models/likes';
import {socket} from '../models/socket';
import {userdata} from '../models/userdata';
import {Friendlists} from '../models/friendlists';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {
 url = 'http://localhost:4000';
 
  constructor(private http: HttpClient) { }
 
  

  getlikesbyuserid(obj):Observable<likes[]>{
    return this.http.get<likes[]>(`${this.url}/likes/${obj}`)
  }

  getsocketid(obj):Observable<socket[]>{
    return this.http.get<socket[]>(`${this.url}/socketmanager/byuserid/${obj}`)
  }

  addlikes(obj){
   return this.http.post(`${this.url}/likes`,obj);
  }
  deletelikes(obj){
    return this.http.post(`${this.url}/likes/deletelike`,obj);
  }

  registerUser(user) { 
    
   return this.http.post(`${this.url}/users`, user);     
  }

  createtoken(obj){
    return this.http.post(`${this.url}/users/TokenOnRegister`, obj); 
  }

  resetPassword(obj){
    return this.http.post(`${this.url}/users/reset`, obj); 
  }

  acceptfrndrqst(obj){
    return this.http.post(`${this.url}/friendrequests/accepted`, obj)
  }
  
  changestatus(obj){
    return this.http.post(`${this.url}/friendrequests/statusAccpected`, obj)
  }

  unfriend(email,friendid){
    return this.http.delete(`${this.url}/friendlists/${email}/${friendid}`)
  }
  removefrndstatus(friendid,myid){
    return this.http.delete(`${this.url}/friendrequests/${friendid}/${myid}`)
  }
 
   getpost(obj):Observable<post[]>{
     return this.http.get<post[]>(`${this.url}/posts/byuserid/${obj}`)
   }
   getfriendpost(obj):Observable<any[]>{
    return this.http.get<any[]>(`${this.url}/friendsposts/${obj}`)
  }
   getpostbyid(obj):Observable<post[]>{
    return this.http.get<post[]>(`${this.url}/posts/${obj}`)
  }
  getsharedpostbyid(id):Observable<any[]>{
    return this.http.get<any[]>(`${this.url}/sharedpost/${id}`)
  }
   getuserdata(email):Observable<userdata[]>{
     
    return this.http.get<userdata[]>(`${this.url}/usersdata/mail/${email}`)
  }
  getdatabyusername(username):Observable<userdata[]>{
     
    return this.http.get<userdata[]>(`${this.url}/usersdata/byname/${username}`)
  }

  getallusersdata():Observable<userdata[]>{
     
    return this.http.get<userdata[]>(`${this.url}/usersdata`)
  }

  getallfrndrequests(recipientid):Observable<any[]>{
     
    return this.http.get<any[]>(`${this.url}/friendrequests/byid/${recipientid}`)
  }

  getfriendslist(email):Observable<Friendlists[]>{
    return this.http.get<Friendlists[]>(`${this.url}/friendlists/${email}`)
  }

  getuserinfo(email):Observable<any[]>{
    return this.http.get<any[]>(`${this.url}/introschema/${email}`)
  }

   addpost(fd){
    return this.http.post(`${this.url}/posts`,fd);
   }  
   addsharedpost(obj){
    return this.http.post(`${this.url}/sharedpost`,obj);
   }  
   addvideopost(fd){
    return this.http.post(`${this.url}/posts/video`,fd);
   }  

   adduserinfo(obj){
    return this.http.post(`${this.url}/introschema`,obj)
   }

   addcomments(value){
     return this.http.post(`${this.url}/comments`,value);
   }

   addprofilepic(obj){
     return this.http.post(`${this.url}/profilepics`,obj)
   }
   emptyprofilearray(obj){
    return this.http.post(`${this.url}/profilepics/emptyarray`,obj)
  }
   addcoverpic(obj){
    return this.http.post(`${this.url}/coverpics`,obj)
  }
  emptycoverarray(obj){
    return this.http.post(`${this.url}/coverpics/emptyarray`,obj)
  }

  deletepost(id){
    return this.http.delete(`${this.url}/posts/${id}`)
  }
  delfriendspost(id,postid){
    return this.http.delete(`${this.url}/friendsposts/${id}/${postid}`)
  }
}
