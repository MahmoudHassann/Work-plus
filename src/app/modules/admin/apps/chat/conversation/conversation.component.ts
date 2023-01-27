import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Chat } from 'app/modules/admin/apps/chat/chat.types';
import { ChatService } from 'app/modules/admin/apps/chat/chat.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';




@Component({
    selector       : 'chat-conversation',
    templateUrl    : './conversation.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationComponent implements OnInit, OnDestroy
{
    @ViewChild('messageInput') messageInput: ElementRef;
    chat: any;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    Messages:any
    currUser:any
    len:any
    
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _chatService: ChatService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _ngZone: NgZone,
        private _router:Router
    )
    {
       
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Decorated methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resize on 'input' and 'ngModelChange' events
     *
     * @private
     */
    @HostListener('input')
    @HostListener('ngModelChange')
    private _resizeMessageInput(): void
    {
        // This doesn't need to trigger Angular's change detection by itself
        this._ngZone.runOutsideAngular(() => {

            setTimeout(() => {

                // Set the height to 'auto' so we can correctly read the scrollHeight
                this.messageInput.nativeElement.style.height = 'auto';

                // Detect the changes so the height is applied
                this._changeDetectorRef.detectChanges();

                // Get the scrollHeight and subtract the vertical padding
                this.messageInput.nativeElement.style.height = `${this.messageInput.nativeElement.scrollHeight}px`;

                // Detect the changes one more time to apply the final height
                this._changeDetectorRef.detectChanges();
            });
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        
        
        // Chat
        
        this._chatService.chat$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((chat: any) => {
            this.chat = chat;
        })

        this.Messages = this._chatService?.Messages?.msg
        console.log(this.Messages);
        
        this._chatService.getChats().subscribe({
            next:(res)=>{
                if(res.users.length > this.Messages.length)
                {
                    this.len = this.Messages
                }
                else{
                    this.len = res.users
                }
                for (let [index,i] of (this.Messages).entries())
                {
                    console.log(this.Messages[index]?.idUser);
                    
                    if(this.Messages[index]?.idUser == i.idUser)
                    {
                        this.currUser = i
                        this._changeDetectorRef.detectChanges(); 
                    }
                }
            }
        })
        
        
        
        
        
            

        
        
        

        

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode if the given breakpoint is active
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                }
                else
                {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    MSG:FormGroup =new FormGroup({
        msg:new FormControl(null)
      })
    message(){
        let msg = this.MSG.value
        this._chatService.sendMSG(this.currUser.idUser,msg).subscribe({
            next:()=>{
                this._chatService.getChatById(this.currUser.idUser).subscribe({
                    next:(res)=>{
                        this.Messages = this._chatService.Messages.msg
                        this._changeDetectorRef.detectChanges()
                        this.MSG.reset()
                    }
                })
                this._changeDetectorRef.markForCheck();
            }
        })
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    
    /**
     * Open the contact info
     */
    openContactInfo(): void
    {
        // Open the drawer
        this.drawerOpened = true;
        this._changeDetectorRef.detectChanges();
        

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Reset the chat
     */
    resetChat(): void
    {
        this._chatService.resetChat();

        // Close the contact info in case it's opened
        this.drawerOpened = false;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle mute notifications
     */
    toggleMuteNotifications(): void
    {
        // Toggle the muted
        this.chat.muted = !this.chat.muted;

        // Update the chat on the server
        this._chatService.updateChat(this.chat.idUser, this.chat).subscribe();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
