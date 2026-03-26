import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackagelistComponent } from './packagelist/packagelist.component';
import { AddpackageComponent } from './addpackage/addpackage.component';
import { Route } from '@angular/router';
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
import { RouterModule } from '@angular/router';
import { packageRoutes } from './package.routing';
 import { NgxPaginationModule } from 'ngx-pagination';
export const routes: Route[] = [
  {
      path     : '',
      component: PackagelistComponent
  }
];


@NgModule({
  declarations: [
    PackagelistComponent,
    AddpackageComponent
  ],
  imports: [
    RouterModule.forChild(packageRoutes),
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
    CommonModule,
     NgxPaginationModule
  ]
})
export class PackageModule { }
