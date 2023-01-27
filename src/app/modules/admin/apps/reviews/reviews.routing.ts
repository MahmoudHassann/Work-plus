import { Route } from '@angular/router';
import { reviewsComponent } from 'app/modules/admin/apps/reviews/reviews.component';

export const reviewsRoutes: Route[] = [
    {
        path     : '',
        component: reviewsComponent
    }
];
