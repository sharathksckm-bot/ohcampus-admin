import { Route } from '@angular/router';
import { AddnewuserComponent } from 'app/modules/admin/apps/user/addnewuser/addnewuser.component';
import { AlluserComponent } from 'app/modules/admin/apps/user/alluser/alluser.component';
import { UserstatusComponent } from './userstatus/userstatus.component';
import { AddnewstatusComponent } from './addnewstatus/addnewstatus.component';
import { AddnewusertypeComponent } from './addnewusertype/addnewusertype.component';
import { UsertypeComponent } from './usertype/usertype.component';

export const userRoutes: Route[] = [
    {
        path     : 'alluser',
        component: AlluserComponent,
    },
    {
        path     : 'addnewuser',
        component: AddnewuserComponent,
    },
    {
        path     : 'usertype',
        component: UsertypeComponent,
    },
    {
        path     : 'addnewusertype',
        component: AddnewusertypeComponent,
    },
    {
        path     : 'userstatus',
        component: UserstatusComponent,
    },
    {
        path     : 'addnewuserstatus',
        component: AddnewstatusComponent,
    },
    {
        path     : 'addnewuser/update/:userId',
        component: AddnewuserComponent,
    },
    {
        path     : 'addnewusertype/update/:typeId',
        component: AddnewusertypeComponent,
    }, 
    {
        path     : 'addnewuserstatus/update/:statusId',
        component: AddnewstatusComponent,
    }
];
