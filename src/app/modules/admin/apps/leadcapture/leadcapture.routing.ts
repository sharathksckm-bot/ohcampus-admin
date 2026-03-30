import { Route } from '@angular/router';
import { CallbacklistComponent } from './callbacklist/callbacklist.component';

export const leadcaptureRoutes: Route[] = [
    {
        path: 'callbacklist',
        component: CallbacklistComponent
    }
];
