import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CareerlistComponent } from './careerlist/careerlist.component';
import { AddcareerComponent } from './addcareer/addcareer.component';
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
import { careerRoutes } from './careers.routing';
import { AddcarcategoryComponent } from './addcarcategory/addcarcategory.component';
import { CareerscategoryComponent } from './careerscategory/careerscategory.component';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [
    CareerlistComponent,
    AddcareerComponent,
    AddcarcategoryComponent,
    CareerscategoryComponent
  ],
  imports: [
    RouterModule.forChild(careerRoutes),
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
    CommonModule
  ]
})
export class CareersModule { }
