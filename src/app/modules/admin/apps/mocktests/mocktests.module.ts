import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from 'app/shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';
import { TestListComponent } from './testlist/testlist.component';
import { ResultsComponent } from './results/results.component';
import { QuestionsComponent } from './questions/questions.component';
import { AiGeneratorComponent } from './ai-generator/ai-generator.component';

const routes: Routes = [
    { path: '', redirectTo: 'testlist', pathMatch: 'full' },
    { path: 'testlist', component: TestListComponent },
    { path: 'results', component: ResultsComponent },
    { path: 'questions', component: QuestionsComponent },
    { path: 'questions/:testId', component: QuestionsComponent },
    { path: 'ai-generator', component: AiGeneratorComponent },
];

@NgModule({
    declarations: [
        TestListComponent,
        ResultsComponent,
        QuestionsComponent,
        AiGeneratorComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        MatDialogModule,
        MatCardModule,
        MatSliderModule,
        MatExpansionModule,
        MatSnackBarModule,
        SharedModule,
        MarkdownModule
    ]
})
export class MockTestsModule { }
