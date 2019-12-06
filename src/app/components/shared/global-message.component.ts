import { Component, OnInit, Input, OnDestroy, ElementRef, ViewChild, Renderer2, AfterViewInit, ViewChildren } from '@angular/core';
import { GlobalMessage } from 'src/app/models/globalMessage';
import { Subscription, Observable, timer } from 'rxjs';
import { GlobalMessageService } from 'src/app/services/global-message.service';
import { trigger, state, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'global-message',
  templateUrl: './global-message.component.html',
  styleUrls: ['./global-message.component.css'],
  animations: [
    trigger('showHide', [
      state('show', style({
        height: '40px',
        opacity: 1,
      })),
      state('hide', style({
        height: '0px',
        opacity: 0
      })),
      transition('show => hide', 
        animate('0.5s ease-out')
      ),
      transition('hide => show', 
        animate('0.3s ease-in')
      )
    ])
  ]
})
export class GlobalMessageComponent implements OnInit, OnDestroy{
  @Input() message: GlobalMessage;
  @ViewChild("messageContainer", null) messageContainerElem: ElementRef;

  private subscription: Subscription;
  private timer: Observable<number> = timer(0, 1000);
  private showing: boolean = false;
  private initialized: boolean = false;

  get stateName() {
    return this.showing ? 'show' : 'hide';
  }

  constructor(private renderer: Renderer2,
              private globalMessageService: GlobalMessageService) { }

  ngOnInit() {
    this.subscription = this.timer.subscribe(val => {
      if(val === 0){
        if(!this.showing){
          this.toggle();
        }
      }

      if(val >= 10 && this.showing){
        this.toggle();     
      }
    });

    this.renderer.addClass(this.messageContainerElem.nativeElement, this.message.type);
  }

  ngOnDestroy(){
    console.log("Destroy timer");
  }

  toggle(){
    this.showing = !this.showing;
    if(!this.initialized) this.initialized = true;
  }

  remove(){
    if(this.showing){
      this.toggle();
    }
  }

  deleteMessage(){
    if(!this.initialized || this.showing) return;

    this.globalMessageService.removeMessage(this.message);
  }

}
