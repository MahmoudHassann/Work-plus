import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector       : 'jobs',
    templateUrl    : './jobs.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class jobsComponent implements OnInit
{
    Jobs= new BehaviorSubject<any>(null)
    getJob:any =[]

    /**
     * Constructor
     */
    constructor(private _userService:UserService)
    {
        /* this.ss.slice(0,1) */
    }
    ngOnInit(): void
    {
        this.getJobs()
        this.Jobs.subscribe({
            next:()=>{
                if(this.Jobs.getValue() != null)
                {
                    this.getJob = this.Jobs.getValue()
                }
                else{
                    this.getJobs()
                }
            }
        })
    }

    getJobs()
    {
        this._userService.getJobs().subscribe({
            next:(res)=>{
                if(res.Message === 'Success')
                {
                    this.Jobs.next(res.Jobs)
                }
            }
        })
    }

   
}
