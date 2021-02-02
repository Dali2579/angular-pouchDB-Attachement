import { Injectable, EventEmitter } from "@angular/core";
import { Console } from "console";

import PouchDB from "pouchdb";


@Injectable({
  providedIn: "root"
})
export class DataService {
    db: any;
    listener:EventEmitter<any>=new EventEmitter();
    remoteCouch:string = "https://apikey-v2-xpr4pf78ynije6aecc2fwvtt0ry6j09y3dsstabtk76:2b89ced1c7a482b00660ecb52cdcbce5@eb7da67c-420f-4c17-b8af-e4880f8703b3-bluemix.cloudantnosqldb.appdomain.cloud/angularpouchdbattchement";
    //'http://admin:azerty123@127.0.0.1:5984/angularpouchdbattchement';
    constructor() {
        this.db=new PouchDB("angularpouchdbattchement");    
    }

    public  sync() {
     
      var opts = {
        live: true
        
      };
      this.db.sync(this.remoteCouch,opts,this.syncError);    
    }

    syncError(remoteCouch: string, opts: { live: boolean; }, syncError: any) {
      console.log("sync error");
    }

    public onPouchDbChange():any{
		return  this.db.changes({
			 	since: 'now',
				live: true
			 });
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
            attachments: true,
           // descending: true

          });
    }

    public getChangeListener() {
      return this.listener;
  }


}