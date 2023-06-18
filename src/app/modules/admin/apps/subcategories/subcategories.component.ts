import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { BehaviorSubject } from 'rxjs';
import { freelanceService } from '../freelance/freelance.service';

@Component({
    selector       : 'subcategories',
    templateUrl    : './subcategories.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class subcategoriesComponent implements OnInit
{
    subcategories:any

    /**
     * Constructor
     */
    constructor(private _freelanceService:freelanceService, private _changeDetectorRef:ChangeDetectorRef)
    {
        
    }
    ngOnInit(): void
    {
        this.getsubCategories()
    }

    getsubCategories()
    {
        this._freelanceService.getsubCategories().subscribe(({
            next:(res)=>{
                this.subcategories = res['sctg']
                this._changeDetectorRef.detectChanges()
            }
        }))
    }

   
}
