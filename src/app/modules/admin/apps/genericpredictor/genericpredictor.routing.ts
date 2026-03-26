import { Route } from '@angular/router';
import { GenericpredictorlistComponent } from './genericpredictorlist/genericpredictorlist.component';
import { AddgenericcutoffComponent } from './addgenericcutoff/addgenericcutoff.component';

export const genericpredictorRoutes: Route[] = [
    {
        path: 'genericpredictorlist',
        component: GenericpredictorlistComponent,
    },
    {
        path: 'addgenericcutoff',
        component: AddgenericcutoffComponent,
    },
    {
        path: 'addgenericcutoff/update/:cutoff_id',
        component: AddgenericcutoffComponent,
    },
];
