import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { neetpredictorRoutes } from './neetpredictor.routing';
import { NeetpredictorlistComponent } from './neetpredictorlist/neetpredictorlist.component';
import { AddneetcutoffComponent } from './addneetcutoff/addneetcutoff.component';
import { PremiumdataComponent } from './premiumdata/premiumdata.component';
import { StrayVacancyComponent } from './strayVacancy/strayVacancy.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { PlansComponent } from './plans/plans.component';
import { NewsSourcesComponent } from './newsSources/newsSources.component';

@NgModule({
    declarations: [
        NeetpredictorlistComponent,
        AddneetcutoffComponent,
        PremiumdataComponent,
        StrayVacancyComponent,
        SubscriptionsComponent,
        PlansComponent,
        NewsSourcesComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(neetpredictorRoutes),
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTableModule,
        MatPaginatorModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule
    ]
})
export class NeetpredictorModule { }
