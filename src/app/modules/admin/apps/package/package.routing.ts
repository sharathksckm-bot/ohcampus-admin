
import { Route } from '@angular/router';
import { PackagelistComponent } from './packagelist/packagelist.component';
import { AddpackageComponent } from './addpackage/addpackage.component';


export const packageRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'packagelist'
    },
    {
        path     : 'packagelist',
        component: PackagelistComponent,
    },
    {
        path     : 'addpackage',
        component: AddpackageComponent,
    },
    {
        path     : 'addpackage/update/:pkgId',
        component: AddpackageComponent,
    },
]