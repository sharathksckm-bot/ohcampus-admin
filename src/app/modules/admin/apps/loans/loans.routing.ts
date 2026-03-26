
import { Route } from '@angular/router';
import { LoanlistComponent } from './loanlist/loanlist.component';
import { AddloanComponent } from './addloan/addloan.component';


export const loansRoutes: Route[] = [

    {
        path     : 'loanlist',
        component: LoanlistComponent,
    },
    {
        path     : 'addloan',
        component: AddloanComponent,
    },
    {
        path     : 'addloan/update/:loanId',
        component: AddloanComponent,
    },
]
