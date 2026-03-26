import { Route } from '@angular/router';
import { FaqslistComponent } from './faqslist/faqslist.component';
import { AddfaqsComponent } from './addfaqs/addfaqs.component';
import { FaqscategoryComponent } from './faqscategory/faqscategory.component';
import { AddcategoryComponent } from './addcategory/addcategory.component';



export const faqsRoutes: Route[] = [
   
    {
        path     : 'faqslist',
        component: FaqslistComponent,
    },
    {
        path     : 'addfaqs',
        component: AddfaqsComponent,
    },
    {
        path     : 'addfaqs/update/:faqsId',
        component: AddfaqsComponent,
    },
    {
        path     : 'faqscategory',
        component: FaqscategoryComponent,
    },
    {
        path     : 'addcategory',
        component: AddcategoryComponent,
    },
    {
        path     : 'addcategory/update/:catId',
        component: AddcategoryComponent,
    },
]