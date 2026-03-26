import { Route } from '@angular/router';
import { CourseeditComponent } from './courseedit/courseedit.component';
export const editcourseRoutes: Route[] = [
    {
        path     : 'viewcourse',
        component: CourseeditComponent,
    },
    {
        path     : 'viewcourse/:courseId/:clgId',
        component: CourseeditComponent,
    },
]