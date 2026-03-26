import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-universities',
    template: `
        <div class="flex flex-col flex-auto">
            <div class="flex flex-wrap items-center p-6 sm:p-8 w-full">
                <div class="flex flex-auto">
                    <h2 class="text-2xl font-semibold">Study Abroad - Universities</h2>
                </div>
                <div class="flex items-center">
                    <button mat-raised-button color="primary">
                        <mat-icon>add</mat-icon>
                        Add University
                    </button>
                </div>
            </div>
            <div class="p-6 sm:p-8 pt-0">
                <div class="bg-card shadow rounded-2xl overflow-hidden">
                    <div class="p-4">
                        <mat-form-field class="w-full">
                            <mat-icon matPrefix>search</mat-icon>
                            <input matInput placeholder="Search universities..." (keyup)="applyFilter($event)">
                        </mat-form-field>
                    </div>
                    <table mat-table [dataSource]="dataSource" matSort class="w-full">
                        <ng-container matColumnDef="name">
                            <th mat-header-cell *matHeaderCellDef mat-sort-header>University</th>
                            <td mat-cell *matCellDef="let row">{{row.name}}</td>
                        </ng-container>
                        <ng-container matColumnDef="country">
                            <th mat-header-cell *matHeaderCellDef mat-sort-header>Country</th>
                            <td mat-cell *matCellDef="let row">{{row.country}}</td>
                        </ng-container>
                        <ng-container matColumnDef="ranking">
                            <th mat-header-cell *matHeaderCellDef mat-sort-header>Ranking</th>
                            <td mat-cell *matCellDef="let row">#{{row.ranking}}</td>
                        </ng-container>
                        <ng-container matColumnDef="programs">
                            <th mat-header-cell *matHeaderCellDef>Programs</th>
                            <td mat-cell *matCellDef="let row">{{row.programs}}</td>
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
export class UniversitiesComponent implements OnInit {
    displayedColumns = ['name', 'country', 'ranking', 'programs', 'actions'];
    dataSource = new MatTableDataSource([
        { name: 'MIT', country: 'USA', ranking: 1, programs: 'Engineering, CS, Business' },
        { name: 'Stanford University', country: 'USA', ranking: 3, programs: 'CS, Business, Medicine' },
        { name: 'University of Oxford', country: 'UK', ranking: 4, programs: 'Law, Medicine, Arts' },
        { name: 'University of Cambridge', country: 'UK', ranking: 5, programs: 'Sciences, Engineering' },
        { name: 'University of Toronto', country: 'Canada', ranking: 21, programs: 'Engineering, Business' },
        { name: 'University of Melbourne', country: 'Australia', ranking: 33, programs: 'Medicine, Law' },
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
