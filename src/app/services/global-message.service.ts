import { Injectable } from '@angular/core';
import { GlobalMessage } from '../models/globalMessage';

@Injectable({
  providedIn: 'root'
})
export class GlobalMessageService {

  messages: GlobalMessage[];

  constructor() {
    this.messages = [];
  }

  addMessage(msg: string, type:string){
    var message = new GlobalMessage();
    
    message.message = msg;
    message.type = type;
    this.messages.push(message);

    if(this.messages.length > 3){
      this.removeMessage(this.messages[0]);
    }
  }

  removeMessage(msg: GlobalMessage){
    var tmp = this.messages.filter(m => m !== msg);
    this.messages = tmp;
  }
}
