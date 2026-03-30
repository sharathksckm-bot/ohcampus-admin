import { Route } from '@angular/router';
import { MetaDescriptionComponent } from './metadescription/meta-description.component';

export const seotoolsRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'metadescription',
        pathMatch: 'full'
    },
    {
        path: 'metadescription',
        component: MetaDescriptionComponent
    }
];
