import { Component, OnInit, ViewChild } from '@angular/core';
import { CampusService } from 'app/modules/service/campus.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = ['Sr.No', 'user_name', 'test_title', 'score', 'percentage', 'correct', 'wrong', 'unanswered', 'time_taken', 'completed_at'];
    resultsData: any[] = [];
    dataSource: any;
    searchForm: FormGroup;
    listLoader: boolean = false;
    page: number = 1;
    pageSize: number = 10;
    startNum: number = 0;
    recordsTotal: any = 0;
    recordsFiltered: any = 0;
    searchLoader: boolean = false;

    constructor(
        private _formBuilder: FormBuilder,
        private campusService: CampusService,
    ) { }

    ngOnInit() {
        this.searchForm = this._formBuilder.group({
            search: [''],
        });

        this.listLoader = true;
        this.getResults();
    }

    convertDate(inputFormat) {
        if (!inputFormat) return '-';
        var d = new Date(inputFormat);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    formatTime(seconds) {
        if (!seconds) return '-';
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hrs > 0) {
            return `${hrs}h ${mins}m ${secs}s`;
        }
        return `${mins}m ${secs}s`;
    }

    onPageChange(event: PageEvent): void {
        this.page = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.startNum = (this.pageSize * (event.pageIndex));
        this.getResults();
    }

    applyFilter(filterValue: string) {
        this.searchLoader = true;
        this.getResults();
        setTimeout(() => { this.searchLoader = false; }, 500);
    }

    getResults() {
        this.campusService.getMockTestAttempts(this.page, this.pageSize, this.startNum, this.searchForm.value.search).subscribe((res) => {
            if (res.response_code === 1 || res.response_code === '1') {
                this.resultsData = res.response_data?.data || [];
                this.recordsTotal = res.response_data?.recordsTotal || 0;
                this.recordsFiltered = res.response_data?.recordsFiltered || 0;
                this.dataSource = new MatTableDataSource<any>(this.resultsData);
                this.dataSource.sort = this.sort;
            } else {
                this.resultsData = [];
                this.dataSource = new MatTableDataSource<any>([]);
            }
            this.listLoader = false;
        }, (error) => {
            this.listLoader = false;
            this.resultsData = [];
            this.dataSource = new MatTableDataSource<any>([]);
        });
    }

    getPercentageColor(percentage) {
        if (percentage >= 75) return 'text-green-600';
        if (percentage >= 50) return 'text-yellow-600';
        return 'text-red-600';
    }
}
