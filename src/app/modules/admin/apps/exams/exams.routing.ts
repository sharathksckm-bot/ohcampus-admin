import { Route } from '@angular/router';
import { ExamlistComponent } from './examlist/examlist.component';
import { AddexamComponent } from './addexam/addexam.component';
import { ExamcatergoryComponent } from './examcatergory/examcatergory.component';
import { AddexamcatergoryComponent } from './addexamcatergory/addexamcatergory.component';

export const examRoutes: Route[] = [
   
    {
        path     : 'examlist',
        component: ExamlistComponent,
    },
    {
        path     : 'addexam',
        component: AddexamComponent,
    },
    {
        path     : 'addexam/update/:examId',
        component: AddexamComponent,
    },
    {
        path     : 'examscategory',
        component: ExamcatergoryComponent,
    },
    {
        path     : 'addexamcategory',
        component: AddexamcatergoryComponent,
    },
    {
        path     : 'addexamcategory/update/:catId',
        component: AddexamcatergoryComponent,
    },
    
]