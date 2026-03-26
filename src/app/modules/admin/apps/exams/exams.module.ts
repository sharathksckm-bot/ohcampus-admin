import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamlistComponent } from './examlist/examlist.component';
import { AddexamComponent } from './addexam/addexam.component';
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
import { RouterModule } from '@angular/router';
import { examRoutes } from './exams.routing';
import { ExamdetailsComponent } from './common/examdetails/examdetails.component';
import { ExamimagesComponent } from './common/examimages/examimages.component';
import { AddexamcatergoryComponent } from './addexamcatergory/addexamcatergory.component';
import { ExamcatergoryComponent } from './examcatergory/examcatergory.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ExamdocsComponent } from './common/examdocs/examdocs.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    ExamlistComponent,
    AddexamComponent,
    ExamdetailsComponent,
    ExamimagesComponent,
    AddexamcatergoryComponent,
    ExamcatergoryComponent,
    ExamdocsComponent
    
  ],
  imports: [
    RouterModule.forChild(examRoutes),
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
    MatDatepickerModule,
    MatMomentDateModule,
    NgxMatSelectSearchModule,
    CommonModule
  ]
})
export class ExamsModule { }
