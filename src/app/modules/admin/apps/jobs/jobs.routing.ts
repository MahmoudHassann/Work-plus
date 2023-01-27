import { Route } from '@angular/router';
import { jobsComponent } from 'app/modules/admin/apps/jobs/jobs.component';

export const jobsRoutes: Route[] = [
    {
        path     : '',
        component: jobsComponent
    }
];
