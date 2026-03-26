import { Route } from '@angular/router';
import { ManagementSeatListComponent } from './list/list.component';

export const managementseatRoutes: Route[] = [
    {
        path: 'list',
        component: ManagementSeatListComponent,
    },
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    }
];
