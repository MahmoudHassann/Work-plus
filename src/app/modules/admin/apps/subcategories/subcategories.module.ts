import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { subcategoriesComponent } from 'app/modules/admin/apps/subcategories/subcategories.component';
import { subcategoriesRoutes } from 'app/modules/admin/apps/subcategories/subcategories.routing';

@NgModule({
    declarations: [
        subcategoriesComponent
    ],
    imports     : [
        RouterModule.forChild(subcategoriesRoutes),
        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatTooltipModule,
        FuseCardModule,
        SharedModule
    ]
})
export class subcategoriesModule
{
}
