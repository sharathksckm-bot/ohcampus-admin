import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service';
import Swal from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-examlist',
    templateUrl: './examlist.component.html',
    styleUrls: ['./examlist.component.scss']
})
export class ExamListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('editExamDialog') editExamDialog: TemplateRef<any>;
    @ViewChild('uploadDialog') uploadDialog: TemplateRef<any>;
    @ViewChild('fileInput') fileInput: ElementRef;

    displayedColumns: string[] = ['Sr.No', 'exam_name', 'exam_code', 'category', 'max_marks', 'total_records', 'status', 'created_at', 'actions'];
    examListData: any[] = [];
    dataSource: any;
    searchForm: FormGroup;
    listLoader: boolean = false;
    page: number = 1;
    pageSize: number = 10;
    startNum: number = 0;
    sortValue: string = "desc";
    orderColumn: number = 0;
    recordsTotal: any = 0;
    recordsFiltered: any = 0;
    searchLoader: boolean = false;

    editForm: FormGroup;
    editLoader: boolean = false;
    currentExamId: number = null;
    uploadLoader: boolean = false;
    selectedFile: File = null;
    currentUploadExamId: number = null;

    categories = [
        { id: 'Medical', name: 'Medical (NEET)' },
        { id: 'Engineering', name: 'Engineering (JEE)' },
        { id: 'KCET', name: 'KCET (Board + KCET Score)' },
        { id: 'COMEDK', name: 'COMEDK' },
        { id: 'Management', name: 'Management' },
        { id: 'Law', name: 'Law' },
        { id: 'Other', name: 'Other' }
    ];

    constructor(
        private _formBuilder: FormBuilder,
        private campusService: CampusService,
        public _route: Router,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.searchForm = this._formBuilder.group({
            search: [''],
        });

        this.editForm = this._formBuilder.group({
            exam_name: [''],
            exam_code: [''],
            category: ['Medical'],
            description: [''],
            max_marks: [720],
            board_weightage: [50],
            kcet_weightage: [50],
            status: [1]
        });

        this.listLoader = true;
        this.getExamList();
    }

    convertDate(inputFormat) {
        if (!inputFormat) return '-';
        var d = new Date(inputFormat);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    onPageChange(event: PageEvent): void {
        this.page = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.startNum = (this.pageSize * (event.pageIndex));
        this.getExamList();
    }

    applyFilter(filterValue: string) {
        this.searchLoader = true;
        this.getExamList();
        setTimeout(() => { this.searchLoader = false; }, 500);
    }

    onSortChange(event: MatSort) {
        this.sortValue = event.direction || 'desc';
        this.getExamList();
    }

    getExamList() {
        this.campusService.getRankPredictorExamList(this.page, this.pageSize, this.startNum, this.orderColumn, this.sortValue, this.searchForm.value.search).subscribe((res) => {
            if (res.response_code === 1 || res.response_code === '1') {
                this.examListData = res.response_data?.data || [];
                this.recordsTotal = res.response_data?.recordsTotal || 0;
                this.recordsFiltered = res.response_data?.recordsFiltered || 0;
                this.dataSource = new MatTableDataSource<any>(this.examListData);
                this.dataSource.sort = this.sort;
            } else {
                this.examListData = [];
                this.dataSource = new MatTableDataSource<any>([]);
            }
            this.listLoader = false;
        }, (error) => {
            this.listLoader = false;
            this.examListData = [];
            this.dataSource = new MatTableDataSource<any>([]);
        });
    }

    addNewExam() {
        this.currentExamId = null;
        this.editForm.reset({
            exam_name: '',
            exam_code: '',
            category: 'Medical',
            description: '',
            max_marks: 720,
            board_weightage: 50,
            kcet_weightage: 50,
            status: 1
        });
        this.dialog.open(this.editExamDialog, { width: '600px' });
    }

    editExam(exam) {
        this.currentExamId = exam.id;
        this.editForm.patchValue({
            exam_name: exam.exam_name,
            exam_code: exam.exam_code,
            category: exam.category,
            description: exam.description,
            max_marks: exam.max_marks,
            board_weightage: exam.board_weightage || 50,
            kcet_weightage: exam.kcet_weightage || 50,
            status: exam.status
        });
        this.dialog.open(this.editExamDialog, { width: '600px' });
    }

    saveExam() {
        this.editLoader = true;
        const examData = this.editForm.value;

        if (this.currentExamId) {
            examData.id = this.currentExamId;
            this.campusService.updateRankPredictorExam(examData).subscribe((res) => {
                this.editLoader = false;
                if (res.response_code === 1 || res.response_code === '1') {
                    Swal.fire('Success', 'Exam updated successfully', 'success');
                    this.dialog.closeAll();
                    this.getExamList();
                } else {
                    Swal.fire('Error', res.response_message || 'Failed to update exam', 'error');
                }
            }, () => {
                this.editLoader = false;
                Swal.fire('Error', 'Failed to update exam', 'error');
            });
        } else {
            this.campusService.insertRankPredictorExam(examData).subscribe((res) => {
                this.editLoader = false;
                if (res.response_code === 1 || res.response_code === '1') {
                    Swal.fire('Success', 'Exam created successfully', 'success');
                    this.dialog.closeAll();
                    this.getExamList();
                } else {
                    Swal.fire('Error', res.response_message || 'Failed to create exam', 'error');
                }
            }, () => {
                this.editLoader = false;
                Swal.fire('Error', 'Failed to create exam', 'error');
            });
        }
    }

    deleteExam(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this exam? All rank data will also be deleted.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                this.campusService.deleteRankPredictorExam(id).subscribe((res) => {
                    if (res.response_code === 1 || res.response_code === '1') {
                        this.getExamList();
                        Swal.fire('Deleted!', 'Exam has been deleted.', 'success');
                    } else {
                        Swal.fire({ icon: 'warning', text: res.response_message || 'Failed to delete' });
                    }
                });
            }
        });
    }

    openUploadDialog(exam) {
        this.currentUploadExamId = exam.id;
        this.selectedFile = null;
        this.dialog.open(this.uploadDialog, { width: '500px' });
    }

    onFileSelected(event) {
        this.selectedFile = event.target.files[0];
    }

    uploadCSV() {
        if (!this.selectedFile) {
            Swal.fire('Error', 'Please select a CSV file', 'error');
            return;
        }

        this.uploadLoader = true;
        this.campusService.uploadRankPredictorCSV(this.currentUploadExamId, this.selectedFile).subscribe((res) => {
            this.uploadLoader = false;
            if (res.response_code === 1 || res.response_code === '1') {
                Swal.fire('Success', `CSV uploaded successfully. ${res.response_data?.records_added || 0} records added.`, 'success');
                this.dialog.closeAll();
                this.getExamList();
            } else {
                Swal.fire('Error', res.response_message || 'Failed to upload CSV', 'error');
            }
        }, () => {
            this.uploadLoader = false;
            Swal.fire('Error', 'Failed to upload CSV', 'error');
        });
    }

    clearRankData(exam) {
        Swal.fire({
            title: "Clear Rank Data",
            html: `
                <div class="text-left">
                    <p class="text-red-600 font-medium mb-2">Warning: This action cannot be undone!</p>
                    <p class="mb-4">Clear all rank data for <strong>${exam.exam_name}</strong>?</p>
                    <p class="text-sm text-gray-600">Type <strong class="text-red-600">DELETE</strong> to confirm:</p>
                </div>
            `,
            input: "text",
            inputPlaceholder: "Type DELETE to confirm",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Clear All Data",
            confirmButtonColor: "#d33",
            cancelButtonText: "Cancel",
            inputValidator: (value) => {
                if (value !== "DELETE") {
                    return "Please type DELETE to confirm";
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.campusService.clearRankPredictorData(exam.id).subscribe((res) => {
                    if (res.response_code === 1 || res.response_code === "1") {
                        this.getExamList();
                        Swal.fire("Cleared!", "All rank data has been cleared.", "success");
                    } else {
                        Swal.fire({ icon: "warning", text: res.response_message || "Failed to clear data" });
                    }
                });
            }
        });
    }

    close() {
        this.dialog.closeAll();
    }

    downloadTemplate() {
        const csvContent = "marks,rank,year,category,board_score,kcet_score\n720,1,2025,General,,\n710,50,2025,General,,\n700,150,2025,General,,\n650,1000,2025,General,,\n600,5000,2025,General,,\n550,15000,2025,General,,\n500,30000,2025,General,,\n450,50000,2025,General,,\n400,80000,2025,General,,\n350,120000,2025,General,,\n# For KCET: Use board_score (PCM) and kcet_score columns\n# Example KCET row:\n# ,1,2025,General,570,180";
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rank_predictor_template.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }
}
