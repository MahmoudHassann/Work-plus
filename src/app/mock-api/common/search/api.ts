import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseNavigationItem, FuseNavigationService } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { defaultNavigation } from 'app/mock-api/common/navigation/data';

import { freelance } from 'app/mock-api/apps/freelance/data';

@Injectable({
    providedIn: 'root'
})
export class SearchMockApi
{
    private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;
    
    private readonly _freelance: any[] = freelance;

    /**
     * Constructor
     */
    constructor(
        private _fuseMockApiService: FuseMockApiService,
        private _fuseNavigationService: FuseNavigationService
    )
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
        // Get the flat navigation and store it
        const flatNavigation = this._fuseNavigationService.getFlatNavigation(this._defaultNavigation);

        // -----------------------------------------------------------------------------------------------------
        // @ Search results - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/common/search')
            .reply(({request}) => {

                // Get the search query
                const query = cloneDeep(request.body.query.toLowerCase());

                // If the search query is an empty string,
                // return an empty array
                if ( query === '' )
                {
                    return [200, {results: []}];
                }

               
                // Filter the navigation
                const pagesResults = cloneDeep(flatNavigation)
                    .filter(page => (page.title?.toLowerCase().includes(query) || (page.subtitle && page.subtitle.includes(query))));

                // Filter the freelance
                const freelanceResults = cloneDeep(this._freelance)
                    .filter(task => task.title.toLowerCase().includes(query));

                // Prepare the results array
                const results = [];

                

                // If there are page results...
                if ( pagesResults.length > 0 )
                {
                    // Normalize the results
                    pagesResults.forEach((result: any) => {

                    });

                    // Add to the results
                    results.push({
                        id     : 'pages',
                        label  : 'Pages',
                        results: pagesResults
                    });
                }

                // If there are freelance results...
                if ( freelanceResults.length > 0 )
                {
                    // Normalize the results
                    freelanceResults.forEach((result) => {

                        // Add a link
                        result.link = '/apps/freelance/' + result.id;
                    });

                    // Add to the results
                    results.push({
                        id     : 'freelance',
                        label  : 'freelance',
                        results: freelanceResults
                    });
                }

                // Return the response
                return [200, results];
            });
    }
}
