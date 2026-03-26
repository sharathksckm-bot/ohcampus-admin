import { RouterModule,Route } from '@angular/router';
import { CollegetypeComponent } from 'app/modules/admin/apps/college/collegetype/collegetype.component'
import { AddcollegetypeComponent } from './addcollegetype/addcollegetype.component';
import { AddcategoryComponent } from './addcategory/addcategory.component';
import { CategoryComponent } from './category/category.component';
import { FacilitiesComponent } from './facilities/facilities.component';
import { AddfacilitiesComponent } from './addfacilities/addfacilities.component';
import { RankcategoryComponent } from './rankcategory/rankcategory.component';
import { AddrankcategoryComponent } from './addrankcategory/addrankcategory.component';
import { CollegesComponent } from './colleges/colleges.component';
import { AddcollegesComponent } from './addcolleges/addcolleges.component';
import { EditcollegedetailsComponent } from './editcollegedetails/editcollegedetails.component';
import { ReviewlistComponent } from './reviewlist/reviewlist.component';
import { EditreviewComponent } from './editreview/editreview.component';
import { CourseofferedComponent } from './courseoffered/courseoffered.component';
import { SubcategoryComponent } from './viewcollegedetails/subcategory/subcategory.component';
import { AddsubcategoryComponent } from './viewcollegedetails/addsubcategory/addsubcategory.component';
import { HostelComponent } from './hostel/hostel.component';
import { AddhostelComponent } from './addhostel/addhostel.component';

export const collegeRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'college'
    },

    {
        path     : 'collegetype',
        component: CollegetypeComponent,
    },
    {
        path     : 'addcollegetype',
        component: AddcollegetypeComponent,
    },
    {
        path     : 'addcollegetype/update/:typeId',
        component: AddcollegetypeComponent,
    },
    {
        path     : 'category',
        component: CategoryComponent,
    },
    {
        path     : 'addcategory',
        component: AddcategoryComponent,
    },
    {
        path     : 'addcategory/update/:catId',
        component: AddcategoryComponent,
    },
    {
        path     : 'facilities',
        component: FacilitiesComponent,
    },
    {
        path     : 'addfacilities',
        component: AddfacilitiesComponent,
    },
    {
        path     : 'addfacilities/update/:faciId',
        component: AddfacilitiesComponent,
    },
    {
        path     : 'rankcategory',
        component: RankcategoryComponent,
    },
    {
        path     : 'addrankcategory',
        component: AddrankcategoryComponent,
    },
    {
        path     : 'addrankcategory/update/:rankId',
        component: AddrankcategoryComponent,
    },
    {
        path     : 'colleges',
        component: CollegesComponent,
    },
    {
        path     : 'addcolleges',
        component: AddcollegesComponent,
    },
    {
        path     : 'editcollegedetails/update/:clgId',
        component: EditcollegedetailsComponent,
    },
    {
        path     : 'reviewlist',
        component: ReviewlistComponent,
    },
    {
        path     : 'editreview/update/:reviewId',
        component: EditreviewComponent,
    },
    {
        path     : 'courseoffered',
        component: CourseofferedComponent,
    },
    {
        path     : 'subcategory',
        component: SubcategoryComponent,
    },
    {
        path     : 'addsubcategory',
        component: AddsubcategoryComponent,
    },

    {
        path     : 'addsubcategory/update/:catId',
        component: AddsubcategoryComponent,
    },{
        path     : 'hostel',
        component: HostelComponent,
    },
    {
        path     : 'addhostel',
        component: AddhostelComponent,
    },
    {
        path     : 'addhostel/update/:hostelId',
        component: AddhostelComponent
    }

]
