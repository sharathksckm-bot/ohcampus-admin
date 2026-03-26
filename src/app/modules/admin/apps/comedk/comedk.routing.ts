import { Route } from '@angular/router';
import { ComedklistComponent } from './comedklist/comedklist.component';
import { AddcomedkComponent } from './addcomedk/addcomedk.component';
export const comedkRouted: Route[] = [

    {
        path     : 'comedklist',
        component: ComedklistComponent,
    },
    {
        path     : 'addcomedk',
        component: AddcomedkComponent,
    },
    {
        path     : 'addcomedk/update/:comedk_id',
        component: AddcomedkComponent,
    },
]
