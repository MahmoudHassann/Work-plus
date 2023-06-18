import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiUtils } from '@fuse/lib/mock-api/mock-api.utils';
import { FuseMockApiService } from '@fuse/lib/mock-api/mock-api.service';
import { tags as tagsData, freelance as freelanceData } from 'app/mock-api/apps/freelance/data';

@Injectable({
    providedIn: 'root'
})
export class freelanceMockApi
{
    private _tags: any[] = tagsData;
    private _freelance: any[] = freelanceData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ Tags - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/freelance/tags')
            .reply(() => [
                200,
                cloneDeep(this._tags)
            ]);

        // -----------------------------------------------------------------------------------------------------
        // @ Tags - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/freelance/tag')
            .reply(({request}) => {

                // Get the tag
                const newTag = cloneDeep(request.body.tag);

                // Generate a new GUID
                newTag.id = FuseMockApiUtils.guid();

                // Unshift the new tag
                this._tags.unshift(newTag);

                return [
                    200,
                    newTag
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Tags - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/freelance/tag')
            .reply(({request}) => {

                // Get the id and tag
                const id = request.body.id;
                const tag = cloneDeep(request.body.tag);

                // Prepare the updated tag
                let updatedTag = null;

                // Find the tag and update it
                this._tags.forEach((item, index, tags) => {

                    if ( item.id === id )
                    {
                        // Update the tag
                        tags[index] = assign({}, tags[index], tag);

                        // Store the updated tag
                        updatedTag = tags[index];
                    }
                });

                return [
                    200,
                    updatedTag
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Tag - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/freelance/tag')
            .reply(({request}) => {

                // Get the id
                const id = request.params.get('id');

                // Find the tag and delete it
                const index = this._tags.findIndex(item => item.id === id);
                this._tags.splice(index, 1);

                // Get the freelance that have the tag
                const freelanceWithTag = this._freelance.filter(task => task.tags.indexOf(id) > -1);

                // Iterate through them and remove the tag
                freelanceWithTag.forEach((task) => {
                    task.tags.splice(task.tags.indexOf(id), 1);
                });

                return [
                    200,
                    true
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ freelance - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/freelance/all')
            .reply(() => {

                // Clone the freelance
                const freelance = cloneDeep(this._freelance);

                // Sort the freelance by order
                freelance.sort((a, b) => a.order - b.order);

                return [
                    200,
                    freelance
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ freelance Search - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/freelance/search')
            .reply(({request}) => {

                // Get the search query
                const query = request.params.get('query');

                // Prepare the search results
                let results;

                // If the query exists...
                if ( query )
                {
                    // Clone the freelance
                    let freelance = cloneDeep(this._freelance);

                    // Filter the freelance
                    freelance = freelance.filter(task => task.title && task.title.toLowerCase().includes(query.toLowerCase()) || task.notes && task.notes.toLowerCase()
                                                                                                                                           .includes(query.toLowerCase()));

                    // Mark the found chars
                    freelance.forEach((task) => {
                        const re = new RegExp('(' + query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')', 'ig');
                        task.title = task.title.replace(re, '<mark>$1</mark>');
                    });

                    // Set them as the search result
                    results = freelance;
                }
                // Otherwise, set the results to null
                else
                {
                    results = null;
                }

                return [
                    200,
                    results
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ freelance Orders - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/freelance/order')
            .reply(({request}) => {

                // Get the freelance
                const freelance = request.body.freelance;

                // Go through the freelance
                this._freelance.forEach((task) => {

                    // Find this task's index within the freelance array that comes with the request
                    // and assign that index as the new order number for the task
                    task.order = freelance.findIndex((item: any) => item.id === task.id);
                });

                // Clone the freelance
                const updatedfreelance = cloneDeep(this._freelance);

                return [
                    200,
                    updatedfreelance
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Task - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/freelance/task')
            .reply(({request}) => {

                // Get the id from the params
                const id = request.params.get('id');

                // Clone the freelance
                const freelance = cloneDeep(this._freelance);

                // Find the task
                const task = freelance.find(item => item.id === id);

                return [
                    200,
                    task
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Task - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/freelance/task')
            .reply(({request}) => {

                // Generate a new task
                const newTask = {
                    id       : FuseMockApiUtils.guid(),
                    type     : request.body.type,
                    title    : '',
                    notes    : null,
                    completed: false,
                    dueDate  : null,
                    priority : 1,
                    tags     : [],
                    order    : 0
                };

                // Unshift the new task
                this._freelance.unshift(newTask);

                // Go through the freelance and update their order numbers
                this._freelance.forEach((task, index) => {
                    task.order = index;
                });

                return [
                    200,
                    newTask
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Task - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/freelance/task')
            .reply(({request}) => {

                // Get the id and task
                const id = request.body.id;
                const task = cloneDeep(request.body.task);

                // Prepare the updated task
                let updatedTask = null;

                // Find the task and update it
                this._freelance.forEach((item, index, freelance) => {

                    if ( item.id === id )
                    {
                        // Update the task
                        freelance[index] = assign({}, freelance[index], task);

                        // Store the updated task
                        updatedTask = freelance[index];
                    }
                });

                return [
                    200,
                    updatedTask
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Task - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/freelance/task')
            .reply(({request}) => {

                // Get the id
                const id = request.params.get('id');

                // Find the task and delete it
                const index = this._freelance.findIndex(item => item.id === id);
                this._freelance.splice(index, 1);

                return [
                    200,
                    true
                ];
            });
    }
}
