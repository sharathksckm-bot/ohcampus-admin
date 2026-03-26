import { RouterModule,Route } from '@angular/router';
import { UseractivityComponent } from './useractivity/useractivity.component';
import { TeamreportComponent } from './teamreport/teamreport.component';
import { CollegereportComponent } from './collegereport/collegereport.component';
import { UseractivitydataComponent } from './useractivitydata/useractivitydata.component';
export const reportRoutes: Route[] = [
    {
        path     : 'useractivity',
        component: UseractivityComponent,
    },
    {
        path     : 'teamreport',
        component: TeamreportComponent,
    },
    {
        path     : 'collegereport',
        component: CollegereportComponent,
    },
    {
        path     : 'useractivitydata/list/:userId',
        component: UseractivitydataComponent,
    }

]