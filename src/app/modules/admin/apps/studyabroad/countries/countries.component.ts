import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-countries',
    template: `
        <div class="flex flex-col flex-auto">
            <div class="flex flex-wrap items-center p-6 sm:p-8 w-full">
                <div class="flex flex-auto">
                    <h2 class="text-2xl font-semibold">Study Abroad - Countries</h2>
                </div>
                <div class="flex items-center">
                    <button mat-raised-button color="primary">
                        <mat-icon>add</mat-icon>
                        Add Country
                    </button>
                </div>
            </div>
            <div class="p-6 sm:p-8 pt-0">
                <div class="bg-card shadow rounded-2xl overflow-hidden">
                    <div class="p-4">
                        <mat-form-field class="w-full">
                            <mat-icon matPrefix>search</mat-icon>
                            <input matInput placeholder="Search countries..." (keyup)="applyFilter($event)">
                        </mat-form-field>
                    </div>
                    <table mat-table [dataSource]="dataSource" matSort class="w-full">
                        <ng-container matColumnDef="name">
                            <th mat-header-cell *matHeaderCellDef mat-sort-header>Country Name</th>
                            <td mat-cell *matCellDef="let row">{{row.name}}</td>
                        </ng-container>
                        <ng-container matColumnDef="universities">
                            <th mat-header-cell *matHeaderCellDef mat-sort-header>Universities</th>
                            <td mat-cell *matCellDef="let row">{{row.universities}}</td>
                        </ng-container>
                        <ng-container matColumnDef="tuition">
                            <th mat-header-cell *matHeaderCellDef>Avg. Tuition</th>
                            <td mat-cell *matCellDef="let row">{{row.tuition}}</td>
                        </ng-container>
                        <ng-container matColumnDef="status">
                            <th mat-header-cell *matHeaderCellDef>Status</th>
                            <td mat-cell *matCellDef="let row">
                                <span class="px-2 py-1 rounded text-xs" [class.bg-green-100]="row.status === 'Active'" [class.bg-red-100]="row.status !== 'Active'">
                                    {{row.status}}
                                </span>
                            </td>
                        </ng-container>
                        <ng-container matColumnDef="actions">
                            <th mat-header-cell *matHeaderCellDef>Actions</th>
                            <td mat-cell *matCellDef="let row">
                                <button mat-icon-button><mat-icon>edit</mat-icon></button>
                                <button mat-icon-button><mat-icon>delete</mat-icon></button>
                            </td>
                        </ng-container>
                        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                    </table>
                    <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
                </div>
            </div>
        </div>
    `
})
export class CountriesComponent implements OnInit {
    displayedColumns = ['name', 'universities', 'tuition', 'status', 'actions'];
    dataSource = new MatTableDataSource([
        { name: 'United States', universities: 4500, tuition: '$25,000 - $55,000', status: 'Active' },
        { name: 'United Kingdom', universities: 150, tuition: '£15,000 - £35,000', status: 'Active' },
        { name: 'Canada', universities: 100, tuition: 'CAD 15,000 - 35,000', status: 'Active' },
        { name: 'Australia', universities: 43, tuition: 'AUD 20,000 - 45,000', status: 'Active' },
        { name: 'Germany', universities: 400, tuition: '€0 - €20,000', status: 'Active' },
        { name: 'Ireland', universities: 34, tuition: '€10,000 - €25,000', status: 'Active' },
    ]);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    ngOnInit() {}

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
