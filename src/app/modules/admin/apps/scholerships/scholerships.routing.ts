
import { Route } from '@angular/router';
import { ScholershiplistComponent } from './scholershiplist/scholershiplist.component';
import { AddscholershipComponent } from './addscholership/addscholership.component';


export const scholershipRoutes: Route[] = [
    {
        path     : 'scholershiplist',
        component: ScholershiplistComponent,
    },
    {
        path     : 'addscholership',
        component: AddscholershipComponent,
    },
    {
        path     : 'addscholership/update/:scholarId',
        component: AddscholershipComponent,
    },
]