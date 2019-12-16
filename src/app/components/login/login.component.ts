import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from  '@angular/router';
import {DataService} from '../../services/data.service';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm :FormGroup;
  submitted  =  false;
  constructor(private router: Router, private authService: AuthService,
     private formBuilder: FormBuilder,private dataservice:DataService) { }
  
  ngOnInit() {
    this.loginForm  =  this.formBuilder.group({
        email: ['',  [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });
    this.registerForm =this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      dob: ['', Validators.required],
      sex: ['', Validators.required],
  });
  
}
get f() { return this.loginForm.controls; }
get f1() { return this.registerForm.controls; }

 login(){
  this.submitted = true;
  if(this.loginForm.invalid){
    return;
  }
     let obj ={
       email: this.loginForm.value.email,
      password : this.loginForm.value.password
     }

     // authenticating user...if user exits then store token in local storage
  this.authService.authuser(obj).subscribe(data=>{
    var arr=[];
       arr.push(data)
       // checking success status
       let success = arr.map(item=>item.success).pop();             
       let msg = arr.map(item=>item.msg).pop();
       let token = arr.map(item=>item.token).pop();
        
       if(success == true){
        localStorage.setItem('email', this.loginForm.value.email);
        localStorage.setItem('token',token);
          this.router.navigateByUrl('/homepage');
       }
       else{
         alert(msg)
       }
  });
  
 }    
  
 register(){
   const user=this.registerForm.value;
   this.submitted = true;
  // stop here if form is invalid
  if (this.registerForm.invalid) {
      return;
  }  
  if (!this.registerForm.invalid) {
    alert("User Registered Successfully")
    this.dataservice.registerUser(user).subscribe(data=>{
      var arr=[]
      arr.push(data)
      //storing token in localstorage
      let token = arr.map(item=>item.token).toString()
      localStorage.setItem('token',token);
      localStorage.setItem('email', this.registerForm.value.email)
      this.router.navigateByUrl('/info');
    });
} 
}
   
}