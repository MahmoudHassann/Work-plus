import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Tag, Task } from 'app/modules/admin/apps/freelance/freelance.types';
import { freelanceService } from 'app/modules/admin/apps/freelance/freelance.service';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector       : 'freelance-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class freelanceListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    drawerMode: 'side' | 'over';
    selectedTask: Task;
    tags: Tag[];
    freelance: Task[];
    freelanceCount: any = {
        completed : 0,
        incomplete: 0,
        total     : 0
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _freelanceService: freelanceService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private userService:UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
       

        // Get the freelance
        this._freelanceService.getfreelance().subscribe(({
            next:(res)=>{
                this.freelance = res.FL_Projects
                this._freelanceService._freelance = res.FL_Projects
                console.log(this.freelance);
                this._changeDetectorRef.detectChanges()
            }
        }))
            

       

        // Subscribe to media query change
        this._fuseMediaWatcherService.onMediaQueryChange$('(min-width: 1440px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {

                // Calculate the drawer mode
                this.drawerMode = state.matches ? 'side' : 'over';

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Listen for shortcuts
        
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
     * On backdrop clicked
     */
    onBackdropClicked(): void
    {
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

  

    /**
     * Toggle the completed status
     * of the given task
     *
     * @param task
     */
    toggleCompleted(task:any): void
    {
        if(task.reviewed)
        {
            console.log(task);
        }
        else{
            this._freelanceService.updateTask(task.postId,true).subscribe(({
                next:(res)=>{
                    console.log(res);
                    // Get the freelance
                    this._freelanceService.getfreelance().subscribe(({
                        next:(res)=>{
                            this.freelance = res.FL_Projects
                            console.log(this.freelance);
                            this._changeDetectorRef.detectChanges()
                        }
                    }))
                    this._changeDetectorRef.detectChanges()
                }
            }))
        }
        
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

    details(task:any)
    {
        localStorage.setItem('task',JSON.stringify(task))
    }
}
