import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseeditComponent } from './courseedit/courseedit.component';
import { CoursehighlightComponent } from './common/coursehighlight/coursehighlight.component';
import { CourseeligibilityComponent } from './common/courseeligibility/courseeligibility.component';
import { EnteranceexamComponent } from './common/enteranceexam/enteranceexam.component';
import { CourseplacementComponent } from './common/courseplacement/courseplacement.component';
import { CoursebroucherComponent } from './common/coursebroucher/coursebroucher.component';
import { MatButtonModule } from '@angular/material/button';
import { Route, RouterModule } from '@angular/router';
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
import { AngularEditorModule } from '@kolkov/angular-editor';
import { editcourseRoutes } from './editcourse.routing';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';



@NgModule({
  declarations: [
    CourseeditComponent,
    CoursehighlightComponent,
    CourseeligibilityComponent,
    EnteranceexamComponent,
    CourseplacementComponent,
    CoursebroucherComponent
  ],
  imports: [
    RouterModule.forChild(editcourseRoutes),
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
    NgxMatSelectSearchModule,
    CommonModule
  ]
})
export class EditcourseModule { }
