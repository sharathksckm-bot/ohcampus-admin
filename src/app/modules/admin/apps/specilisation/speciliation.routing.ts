import { Route } from '@angular/router';
import { SpecilisationlistComponent } from './specilisationlist/specilisationlist.component';
import { AddspecilisationComponent } from './addspecilisation/addspecilisation.component';
export const specilisationRoutes: Route[] = [

    {
        path     : 'specilisationlist',
        component: SpecilisationlistComponent,
    },
    {
        path     : 'addspecilisation',
        component: AddspecilisationComponent,
    },
    {
        path     : 'addspecilisation/update/:speId',
        component: AddspecilisationComponent,
    },


]