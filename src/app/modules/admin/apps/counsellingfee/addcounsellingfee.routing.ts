import { Route } from '@angular/router';
import { AddcounsellingfeeComponent } from './addcounsellingfee/addcounsellingfee.component';
import { CounsellingfeelistComponent } from './counsellingfeelist/counsellingfeelist.component';


export const counsellingfeeRoutes: Route[] = [
    {
        path     : 'counsellingfeelist',
        component: CounsellingfeelistComponent,
    },
    {
        path     : 'addcounsellingfee',
        component: AddcounsellingfeeComponent,
    },
    {
        path     : 'addcounsellingfee/update/:feeId',
        component: AddcounsellingfeeComponent,
    },
]


