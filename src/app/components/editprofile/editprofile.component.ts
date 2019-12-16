import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import {ChatService} from '../../services/chat.service';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css']
})
export class EditprofileComponent implements OnInit {
 
  infoForm: FormGroup;
  currentuser:Array<any>=[]
  userid="";
  usermail =localStorage.getItem('email');
  fileData: File = null;
  filename= "";
  infoarr= null;
  useremail = localStorage.getItem('email');

  constructor(private router: Router, private formBuilder: FormBuilder,private chatService: ChatService,private dataservice:DataService) { }

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

  // getting logged in user ID
this.dataservice.getuserdata(this.useremail).subscribe(data => {
   this.currentuser = data;
   this.userid = this.currentuser.map(item=>item._id).toString()
});

// getting user intro details here
this.dataservice.getuserinfo(this.useremail).subscribe(data=>{
  var arr=[]
  arr.push(data)
  this.infoarr = arr
 
})

  }

  // user information updates here
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
       })
   
  }

  //getting filename here
  onFileSelected(event){
    this.fileData = <File> event.target.files[0];
     let file=event.target.files[0].name;
    this.filename = file;
    }

    //uploading profilepic 
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
    
        let obj1={
          userid:id
        }
        //first i empty the profilepic array and then pushing new profilepic 
        this.dataservice.emptyprofilearray(obj1).subscribe(data=>{
          this.dataservice.addprofilepic(obj).subscribe(dat=>{
            window.location.reload()
          });         
        })    
    }
  }
}

//uploading coverpic here
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
      let obj1={
        userid:id
      }
      //first i empty the coverpic array and then pushing new coverpic 
      this.dataservice.emptycoverarray(obj1).subscribe(data=>{
        this.dataservice.addcoverpic(obj).subscribe(); 
        
      })
          
    }
  }
  }

}
