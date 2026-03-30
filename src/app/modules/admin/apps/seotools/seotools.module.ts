import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetaDescriptionComponent } from './metadescription/meta-description.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { seotoolsRoutes } from './seotools.routing';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MetaDescriptionComponent
  ],
  imports: [
    RouterModule.forChild(seotoolsRoutes),
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    MatCardModule,
    MatChipsModule,
    SharedModule,
    CommonModule,
    FormsModule
  ]
})
export class SeotoolsModule { }
