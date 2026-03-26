import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service';
import Swal from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-seatlist',
    templateUrl: './seatlist.component.html',
    styleUrls: ['./seatlist.component.scss']
})
export class SeatlistComponent implements OnInit {
    displayedColumns: string[] = ['Sr.No', 'college_name', 'state', 'round', 'category', 'total_seats', 'filled_seats', 'available_seats', 'status', 'last_updated', 'action'];
    dataSource: any;
    
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    
    seatList: any[];
    searchForm: FormGroup;
    filterForm: FormGroup;
    
    page: number = 1;
    pageSize: number = 10;
    startNum: number = 0;
    listLoader: boolean = false;
    sortValue: string = "desc";
    recordsTotal: any;
    recordsFiltered: any;
    columnIndex: number = 0;

    // Filter options
    states: string[] = ['Karnataka', 'Tamil Nadu', 'Maharashtra', 'Delhi', 'Uttar Pradesh', 'Rajasthan', 'Kerala'];
    counselingTypes: string[] = ['State Quota', 'All India Quota', 'Deemed Universities'];
    rounds: string[] = ['Round 1', 'Round 2', 'Round 3', 'Mop-up', 'Stray Vacancy'];
    years: number[] = [];

    // Overview stats
    totalSeats: number = 0;
    totalFilled: number = 0;
    totalAvailable: number = 0;

    constructor(
        private _formBuilder: FormBuilder,
        private campusService: CampusService,
        public _route: Router
    ) {
        const currentYear = new Date().getFullYear();
        for (let i = 0; i <= 2; i++) {
            this.years.push(currentYear - i);
        }
    }

    ngOnInit(): void {
        this.searchForm = this._formBuilder.group({
            search: [''],
        });
        this.filterForm = this._formBuilder.group({
            state: [''],
            counseling_type: [''],
            round: [''],
            year: [new Date().getFullYear()]
        });
        this.listLoader = true;
        this.getSeatList();
    }

    getSeatList() {
        const filters = this.filterForm.value;
        this.campusService.getSeatAvailabilityList(
            this.page,
            this.pageSize,
            this.startNum,
            this.columnIndex,
            this.sortValue,
            this.searchForm.value.search,
            filters
        ).subscribe((res) => {
            this.seatList = res.data;
            this.recordsTotal = res.recordsTotal;
            this.recordsFiltered = res.recordsFiltered;

            // Calculate stats
            this.totalSeats = this.seatList?.reduce((sum, s) => sum + parseInt(s.total_seats || 0), 0) || 0;
            this.totalFilled = this.seatList?.reduce((sum, s) => sum + parseInt(s.filled_seats || 0), 0) || 0;
            this.totalAvailable = this.seatList?.reduce((sum, s) => sum + parseInt(s.available_seats || 0), 0) || 0;

            if (this.seatList?.length > 0) {
                this.dataSource = new MatTableDataSource<any>(this.seatList);
                this.dataSource.sort = this.sort;
            }
            this.listLoader = false;
        }, (error) => {
            console.error('Error fetching seat list:', error);
            this.listLoader = false;
        });
    }

    onPageChange(event: PageEvent): void {
        this.page = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.startNum = (this.pageSize * event.pageIndex);
        this.getSeatList();
    }

    applyFilter(filterValue: string) {
        this.page = 1;
        this.startNum = 0;
        this.getSeatList();
    }

    applyFilters() {
        this.page = 1;
        this.startNum = 0;
        this.getSeatList();
    }

    clearFilters() {
        this.filterForm.reset({
            state: '',
            counseling_type: '',
            round: '',
            year: new Date().getFullYear()
        });
        this.getSeatList();
    }

    addSeat() {
        this._route.navigate(['apps/seatavailability/addseat']);
    }

    editSeat(id: number) {
        this._route.navigate(['apps/seatavailability/addseat/update', id]);
    }

    deleteSeat(id: number) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this seat entry?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                this.campusService.deleteSeatAvailability(id).subscribe((res) => {
                    if (res.response_code === '200') {
                        this.getSeatList();
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    } else {
                        Swal.fire({ icon: 'error', text: res.response_message });
                    }
                });
            }
        });
    }

    importCsv(event: any) {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        Swal.fire({
            title: 'Importing...',
            text: 'Please wait...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        this.campusService.importSeatsCsv(formData).subscribe((res) => {
            Swal.close();
            if (res.response_code === '200') {
                Swal.fire({
                    icon: 'success',
                    title: 'Import Successful!',
                    html: `Imported: <strong>${res.imported_count}</strong><br>Updated: <strong>${res.updated_count}</strong>`
                });
                this.getSeatList();
            } else {
                Swal.fire({ icon: 'error', text: res.response_message });
            }
        });

        event.target.value = '';
    }

    getStatusClass(status: string): string {
        switch (status?.toLowerCase()) {
            case 'active': return 'status-active';
            case 'completed': return 'status-completed';
            case 'upcoming': return 'status-upcoming';
            default: return '';
        }
    }

    getAvailabilityClass(available: number, total: number): string {
        const percentage = (available / total) * 100;
        if (percentage <= 10) return 'low-availability';
        if (percentage <= 30) return 'medium-availability';
        return 'high-availability';
    }

    downloadSampleCSV(): void {
        this.campusService.getSeatSampleCsv().subscribe((res) => {
            if (res.response_code === '200' && res.samplecsv) {
                window.open(res.samplecsv, '_blank');
            } else {
                Swal.fire({
                    icon: 'info',
                    text: 'Sample CSV not available'
                });
            }
        }, (error) => {
            Swal.fire({
                icon: 'error',
                text: 'Failed to download sample CSV'
            });
        });
    }
}
