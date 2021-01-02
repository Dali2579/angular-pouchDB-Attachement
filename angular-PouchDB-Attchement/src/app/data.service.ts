import { Injectable, EventEmitter } from "@angular/core";

import PouchDB from "pouchdb";


@Injectable({
  providedIn: "root"
})
export class DataService {
    db: any;
    
    constructor() {
        this.db=new PouchDB("AngularPouchDbAttchement");    
    }

    public addNewFile(file: any) {     
           this.db.putAttachment(new Date().toISOString(), file.name, file, file.type)
           .catch(function (err) {
             console.log(err);
           });
    }

    public fetch():Promise<any>{
        return this.db.allDocs({
            include_docs: true,
            attachments: true
          });
    }


}