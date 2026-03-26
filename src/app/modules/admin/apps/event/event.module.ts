
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { EventcategoryComponent } from './eventcategory/eventcategory.component';
import { eventRoutes } from './event.routing';
import { AddeventComponent } from './addevent/addevent.component';
import { VieweventsComponent } from './viewevents/viewevents.component';
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
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AddeventcategoryComponent } from './addeventcategory/addeventcategory.component';
import { EventdetailsComponent } from './common/eventdetails/eventdetails.component';
import { EventimagesComponent } from './common/eventimages/eventimages.component';
import { CommoneventcategoryComponent } from './common/commoneventcategory/commoneventcategory.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
  declarations: [
    EventcategoryComponent,
    AddeventComponent,
    VieweventsComponent,
    AddeventcategoryComponent,
    EventdetailsComponent,
    EventimagesComponent,
    CommoneventcategoryComponent
  ],
  imports: [
    RouterModule.forChild(eventRoutes),
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
    MatRadioModule,
    MatDatepickerModule,
    MatMomentDateModule,
    AngularEditorModule,
    MatAutocompleteModule,
    NgxMatSelectSearchModule,
    CommonModule
  ]
})
export class EventModule { }
