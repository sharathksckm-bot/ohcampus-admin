import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-addtest',
    template: `
        <div class="flex flex-col flex-auto">
            <div class="flex flex-wrap items-center p-6 sm:p-8 w-full">
                <div class="flex flex-auto">
                    <h2 class="text-2xl font-semibold">Create New Test</h2>
                </div>
            </div>
            <div class="p-6 sm:p-8 pt-0">
                <div class="bg-card shadow rounded-2xl p-6">
                    <form class="flex flex-col gap-4">
                        <mat-form-field>
                            <mat-label>Test Name</mat-label>
                            <input matInput placeholder="Enter test name">
                        </mat-form-field>
                        <mat-form-field>
                            <mat-label>Exam Type</mat-label>
                            <mat-select>
                                <mat-option value="NEET">NEET</mat-option>
                                <mat-option value="KCET">KCET</mat-option>
                                <mat-option value="COMEDK">COMEDK</mat-option>
                                <mat-option value="JEE">JEE</mat-option>
                            </mat-select>
                        </mat-form-field>
                        <mat-form-field>
                            <mat-label>Duration (minutes)</mat-label>
                            <input matInput type="number" placeholder="180">
                        </mat-form-field>
                        <mat-form-field>
                            <mat-label>Total Questions</mat-label>
                            <input matInput type="number" placeholder="180">
                        </mat-form-field>
                        <div class="flex gap-4 mt-4">
                            <button mat-raised-button color="primary">Create Test</button>
                            <button mat-stroked-button routerLink="/apps/mocktests/testlist">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
})
export class AddTestComponent implements OnInit {
    ngOnInit() {}
}
