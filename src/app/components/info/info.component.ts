import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import {ChatService} from '../../services/chat.service';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  constructor(private router: Router, private formBuilder: FormBuilder,private chatService: ChatService,private dataservice:DataService) { }
  infoForm: FormGroup;
  userdata:Array<any>=[]
  imgsarray:Array<any>=[]
  currentuser:Array<any>=[]
  tempuserdata:Array<any>=[]
  userid="";
  usermail =localStorage.getItem('email');
  display:boolean= true;
  display1:boolean =false;
  display2:boolean =false;
  fileData: File = null;
  filename= "";
  profpic:any;
  covpic:any;
  infoarr= null;
  useremail = localStorage.getItem('email');
  ngOnInit() {

    this.infoForm  =  this.formBuilder.group({
      work: ['', Validators.required],
      school: ['', Validators.required],
      college: ['', Validators.required],
      live: ['', Validators.required],
      from: ['', Validators.required],
      instagram: ['', Validators.required],
      mail: ['', Validators.required],
  });

   // 1. get all users
   this.dataservice.getallusersdata().subscribe(data => {
     this.currentuser= data.filter(item=>{ return item.email == this.usermail})
    // removing myself from findfriends components
var udata = this.userdata =data.filter(item=>{ return item.email != this.usermail})
this.tempuserdata = udata
var result = this.tempuserdata.map(item=>item._id)

});

// getting logged in user id and profile pic
this.dataservice.getuserdata(this.useremail).subscribe(data => {
  const userdata = data;
  const userid = userdata.map(item => item._id).toString();
   this.userid = userid
  
    this.profpic = userdata.map(item=> item.profilepic).pop();
   
    this.covpic = userdata.map(item=> item.coverpic).pop();
});

this.dataservice.getuserinfo(this.useremail).subscribe(data=>{
  var arr=[]
  arr.push(data)
  this.infoarr = arr; 
});

}

  information(){

    var obj= {
      _id: this.userid,
      email:this.usermail,
      work: this.infoForm.value.work,
      school: this.infoForm.value.school,
      college: this.infoForm.value.college,
      livesin: this.infoForm.value.live,
      from: this.infoForm.value.from,
      instagram: this.infoForm.value.instagram,
      mail: this.infoForm.value.mail,
    }
     
    this.dataservice.adduserinfo(obj).subscribe(data=>{
      this.router.navigateByUrl('/homepage');
    });
  
  }

  onFileSelected(event){
    this.fileData = <File> event.target.files[0];
    let x=event.target.files[0].name;
    this.filename = x;
    }

    addfriends(id){
      // req,rec,id,reqemail
      this.chatService.sendrequest(this.userid,id,this.usermail);
      let remove = document.getElementById('friend_'+id);
      remove.classList.add("remove");    
    }

    function(){
      this.display = false;
      this.display1 = true;   
    }

    function1(){

      if(this.profpic.length ==0 && this.covpic.length ==0){

        this.display1 = false;
        this.display2 = true;
        var present  ="false"
        var present1="false"
        for(var i =0; i<this.imgsarray.length;i++){
         if(this.imgsarray[i] =='1') {
           present = "true";
         }
         if(this.imgsarray[i]== '2'){
           present1 = "true"
         }
      
        }
        if(present == "false"){
          let obj={
            _id: this.userid,
             base64Data:  "",
          }
          this.dataservice.addprofilepic(obj).subscribe();
        }
        if(present1 == "false"){
          let obj={
            _id: this.userid,
             base64Data:  "",
          }
          this.dataservice.addcoverpic(obj).subscribe();
        }
    
      }
      else{
        this.display1 = false;
        this.display2 = true;
      }
     
    }
  
    profilepic(){
    let reader =new FileReader();
    const id = this.currentuser.map(item => item._id).toString();
   
    if(this.fileData != null){
      reader.readAsDataURL(this.fileData);
      reader.onload = (e: any) =>{
        const base64 = reader.result;

        let obj={
          filename: this.filename,
          _id: id,
           base64Data:  base64,
        }
        this.imgsarray.push('1');
        alert("Profilepic uploaded Successfully")
        this.dataservice.addprofilepic(obj).subscribe();
          
      }
  
    }
}

coverpic(){
let reader =new FileReader();
const id = this.currentuser.map(item => item._id).toString();

if(this.fileData != null){
  reader.readAsDataURL(this.fileData);
  reader.onload = (e: any) =>{
    const base64 = reader.result;

    let obj={
      filename: this.filename,
      _id: id,
       base64Data:  base64,
    }
    this.imgsarray.push('2');
    alert("Coverpic uploaded Successfully")
    this.dataservice.addcoverpic(obj).subscribe(); 

  }
}
}


}
