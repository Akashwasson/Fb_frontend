import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import * as jwt_decode from "jwt-decode";
import { Router } from  '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = 'http://localhost:4000';
  constructor(private http: HttpClient,private router: Router) { }

  authuser(user){
    return this.http.post(`${this.url}/users/authenticate`, user)   
  }

  isLoggedIn(){
    if(localStorage.getItem('token') === null || localStorage.getItem('token') === undefined) 
    {
        return false;
    }

     // Get and Decode the Token
     const token = localStorage.getItem('token');
     const decoded = jwt_decode(token);
    // Check if the cookie is valid

    if(decoded.exp === undefined) 
    {
        return false;
    }
      // Get Current Date Time
      const date = new Date(0);

      // Convert EXp Time to UTC
      let tokenExpDate = date.setUTCSeconds(decoded.exp);
      
      // If Value of Token time greter than 

      if(tokenExpDate.valueOf() > new Date().valueOf()) 
      {
        return true;
      }

      // console.log("NEW DATE " + new Date().valueOf());
      // console.log("Token DATE " + tokenExpDate.valueOf());

  }

 logout(){
    localStorage.clear();
    this.router.navigateByUrl('/')
  }

}
