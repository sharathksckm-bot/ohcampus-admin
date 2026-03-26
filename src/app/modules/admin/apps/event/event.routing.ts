import { Route } from '@angular/router';
import { EventcategoryComponent } from './eventcategory/eventcategory.component';
import { VieweventsComponent } from './viewevents/viewevents.component';
import { AddeventComponent } from './addevent/addevent.component';
import { AddeventcategoryComponent } from './addeventcategory/addeventcategory.component';

export const eventRoutes: Route[] = [

    {
        path     : 'viewevents',
        component: VieweventsComponent,
    },
    {
        path     : 'addevent',
        component: AddeventComponent,
    },
    {
        path     : 'addevent/update/:eventId',
        component: AddeventComponent,
    },

    {
        path     : 'eventcategory',
        component: EventcategoryComponent,
    },
    {
        path     : 'addeventcategory',
        component: AddeventcategoryComponent,
    },
    {
        path     : 'addeventcategory/update/:catId',
        component: AddeventcategoryComponent,
    },


]
