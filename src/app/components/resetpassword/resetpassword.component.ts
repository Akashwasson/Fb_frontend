import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  constructor(private dataservice:DataService,private router: Router, private formBuilder: FormBuilder ) { }

  resetForm: FormGroup;
  isSubmitted  =  false;

  ngOnInit() {
    this.resetForm  =  this.formBuilder.group({
      email: ['', Validators.required],
      dob:['',Validators.required],
      password: ['', Validators.required]
  });
  }
  get formControls() { return this.resetForm.controls; }
Reset(){
  
  this.isSubmitted = true;
  if(this.resetForm.invalid){
    return;
  }

  let obj ={
    email: this.resetForm.value.email,
    dob: this.resetForm.value.dob,
    password: this.resetForm.value.password
  }
  
  this.dataservice.resetPassword(obj).subscribe(data=>{
    var arr=[];
       arr.push(data)
       let msg = arr.map(item=>item.msg).pop();
       alert(msg)
    this.router.navigateByUrl("/")
  })

}

}
