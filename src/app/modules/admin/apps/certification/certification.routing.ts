import { Route } from '@angular/router';
import { CertificationlistComponent } from './certificationlist/certificationlist.component';
import { AddcertificationComponent } from './addcertification/addcertification.component';

export const certificationRoutes: Route[] = [

    {
        path     : 'certificationlist',
        component: CertificationlistComponent,
    },
    {
        path     : 'addcertification',
        component: AddcertificationComponent,
    },
    {
        path     : 'addcertification/update/:id',
        component: AddcertificationComponent,
    },




]
