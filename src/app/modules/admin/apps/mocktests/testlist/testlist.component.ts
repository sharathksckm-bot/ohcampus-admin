import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service';
import Swal from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-testlist',
    templateUrl: './testlist.component.html',
    styleUrls: ['./testlist.component.scss']
})
export class TestListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('editTestDialog') editTestDialog: TemplateRef<any>;

    displayedColumns: string[] = ['Sr.No', 'title', 'exam_type', 'duration', 'total_marks', 'question_count', 'status', 'created_at', 'actions'];
    testListData: any[] = [];
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
    currentTestId: number = null;

    examTypes = [
        { id: 'NEET', name: 'NEET' },
        { id: 'JEE', name: 'JEE' },
        { id: 'KCET', name: 'KCET' },
        { id: 'COMEDK', name: 'COMEDK' },
        { id: 'General', name: 'General' }
    ];

    difficultyLevels = [
        { id: 'easy', name: 'Easy' },
        { id: 'medium', name: 'Medium' },
        { id: 'hard', name: 'Hard' }
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
            title: [''],
            description: [''],
            exam_type: ['NEET'],
            duration: [180],
            total_marks: [720],
            passing_marks: [0],
            negative_marking: [1],
            negative_marks_value: [0.25],
            difficulty_level: ['medium'],
            instructions: [''],
            status: [1],
            is_free: [1],
            price: [0]
        });

        this.listLoader = true;
        this.getTestList();
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
        this.getTestList();
    }

    applyFilter(filterValue: string) {
        this.searchLoader = true;
        this.getTestList();
        setTimeout(() => { this.searchLoader = false; }, 500);
    }

    onSortChange(event: MatSort) {
        this.sortValue = event.direction || 'desc';
        this.getTestList();
    }

    getTestList() {
        this.campusService.getMockTestList(this.page, this.pageSize, this.startNum, this.orderColumn, this.sortValue, this.searchForm.value.search).subscribe((res) => {
            if (res.response_code === 1 || res.response_code === '1') {
                this.testListData = res.response_data?.data || [];
                this.recordsTotal = res.response_data?.recordsTotal || 0;
                this.recordsFiltered = res.response_data?.recordsFiltered || 0;
                this.dataSource = new MatTableDataSource<any>(this.testListData);
                this.dataSource.sort = this.sort;
            } else {
                this.testListData = [];
                this.dataSource = new MatTableDataSource<any>([]);
            }
            this.listLoader = false;
        }, (error) => {
            this.listLoader = false;
            this.testListData = [];
            this.dataSource = new MatTableDataSource<any>([]);
        });
    }

    addNewTest() {
        this.currentTestId = null;
        this.editForm.reset({
            title: '',
            description: '',
            exam_type: 'NEET',
            duration: 180,
            total_marks: 720,
            passing_marks: 0,
            negative_marking: 1,
            negative_marks_value: 0.25,
            difficulty_level: 'medium',
            instructions: '',
            status: 1,
            is_free: 1,
            price: 0
        });
        this.dialog.open(this.editTestDialog, { width: '600px' });
    }

    editTest(test) {
        this.currentTestId = test.id;
        this.editForm.patchValue({
            title: test.title,
            description: test.description,
            exam_type: test.exam_type,
            duration: test.duration,
            total_marks: test.total_marks,
            passing_marks: test.passing_marks,
            negative_marking: test.negative_marking,
            negative_marks_value: test.negative_marks_value,
            difficulty_level: test.difficulty_level,
            instructions: test.instructions,
            status: test.status,
            is_free: test.is_free,
            price: test.price
        });
        this.dialog.open(this.editTestDialog, { width: '600px' });
    }

    saveTest() {
        this.editLoader = true;
        const testData = this.editForm.value;

        if (this.currentTestId) {
            testData.id = this.currentTestId;
            this.campusService.updateMockTest(testData).subscribe((res) => {
                this.editLoader = false;
                if (res.response_code === 1 || res.response_code === '1') {
                    Swal.fire('Success', 'Test updated successfully', 'success');
                    this.dialog.closeAll();
                    this.getTestList();
                } else {
                    Swal.fire('Error', res.response_message || 'Failed to update test', 'error');
                }
            }, () => {
                this.editLoader = false;
                Swal.fire('Error', 'Failed to update test', 'error');
            });
        } else {
            this.campusService.insertMockTest(testData).subscribe((res) => {
                this.editLoader = false;
                if (res.response_code === 1 || res.response_code === '1') {
                    Swal.fire('Success', 'Test created successfully', 'success');
                    this.dialog.closeAll();
                    this.getTestList();
                } else {
                    Swal.fire('Error', res.response_message || 'Failed to create test', 'error');
                }
            }, () => {
                this.editLoader = false;
                Swal.fire('Error', 'Failed to create test', 'error');
            });
        }
    }

    deleteTest(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this test?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                this.campusService.deleteMockTest(id).subscribe((res) => {
                    if (res.response_code === 1 || res.response_code === '1') {
                        this.getTestList();
                        Swal.fire('Deleted!', 'Test has been deleted.', 'success');
                    } else {
                        Swal.fire({ icon: 'warning', text: res.response_message || 'Failed to delete' });
                    }
                });
            }
        });
    }

    manageQuestions(testId) {
        this._route.navigate(['apps/mocktests/questions'], { queryParams: { testId: testId } });
    }

    close() {
        this.dialog.closeAll();
    }
}
