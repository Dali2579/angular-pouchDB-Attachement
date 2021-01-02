import { Component, OnInit } from '@angular/core';
import { MAT_TOOLTIP_SCROLL_STRATEGY } from '@angular/material/tooltip';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DataService } from './data.service';
import { myFile } from './myFile.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-PouchDB-Attchement';
  myFiles: myFile[]=[];
  constructor(private data:DataService,private sanitizer: DomSanitizer) {
   
  }
  
  ngOnInit(): void {
    this.data.fetch().then(response =>{
        for (let row of response.rows) {     
          let attachments = row.doc['_attachments'];  
         
          let myfile=
          {              
            name:Object.keys(attachments)[0],       
            url: this.sanitizer.bypassSecurityTrustUrl('data:' + attachments[Object.keys(attachments)[0]].content_type + ';base64,' + attachments[Object.keys(attachments)[0]].data),
            type:attachments[Object.keys(attachments)[0]].content_type,
            link:this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.dataURItoBlob('data:' + attachments[Object.keys(attachments)[0]].content_type + ';base64,' + attachments[Object.keys(attachments)[0]].data)))
          };
          console.log(myfile);
          this.myFiles.push(myfile);            
        }
       
      });
  }
 
  public dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

  public onSelectedFileMultiple(event) {
    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        let file = event.target.files[i];
        this.data.addNewFile(file);
      }
    }
  }
}


