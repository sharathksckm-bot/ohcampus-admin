import { Route } from '@angular/router';
import { CountryComponent } from './country/country.component';
import { AddcountryComponent } from './addcountry/addcountry.component';
import { StateComponent } from './state/state.component';
import { AddstateComponent } from './addstate/addstate.component';
import { CityComponent } from './city/city.component';
import { AddcityComponent } from './addcity/addcity.component';

export const locationRoutes: Route[] = [
    {
        path     : 'country',
        component: CountryComponent,
    },
    {
        path     : 'addcountry',
        component: AddcountryComponent,
    },
    {
        path     : 'addcountry/update/:countryId',
        component: AddcountryComponent,
    },
    {
        path     : 'state',
        component: StateComponent,
    },
    {
        path     : 'addstate',
        component: AddstateComponent,
    },
    {
        path     : 'addstate/update/:stateId',
        component: AddstateComponent,
    },
    {
        path     : 'city',
        component: CityComponent,
    },
    {
        path     : 'addcity',
        component: AddcityComponent,
    },
    {
        path     : 'addcity/update/:cityId',
        component: AddcityComponent,
    },
]