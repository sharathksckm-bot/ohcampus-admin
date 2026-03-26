import { Route } from '@angular/router';
import { NeetpredictorlistComponent } from './neetpredictorlist/neetpredictorlist.component';
import { AddneetcutoffComponent } from './addneetcutoff/addneetcutoff.component';
import { PremiumdataComponent } from './premiumdata/premiumdata.component';
import { StrayVacancyComponent } from './strayVacancy/strayVacancy.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { PlansComponent } from './plans/plans.component';
import { NewsSourcesComponent } from './newsSources/newsSources.component';

export const neetpredictorRoutes: Route[] = [
    {
        path: 'neetpredictorlist',
        component: NeetpredictorlistComponent,
    },
    {
        path: 'addneetcutoff',
        component: AddneetcutoffComponent,
    },
    {
        path: 'addneetcutoff/update/:cutoff_id',
        component: AddneetcutoffComponent,
    },
    {
        path: 'premiumdata',
        component: PremiumdataComponent,
    },
    {
        path: 'strayVacancy',
        component: StrayVacancyComponent,
    },
    {
        path: 'subscriptions',
        component: SubscriptionsComponent,
    },
    {
        path: 'plans',
        component: PlansComponent,
    },
    {
        path: 'newsSources',
        component: NewsSourcesComponent,
    },
];
