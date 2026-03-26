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
import { userRoutes } from 'app/modules/admin/apps/user/user.routing'
import { AlluserComponent } from './alluser/alluser.component';
import { AddnewuserComponent } from './addnewuser/addnewuser.component';
import { MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { UsertypeComponent } from './usertype/usertype.component';
import { UserstatusComponent } from './userstatus/userstatus.component';
import { AddnewstatusComponent } from './addnewstatus/addnewstatus.component';
import { AddnewusertypeComponent } from './addnewusertype/addnewusertype.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
    declarations: [
        AlluserComponent,
        AddnewuserComponent,
        UsertypeComponent,
        UserstatusComponent,
        AddnewstatusComponent,
        AddnewusertypeComponent,
    ],
    imports     : [
        RouterModule.forChild(userRoutes),
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
        NgxPaginationModule
    ]
})
export class UserModule
{
}
