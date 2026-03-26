import { Route } from '@angular/router';
import { ViewcourseComponent } from './viewcourse/viewcourse.component';
import { AddcourseComponent } from './addcourse/addcourse.component';


export const courseRoutes: Route[] = [
    // {
    //     path      : '',
    //     pathMatch : 'full',
    //     redirectTo: 'viewcourse'
    // },
    {
        path     : 'viewcourse',
        component: ViewcourseComponent,
    },
    {
        path     : 'addcourse',
        component: AddcourseComponent,
    },
    {
        path     : 'addcourse/update/:courseId',
        component: AddcourseComponent,
    },
]