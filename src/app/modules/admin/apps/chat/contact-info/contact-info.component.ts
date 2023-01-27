import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Chat, Contact } from 'app/modules/admin/apps/chat/chat.types';
import { ChatService } from '../chat.service';

@Component({
    selector       : 'chat-contact-info',
    templateUrl    : './contact-info.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactInfoComponent
{
    @Input() chat: Chat;
    @Input() drawer: MatDrawer;

    Messages:any
    currUser:any
    currMSG:any
    len:any

    /**
     * Constructor
     */
    constructor(
        private _chatService:ChatService,
        private _changeDetectorRef:ChangeDetectorRef
    )
    {
    }
    
    ngOnInit(): void
    {
        // Chat
        this.Messages=this._chatService.Messages.msg
        this._chatService.getChats().subscribe({
            next:(res)=>{
                if(res.users.length > this.Messages.length)
                {
                    this.len = this.Messages
                }
                else{
                    this.len = res.users
                }
                for (let [index,i] of (this.len).entries())
                {   
                    if(this.Messages[index].idUser == i.idUser)
                    {
                        this.currUser = i
                        this.currMSG = this.Messages[index] 
                        this._changeDetectorRef.detectChanges();
                    }
                }
                
            }
        })
    }
}
