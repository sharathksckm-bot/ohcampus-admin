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
import { CollegetypeComponent } from './collegetype/collegetype.component';
import { AddcollegetypeComponent } from './addcollegetype/addcollegetype.component';
import { collegeRoutes } from './college.routing';
import { CategoryComponent } from './category/category.component';
import { AddcategoryComponent } from './addcategory/addcategory.component';
import { FacilitiesComponent } from './facilities/facilities.component';
import { AddfacilitiesComponent } from './addfacilities/addfacilities.component';
import { RankcategoryComponent } from './rankcategory/rankcategory.component';
import { AddrankcategoryComponent } from './addrankcategory/addrankcategory.component';
import { CollegesComponent } from './colleges/colleges.component';
import { AddcollegesComponent } from './addcolleges/addcolleges.component';
import { DetailsComponent } from './viewcollegedetails/details/details.component';
import { ImagesComponent } from './viewcollegedetails/images/images.component';
import { CoarsesComponent } from './viewcollegedetails/coarses/coarses.component';
import { EditcollegedetailsComponent } from './editcollegedetails/editcollegedetails.component';
import { CategoryyComponent } from './viewcollegedetails/categoryy/categoryy.component';
import { EbrouchuresComponent } from './viewcollegedetails/ebrouchures/ebrouchures.component';
import { FacilitiessComponent } from './viewcollegedetails/facilitiess/facilitiess.component';
import { FeestructureComponent } from './viewcollegedetails/feestructure/feestructure.component';
import { HighlightsComponent } from './viewcollegedetails/highlights/highlights.component';
import { PlacementstatisticsComponent } from './viewcollegedetails/placementstatistics/placementstatistics.component';
import { RanksComponent } from './viewcollegedetails/ranks/ranks.component';
import { ScholarshipssComponent } from './viewcollegedetails/scholarshipss/scholarshipss.component';
import { ReviewlistComponent } from './reviewlist/reviewlist.component';
import { EditreviewComponent } from './editreview/editreview.component';
import { CourseofferedComponent } from './courseoffered/courseoffered.component';
import { TableofcontentComponent } from './viewcollegedetails/tableofcontent/tableofcontent.component';
import { TextMaskModule } from 'angular2-text-mask';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { FaqsComponent } from './viewcollegedetails/faqs/faqs.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CutoffComponent } from './viewcollegedetails/cutoff/cutoff.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { EntranceexamsComponent } from './viewcollegedetails/entranceexams/entranceexams.component';
import { SubcategoryComponent } from './viewcollegedetails/subcategory/subcategory.component';
import { AddsubcategoryComponent } from './viewcollegedetails/addsubcategory/addsubcategory.component';
import { CommonModule } from '@angular/common';
import { HostelComponent } from './hostel/hostel.component';
import { AddhostelComponent } from './addhostel/addhostel.component';




@NgModule({
  declarations: [
    CollegetypeComponent,
    AddcollegetypeComponent,
    CategoryComponent,
    AddcategoryComponent,
    FacilitiesComponent,
    AddfacilitiesComponent,
    RankcategoryComponent,
    AddrankcategoryComponent,
    CollegesComponent,
    AddcollegesComponent,
    DetailsComponent,
    ImagesComponent,
    CoarsesComponent,
    EditcollegedetailsComponent,
    CategoryyComponent,
    EbrouchuresComponent,
    FacilitiessComponent,
    FeestructureComponent,
    HighlightsComponent,
    PlacementstatisticsComponent,
    RanksComponent,
    ScholarshipssComponent,
    ReviewlistComponent,
    EditreviewComponent,
    CourseofferedComponent,
    TableofcontentComponent,
    FaqsComponent,
    CutoffComponent,
    EntranceexamsComponent,
    SubcategoryComponent,
    AddsubcategoryComponent,
    HostelComponent,
    AddhostelComponent
  ],

  imports: [
    RouterModule.forChild(collegeRoutes),
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
        MatExpansionModule,
        CommonModule
   ],

})
export class CollegeModule { }
