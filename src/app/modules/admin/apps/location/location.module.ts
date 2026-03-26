import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { Route } from '@angular/router';
import { CountryComponent } from './country/country.component';
import { AddcountryComponent } from './addcountry/addcountry.component';
import { locationRoutes } from './location.routing';
import { StateComponent } from './state/state.component';
import { AddstateComponent } from './addstate/addstate.component';
import { CityComponent } from './city/city.component';
import { AddcityComponent } from './addcity/addcity.component';

// export const routes: Route[] = [
//   {
//       path     : '',
//       component: LocationComponent
//   }
// ];



@NgModule({
  declarations: [
    CountryComponent,
    AddcountryComponent,
    StateComponent,
    AddstateComponent,
    CityComponent,
    AddcityComponent
  ],
  imports: [
    RouterModule.forChild(locationRoutes),
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressBarModule,
    MatRippleModule,
    MatSortModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatRadioModule
]
})
export class LocationModule { }
