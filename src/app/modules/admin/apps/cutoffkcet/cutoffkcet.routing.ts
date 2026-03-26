
import { Route } from '@angular/router';
import { KcetcutofflistComponent } from './kcetcutofflist/kcetcutofflist.component';
import { AddkcetcutoffComponent } from './addkcetcutoff/addkcetcutoff.component';

export const cutoffkcetRouted: Route[] = [

    {
        path     : 'kcetcutofflist',
        component: KcetcutofflistComponent,
    },
    {
        path     : 'addkcetcutoff',
        component: AddkcetcutoffComponent,
    },
    {
        path: 'addkcetcutoff/update/:cutoff_id',
        component: AddkcetcutoffComponent,
    },
]
