import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Subject } from 'rxjs';
import { debounceTime, filter, takeUntil, tap } from 'rxjs/operators';
import { assign } from 'lodash-es';
import * as moment from 'moment';
import { Tag, Task } from 'app/modules/admin/apps/freelance/freelance.types';
import { freelanceListComponent } from 'app/modules/admin/apps/freelance/list/list.component';
import { freelanceService } from 'app/modules/admin/apps/freelance/freelance.service';

@Component({
    selector       : 'freelance-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class freelanceDetailsComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('titleField') private _titleField: ElementRef;

    tags: Tag[];
    tagsEditMode: boolean = false;
    filteredTags: Tag[];
    task: Task;
    taskForm: FormGroup;
    freelance: Task[];
    project:any
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _freelanceListComponent: freelanceListComponent,
        private _freelanceService: freelanceService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef
    )
    {
        this._router.routeReuseStrategy.shouldReuseRoute=()=>false;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    
    /**
     * On init
     */
    ngOnInit(): void
    {
        // Open the drawer
        this._freelanceListComponent.matDrawer.open();

        // Create the task form
        this.taskForm = this._formBuilder.group({
            id       : [''],
            type     : [''],
            title    : [''],
            notes    : [''],
            completed: [false],
            dueDate  : [null],
            priority : [0],
            tags     : [[]],
            order    : [0]
        });

        
        this.project = JSON.parse(localStorage.getItem('task'))
        
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        // Listen for matDrawer opened change
        this._freelanceListComponent.matDrawer.openedChange
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(opened => opened)
            )
            .subscribe(() => {

                // Focus on the title element
                /* this._titleField.nativeElement.focus(); */
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Dispose the overlay
        if ( this._tagsPanelOverlayRef )
        {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._freelanceListComponent.matDrawer.close();
    }



    /**
     * Delete the task
     */
    deleteTask(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete task',
            message: 'Are you sure you want to delete this task? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {

                // Get the current task's id
                const id = this.task.id;

                // Get the next/previous task's id
                const currentTaskIndex = this.freelance.findIndex(item => item.id === id);
                const nextTaskIndex = currentTaskIndex + ((currentTaskIndex === (this.freelance.length - 1)) ? -1 : 1);
                const nextTaskId = (this.freelance.length === 1 && this.freelance[0].id === id) ? null : this.freelance[nextTaskIndex].id;

                // Delete the task
               /*  this._freelanceService.deleteTask(id)
                    .subscribe((isDeleted) => {

                        // Return if the task wasn't deleted...
                        if ( !isDeleted )
                        {
                            return;
                        }

                        // Navigate to the next task if available
                        if ( nextTaskId )
                        {
                            this._router.navigate(['../', nextTaskId], {relativeTo: this._activatedRoute});
                        }
                        // Otherwise, navigate to the parent
                        else
                        {
                            this._router.navigate(['../'], {relativeTo: this._activatedRoute});
                        }
                    }); */

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });
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
