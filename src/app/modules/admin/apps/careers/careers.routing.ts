import { Route } from '@angular/router';
import { CareerlistComponent } from './careerlist/careerlist.component';
import { AddcareerComponent } from './addcareer/addcareer.component';
import { CareerscategoryComponent } from './careerscategory/careerscategory.component';
import { AddcarcategoryComponent } from './addcarcategory/addcarcategory.component';

export const careerRoutes: Route[] = [
   
    {
        path     : 'careerlist',
        component: CareerlistComponent,
    },
    {
        path     : 'addcareer',
        component: AddcareerComponent,
    },
    {
        path     : 'addcareer/update/:careerId',
        component: AddcareerComponent,
    },
    {
        path     : 'careerscategory',
        component: CareerscategoryComponent,
    },
    {
        path     : 'addcarcategory',
        component: AddcarcategoryComponent,
    },
    {
        path     : 'addcarcategory/update/:catId',
        component: AddcarcategoryComponent,
    },
]