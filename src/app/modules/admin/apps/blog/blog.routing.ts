import { Route } from '@angular/router';
import { BlogcategoryComponent } from './blogcategory/blogcategory.component';
import { ViewblogsComponent } from './viewblogs/viewblogs.component';
import { AddblogComponent } from './addblog/addblog.component';
import { AddblogcategoryComponent } from './addblogcategory/addblogcategory.component';

export const blogRoutes: Route[] = [
   
    {
        path     : 'blogcategory',
        component: BlogcategoryComponent,
    },
    {
        path     : 'addblogcategory',
        component: AddblogcategoryComponent,
    },
    {
        path     : 'addblogcategory/update/:catId',
        component: AddblogcategoryComponent,
    },
    {
        path     : 'viewblogs',
        component: ViewblogsComponent,
    },
    {
        path     : 'addblog',
        component: AddblogComponent,
    },
    {
        path     : 'addblog/update/:blogId',
        component: AddblogComponent,
    },
   
   
]