import { Route } from '@angular/router';
import { CallbacklistComponent } from './callbacklist/callbacklist.component';
import { LeadAnalyticsComponent } from './analytics/lead-analytics.component';

export const leadcaptureRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'analytics',
        pathMatch: 'full'
    },
    {
        path: 'analytics',
        component: LeadAnalyticsComponent
    },
    {
        path: 'callbacklist',
        component: CallbacklistComponent
    }
];
