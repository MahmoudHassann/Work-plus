import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector       : 'reviews',
    templateUrl    : './reviews.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class reviewsComponent implements OnInit
{

    Reviews= new BehaviorSubject<any>(null)
    getRev:any =[]

    /**
     * Constructor
     */
    constructor(private _userService:UserService)
    {
    }
    ngOnInit(): void
    {
        this.reviews()
        this.Reviews.subscribe({
            next:()=>{
                if(this.Reviews.getValue() != null)
                {
                    this.getRev = this.Reviews.getValue()
                }
                else{
                    this.reviews()
                }
            }
        })
        
    }

    reviews()
    {
        this._userService.getReviews().subscribe({
            next:(res)=>{
                
                if(res.Message === 'Success')
                {
                    this.Reviews.next(res.compRev)
                    
                }
                
            }
        })
    }


    update(id:any)
    {
        console.log(id);
        this._userService.updateReviews(id).subscribe({
            next:(res)=>{
                if(res.Message === 'updated')
                {
                    this.reviews()
                }
            }
        })
    }
}
