import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service';
import Swal from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-genericpredictorlist',
    templateUrl: './genericpredictorlist.component.html',
    styleUrls: ['./genericpredictorlist.component.scss']
})
export class GenericpredictorlistComponent implements OnInit {
    @ViewChild('viewMoreDialog') viewMoreDialog: TemplateRef<any>;
    @ViewChild('clearDataDialog') clearDataDialog: TemplateRef<any>;
    @ViewChild('importDialog') importDialog: TemplateRef<any>;

    displayedColumns: string[] = ['Sr.No', 'exam_type', 'year', 'round', 'category', 'college_name', 'course', 'college_type', 'action'];
    dataSource: any;
    
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    
    cutoffList: any[];
    selectedCutoff: any;
    
    searchForm: FormGroup;
    filterForm: FormGroup;
    importForm: FormGroup;
    
    page: number = 1;
    pageSize: number = 10;
    startNum: number = 0;
    listLoader: boolean = false;
    sortValue: string = "desc";
    recordsTotal: any;
    recordsFiltered: any;
    columnIndex: number = 0;
    searchLoader: boolean = false;

    // Exam types
    examTypes = [
        { code: 'KCET', name: 'Karnataka CET (KCET)' },
        { code: 'COMEDK', name: 'COMEDK UGET' },
        { code: 'JEE', name: 'JEE Main' }
    ];
    
    selectedExamType: string = '';

    // Clear Data
    clearDataExamType: string = '';
    clearDataYear: string = '';
    clearDataConfirmation: string = '';

    // Statistics
    totalRecords: number = 0;
    totalColleges: number = 0;
    totalCourses: number = 0;

    // Import options
    availableYears: string[] = [];
    availableRounds: string[] = ['Round 1', 'Round 2', 'Round 3', 'Mock Round', 'Special Round'];

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
        
        this.filterForm = this._formBuilder.group({
            exam_type: [''],
        });
        
        this.importForm = this._formBuilder.group({
            exam_type: ['KCET'],
            year: [new Date().getFullYear().toString()],
            round: ['Round 1']
        });
        
        // Generate years
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= currentYear - 5; i--) {
            this.availableYears.push(i.toString());
        }
        
        this.listLoader = true;
        this.getCutoffList();
    }

    getCutoffList() {
        this.campusService.getGenericCutoffList(
            this.page,
            this.pageSize,
            this.startNum,
            this.columnIndex,
            this.sortValue,
            this.searchForm.value.search,
            this.selectedExamType
        ).subscribe((res) => {
            this.cutoffList = res.data;
            this.recordsTotal = res.recordsTotal;
            this.recordsFiltered = res.recordsFiltered;
            this.totalRecords = res.recordsTotal;

            if (this.cutoffList?.length > 0) {
                this.dataSource = new MatTableDataSource<any>(this.cutoffList);
                this.dataSource.sort = this.sort;
            } else {
                this.dataSource = new MatTableDataSource<any>([]);
            }
            this.listLoader = false;
        }, (error) => {
            console.error('Error fetching cutoff list:', error);
            this.listLoader = false;
        });
    }

    onExamTypeChange(examType: string): void {
        this.selectedExamType = examType;
        this.page = 1;
        this.startNum = 0;
        this.getCutoffList();
    }

    onPageChange(event: PageEvent): void {
        this.page = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.startNum = (this.pageSize * event.pageIndex);
        this.getCutoffList();
    }

    addCutoff() {
        this._route.navigate(['apps/genericpredictor/addgenericcutoff']);
    }

    applyFilter(filterValue: string) {
        this.searchLoader = true;
        this.page = 1;
        this.startNum = 0;
        this.getCutoffList();
        setTimeout(() => { this.searchLoader = false; }, 500);
    }

    onSortChange(event: MatSort) {
        this.sortValue = event.direction || 'desc';
        this.columnIndex = this.displayedColumns.indexOf(event.active);
        this.getCutoffList();
    }

    viewMore(cutoff: any) {
        this.selectedCutoff = cutoff;
        // Fetch full cutoff data including cutoff_data JSON
        this.campusService.getGenericCutoffById(cutoff.id).subscribe((res) => {
            if (res.response_code === '200') {
                this.selectedCutoff = res.response_data;
            }
            this.dialog.open(this.viewMoreDialog, { width: '600px' });
        });
    }

    editCutoff(id: number) {
        this._route.navigate(['apps/genericpredictor/addgenericcutoff/update', id]);
    }

    deleteCutoff(id: number) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this cutoff entry?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                this.campusService.deleteGenericCutoff(id).subscribe((res) => {
                    if (res.response_code === '200' || res.response_message === 'Success') {
                        this.getCutoffList();
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Cutoff entry has been deleted.',
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

    openImportDialog(): void {
        this.dialog.open(this.importDialog, { width: '500px' });
    }

    downloadSampleCSV(): void {
        const examType = this.importForm.value.exam_type || 'KCET';
        this.campusService.getGenericSampleCsv(examType).subscribe((res) => {
            if (res.response_code === '200' && res.samplecsv) {
                // Open the CSV URL in a new window to trigger download
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

    importCutoffFile(event: any) {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('exam_type', this.importForm.value.exam_type);
        formData.append('year', this.importForm.value.year);
        formData.append('round', this.importForm.value.round);

        Swal.fire({
            title: 'Importing...',
            text: 'Please wait while we import the cutoff data.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        this.campusService.importGenericCutoffExcel(formData).subscribe((res) => {
            Swal.close();
            this.dialog.closeAll();
            
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
                this.getCutoffList();
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

    deleteBulkCutoffs(): void {
        Swal.fire({
            title: 'Delete Bulk Data',
            html: `
                <p>This will delete all cutoff data for the selected exam type.</p>
                <p><strong>Exam:</strong> ${this.selectedExamType || 'All'}</p>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete All',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                this.campusService.deleteGenericBulkCutoffs(this.selectedExamType).subscribe((res) => {
                    if (res.response_code === '200') {
                        this.getCutoffList();
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: `${res.deleted_count} records have been deleted.`,
                            timer: 2000,
                            showConfirmButton: false
                        });
                    }
                });
            }
        });
    }

    closeDialog() {
        this.dialog.closeAll();
    }

    getCollegeTypeLabel(type: any): string {
        return type == 1 || type === 'Government' ? 'Government' : 'Private';
    }

    getCollegeTypeClass(type: any): string {
        return type == 1 || type === 'Government' ? 'govt-badge' : 'private-badge';
    }

    getExamTypeClass(type: string): string {
        switch (type) {
            case 'KCET': return 'kcet-badge';
            case 'COMEDK': return 'comedk-badge';
            case 'JEE': return 'jee-badge';
            default: return '';
        }
    }

    getCutoffDataKeys(cutoffData: any): string[] {
        if (!cutoffData) return [];
        return Object.keys(cutoffData);
    }

    openClearDataDialog(): void {
        this.clearDataExamType = this.selectedExamType || '';
        this.clearDataYear = '';
        this.clearDataConfirmation = '';
        
        const dialogRef = this.dialog.open(this.clearDataDialog, { width: '500px' });
        
        dialogRef.afterClosed().subscribe(result => {
            if (result === true && this.clearDataConfirmation === 'DELETE') {
                this.clearData();
            }
        });
    }

    clearData(): void {
        this.campusService.clearGenericCutoffData(
            this.clearDataConfirmation,
            this.clearDataExamType || null,
            this.clearDataYear || null
        ).subscribe({
            next: (res) => {
                if (res.response_code === '200') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Data Cleared!',
                        text: `${res.deleted_count} records have been deleted.`,
                        timer: 3000,
                        showConfirmButton: true
                    });
                    this.getCutoffList();
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: res.response_message || 'Failed to clear data'
                    });
                }
            },
            error: () => {
                Swal.fire({
                    icon: 'error',
                    text: 'An error occurred while clearing data.'
                });
            }
        });
    }

    exportToExcel(): void {
        if (!this.cutoffList || this.cutoffList.length === 0) {
            Swal.fire({ icon: 'info', text: 'No data to export' });
            return;
        }

        const headers = ['Exam Type', 'Year', 'Round', 'Category', 'College Name', 'Course', 'College Type', 'Closing Rank'];
        const rows = this.cutoffList.map(c => [
            c.exam_type,
            c.year,
            c.round,
            c.category,
            c.college_name,
            c.course,
            c.college_type,
            c.closing_rank || ''
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c || ''}"`).join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `generic_cutoff_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}
