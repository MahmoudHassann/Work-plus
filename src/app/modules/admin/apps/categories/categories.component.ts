import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { BehaviorSubject } from 'rxjs';
import { freelanceService } from '../freelance/freelance.service';


@Component({
    selector       : 'categories',
    templateUrl    : './categories.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class categoriesComponent implements OnInit
{
    
    categories:any
    subcategories:any

    /**
     * Constructor
     */
    constructor(private _freelanceService:freelanceService, private _changeDetectorRef:ChangeDetectorRef)
    {
     
    }
    ngOnInit(): void
    {
        this.getCategories()
    }

   
    getCategories()
    {
        this._freelanceService.getCategories().subscribe(({
            next:(res)=>{
                this.categories = res['ctg']
                this._changeDetectorRef.detectChanges()
            }
        }))
    }
   
}
