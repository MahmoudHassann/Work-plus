import { Route } from '@angular/router';
import { categoriesComponent } from 'app/modules/admin/apps/categories/categories.component';

export const categoriesRoutes: Route[] = [
    {
        path     : '',
        component: categoriesComponent
    }
];
