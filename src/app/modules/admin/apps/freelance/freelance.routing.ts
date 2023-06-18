import { Route } from '@angular/router';
import { CanDeactivatefreelanceDetails } from 'app/modules/admin/apps/freelance/freelance.guards';
import { freelanceResolver, freelanceTagsResolver, freelanceTaskResolver } from 'app/modules/admin/apps/freelance/freelance.resolvers';
import { freelanceComponent } from 'app/modules/admin/apps/freelance/freelance.component';
import { freelanceListComponent } from 'app/modules/admin/apps/freelance/list/list.component';
import { freelanceDetailsComponent } from 'app/modules/admin/apps/freelance/details/details.component';

export const freelanceRoutes: Route[] = [
    {
        path     : '',
        component: freelanceComponent,
        /* resolve  : {
            tags: freelanceTagsResolver
        }, */
        children : [
            {
                path     : '',
                component: freelanceListComponent,
                /* resolve  : {
                    freelance: freelanceResolver
                }, */
                children : [
                    {
                        path         : ':id',
                        component    : freelanceDetailsComponent,
                        /* resolve      : {
                            task: freelanceTaskResolver
                        }, */
                        canDeactivate: [CanDeactivatefreelanceDetails]
                    }
                ]
            }
        ]
    }
];
