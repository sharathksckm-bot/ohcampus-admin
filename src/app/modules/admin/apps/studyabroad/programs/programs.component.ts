import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-programs',
    template: `
        <div class="flex flex-col flex-auto">
            <div class="flex flex-wrap items-center p-6 sm:p-8 w-full">
                <div class="flex flex-auto">
                    <h2 class="text-2xl font-semibold">Study Abroad - Programs</h2>
                </div>
                <div class="flex items-center">
                    <button mat-raised-button color="primary">
                        <mat-icon>add</mat-icon>
                        Add Program
                    </button>
                </div>
            </div>
            <div class="p-6 sm:p-8 pt-0">
                <div class="bg-card shadow rounded-2xl p-6">
                    <p>Programs management coming soon...</p>
                </div>
            </div>
        </div>
    `
})
export class ProgramsComponent implements OnInit {
    ngOnInit() {}
}
