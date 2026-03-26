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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { MatTableModule} from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { Route } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UseractivityComponent } from './useractivity/useractivity.component';
import { TeamreportComponent } from './teamreport/teamreport.component';
import { CollegereportComponent } from './collegereport/collegereport.component';
import { TextMaskModule } from 'angular2-text-mask';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { reportRoutes } from './reports.routing';
import { UseractivitydataComponent } from './useractivitydata/useractivitydata.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';


@NgModule({
  declarations: [
    UseractivityComponent,
    TeamreportComponent,
    CollegereportComponent,
    UseractivitydataComponent
  ],
  imports: [
    RouterModule.forChild(reportRoutes),
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
        AngularEditorModule,
        TextMaskModule,
        NgxMatSelectSearchModule,
        MatDatepickerModule,
        MatMomentDateModule,
    CommonModule
  ]
})
export class ReportsModule { }
