import { Route } from '@angular/router';
import { SeatlistComponent } from './seatlist/seatlist.component';
import { AddseatComponent } from './addseat/addseat.component';

export const seatavailabilityRoutes: Route[] = [
    {
        path: 'seatlist',
        component: SeatlistComponent,
    },
    {
        path: 'addseat',
        component: AddseatComponent,
    },
    {
        path: 'addseat/update/:seat_id',
        component: AddseatComponent,
    },
];
