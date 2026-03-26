import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-addalert',
    template: `
        <div class="flex flex-col flex-auto">
            <div class="flex flex-wrap items-center p-6 sm:p-8 w-full">
                <div class="flex flex-auto">
                    <h2 class="text-2xl font-semibold">Create New Alert</h2>
                </div>
            </div>
            <div class="p-6 sm:p-8 pt-0">
                <div class="bg-card shadow rounded-2xl p-6">
                    <form class="flex flex-col gap-4">
                        <mat-form-field>
                            <mat-label>Alert Title</mat-label>
                            <input matInput placeholder="Enter alert title">
                        </mat-form-field>
                        <mat-form-field>
                            <mat-label>Alert Type</mat-label>
                            <mat-select>
                                <mat-option value="Info">Information</mat-option>
                                <mat-option value="Warning">Warning</mat-option>
                                <mat-option value="Important">Important</mat-option>
                            </mat-select>
                        </mat-form-field>
                        <mat-form-field>
                            <mat-label>Exam</mat-label>
                            <mat-select>
                                <mat-option value="NEET">NEET</mat-option>
                                <mat-option value="KCET">KCET</mat-option>
                                <mat-option value="COMEDK">COMEDK</mat-option>
                                <mat-option value="JEE">JEE</mat-option>
                            </mat-select>
                        </mat-form-field>
                        <mat-form-field>
                            <mat-label>Message</mat-label>
                            <textarea matInput rows="4" placeholder="Enter alert message"></textarea>
                        </mat-form-field>
                        <div class="flex gap-4 mt-4">
                            <button mat-raised-button color="primary">Create Alert</button>
                            <button mat-stroked-button routerLink="/apps/alerts/alertlist">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
})
export class AddAlertComponent implements OnInit {
    ngOnInit() {}
}
