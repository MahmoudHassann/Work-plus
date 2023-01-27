import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector       : 'discuss',
    templateUrl    : './discuss.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class discussComponent implements OnInit
{
    discuss = new BehaviorSubject<any>(null)
    getPost:any =[]
    /**
     * Constructor
     */
    constructor(private _userService:UserService)
    {
    }

    ngOnInit(): void
    {
        this.Discuss()
        this.discuss.subscribe({
            next:()=>{
                if(this.discuss.getValue() != null)
                {
                    this.getPost = this.discuss.getValue()
                }
                else{
                    this.Discuss()
                }
            }
        })
    }

    Discuss()
    {
        this._userService.getDiscuss().subscribe({
            next:(res)=>{
                if(res.Message === 'Success')
                {
                    this.getPost =res.post
                    console.log(this.getPost);
                    
                    this.discuss.next(res.post)
                }
            }
        })
    }

    del(id:any)
    {
        console.log(id);
        this._userService.deletetDiscuss(id).subscribe({
            next:(res)=>{
                console.log(res);
                
                if(res.Message === 'Deleted')
                {
                    this.Discuss()
                }
            }
        })
    }

}
