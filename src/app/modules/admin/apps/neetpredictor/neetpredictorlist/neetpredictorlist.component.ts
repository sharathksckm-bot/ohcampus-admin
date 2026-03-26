import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service';
import Swal from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import saveAs from 'file-saver';

@Component({
    selector: 'app-neetpredictorlist',
    templateUrl: './neetpredictorlist.component.html',
    styleUrls: ['./neetpredictorlist.component.scss']
})
export class NeetpredictorlistComponent implements OnInit {
    @ViewChild('viewMoreDialog') viewMoreDialog: TemplateRef<any>;
    @ViewChild('clearDataDialog') clearDataDialog: TemplateRef<any>;

    displayedColumns: string[] = ['Sr.No', 'year', 'state', 'counseling_type', 'college_name', 'course', 'category', 'closing_rank', 'college_type', 'annual_fee', 'action'];
    dataSource: any;
    
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    
    neetCutoffList: any[];
    selectedCutoff: any;
    
    searchForm: FormGroup;
    page: number = 1;
    pageSize: number = 10;
    startNum: number = 0;
    listLoader: boolean = false;
    sortValue: string = "desc";
    recordsTotal: any;
    recordsFiltered: any;
    columnIndex: number = 0;
    searchLoader: boolean = false;

    // Clear Data
    clearDataYear: string = '';
    clearDataState: string = '';
    clearDataCounseling: string = '';
    clearDataConfirmation: string = '';
    clearDataLoading: boolean = false;
    availableYears: string[] = [];

    // Statistics
    totalRecords: number = 0;
    statesCount: number = 0;
    collegesCount: number = 0;

    constructor(
        private _formBuilder: FormBuilder,
        private campusService: CampusService,
        public _route: Router,
        public dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.searchForm = this._formBuilder.group({
            search: [''],
        });
        // Generate years
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= currentYear - 5; i--) {
            this.availableYears.push(i.toString());
        }
        this.listLoader = true;
        this.getNeetCutoffList();
    }

    getNeetCutoffList() {
        this.campusService.getNeetCutoffList(
            this.page,
            this.pageSize,
            this.startNum,
            this.columnIndex,
            this.sortValue,
            this.searchForm.value.search
        ).subscribe((res) => {
            this.neetCutoffList = res.data;
            this.recordsTotal = res.recordsTotal;
            this.recordsFiltered = res.recordsFiltered;
            this.totalRecords = res.recordsTotal;

            if (this.neetCutoffList?.length > 0) {
                this.dataSource = new MatTableDataSource<any>(this.neetCutoffList);
                this.dataSource.sort = this.sort;
            }
            this.listLoader = false;
        }, (error) => {
            console.error('Error fetching NEET cutoff list:', error);
            this.listLoader = false;
        });
    }

    onPageChange(event: PageEvent): void {
        this.page = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.startNum = (this.pageSize * event.pageIndex);
        this.getNeetCutoffList();
    }

    addCutoff() {
        this._route.navigate(['apps/neetpredictor/addneetcutoff']);
    }

    applyFilter(filterValue: string) {
        this.searchLoader = true;
        this.page = 1;
        this.startNum = 0;
        this.getNeetCutoffList();
        setTimeout(() => { this.searchLoader = false; }, 500);
    }

    onSortChange(event: MatSort) {
        this.sortValue = event.direction || 'desc';
        this.columnIndex = this.displayedColumns.indexOf(event.active);
        this.getNeetCutoffList();
    }

    viewMore(cutoff: any) {
        this.selectedCutoff = cutoff;
        this.dialog.open(this.viewMoreDialog);
    }

    editCutoff(id: number) {
        this._route.navigate(['apps/neetpredictor/addneetcutoff/update', id]);
    }

    deleteCutoff(id: number) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this NEET cutoff entry?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                this.campusService.deleteNeetCutoff(id).subscribe((res) => {
                    if (res.response_code === '200' || res.response_message === 'Success') {
                        this.getNeetCutoffList();
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'NEET cutoff entry has been deleted.',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            text: res.response_message || 'Failed to delete'
                        });
                    }
                }, (error) => {
                    Swal.fire({
                        icon: 'error',
                        text: 'An error occurred while deleting.'
                    });
                });
            }
        });
    }

    downloadSampleCSV(): void {
        this.campusService.getSampleNeetCsv().subscribe((res) => {
            if (res.samplecsv) {
                saveAs(res.samplecsv, 'SampleNEETCutoff.csv');
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

    importNeetCsv(event: any) {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        Swal.fire({
            title: 'Importing...',
            text: 'Please wait while we import the NEET cutoff data.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        this.campusService.importNeetCutoffCsv(formData).subscribe((res) => {
            Swal.close();
            if (res.response_code === '200' || res.response_code === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Import Successful!',
                    html: `
                        <p>New records imported: <strong>${res.imported_count || 0}</strong></p>
                        <p>Records updated: <strong>${res.updated_count || 0}</strong></p>
                    `,
                    confirmButtonText: 'OK'
                });
                this.getNeetCutoffList();
            } else {
                Swal.fire({
                    icon: 'warning',
                    text: res.response_message || 'Import failed'
                });
            }
        }, (error) => {
            Swal.close();
            Swal.fire({
                icon: 'error',
                text: 'An error occurred during import.'
            });
        });

        // Reset file input
        event.target.value = '';
    }

    closeDialog() {
        this.dialog.closeAll();
    }

    formatFee(fee: number): string {
        if (!fee || fee === 0) return 'N/A';
        if (fee >= 100000) {
            return '₹' + (fee / 100000).toFixed(1) + ' L';
        }
        return '₹' + fee.toLocaleString('en-IN');
    }

    getCollegeTypeClass(type: string): string {
        switch (type?.toLowerCase()) {
            case 'government': return 'govt-badge';
            case 'private': return 'private-badge';
            case 'deemed': return 'deemed-badge';
            default: return '';
        }
    }

    openClearDataDialog(): void {
        this.clearDataYear = '';
        this.clearDataState = '';
        this.clearDataCounseling = '';
        this.clearDataConfirmation = '';
        
        const dialogRef = this.dialog.open(this.clearDataDialog, { width: '500px' });
        
        dialogRef.afterClosed().subscribe(result => {
            if (result === true && this.clearDataConfirmation === 'DELETE') {
                this.clearData();
            }
        });
    }

    clearData(): void {
        this.clearDataLoading = true;
        
        this.campusService.clearNeetCutoffData(
            this.clearDataConfirmation,
            this.clearDataYear || null,
            this.clearDataState || null,
            this.clearDataCounseling || null
        ).subscribe({
            next: (res) => {
                this.clearDataLoading = false;
                if (res.response_code === '200') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Data Cleared!',
                        text: `${res.deleted_count} records have been deleted.`,
                        timer: 3000,
                        showConfirmButton: true
                    });
                    this.getNeetCutoffList();
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: res.response_message || 'Failed to clear data'
                    });
                }
            },
            error: () => {
                this.clearDataLoading = false;
                Swal.fire({
                    icon: 'error',
                    text: 'An error occurred while clearing data.'
                });
            }
        });
    }

    closeClearDialog(): void {
        this.dialog.closeAll();
    }

    exportToExcel(): void {
        if (!this.neetCutoffList || this.neetCutoffList.length === 0) {
            Swal.fire({ icon: 'info', text: 'No data to export' });
            return;
        }

        const headers = ['Year', 'State', 'Counseling Type', 'College Name', 'Course', 'Category', 'Closing Rank', 'College Type', 'Annual Fee'];
        const rows = this.neetCutoffList.map(c => [
            c.year,
            c.state,
            c.counseling_type,
            c.college_name,
            c.course,
            c.category,
            c.closing_rank,
            c.college_type,
            c.annual_fee || ''
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c || ''}"`).join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        saveAs(blob, `neet_cutoff_export_${new Date().toISOString().split('T')[0]}.csv`);
    }
}
