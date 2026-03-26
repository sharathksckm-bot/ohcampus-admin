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
    selector: 'app-alertlist',
    templateUrl: './alertlist.component.html',
    styleUrls: ['./alertlist.component.scss']
})
export class AlertListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('editAlertDialog') editAlertDialog: TemplateRef<any>;

    displayedColumns: string[] = ['Sr.No', 'title', 'type', 'priority', 'exam_tags', 'start_date', 'end_date', 'status', 'created_at', 'actions'];
    alertsData: any[] = [];
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
    currentAlertId: number = null;

    alertTypes = [
        { id: 'exam_date', name: 'Exam Date' },
        { id: 'counseling', name: 'Counseling' },
        { id: 'result', name: 'Result' },
        { id: 'application', name: 'Application' },
        { id: 'general', name: 'General' }
    ];

    priorityLevels = [
        { id: 'low', name: 'Low' },
        { id: 'medium', name: 'Medium' },
        { id: 'high', name: 'High' },
        { id: 'urgent', name: 'Urgent' }
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
            hyperlink: [''],
            type: ['general'],
            exam_tags: [''],
            priority: ['medium'],
            start_date: [''],
            end_date: [''],
            status: [1],
            is_featured: [0]
        });

        this.listLoader = true;
        this.getAlertsList();
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
        this.getAlertsList();
    }

    applyFilter(filterValue: string) {
        this.searchLoader = true;
        this.getAlertsList();
        setTimeout(() => { this.searchLoader = false; }, 500);
    }

    onSortChange(event: MatSort) {
        this.sortValue = event.direction || 'desc';
        this.getAlertsList();
    }

    getAlertsList() {
        this.campusService.getAlertsList(this.page, this.pageSize, this.startNum, this.orderColumn, this.sortValue, this.searchForm.value.search).subscribe((res) => {
            if (res.response_code === 1 || res.response_code === '1') {
                this.alertsData = res.response_data?.data || [];
                this.recordsTotal = res.response_data?.recordsTotal || 0;
                this.recordsFiltered = res.response_data?.recordsFiltered || 0;
                this.dataSource = new MatTableDataSource<any>(this.alertsData);
                this.dataSource.sort = this.sort;
            } else {
                this.alertsData = [];
                this.dataSource = new MatTableDataSource<any>([]);
            }
            this.listLoader = false;
        }, (error) => {
            this.listLoader = false;
            this.alertsData = [];
            this.dataSource = new MatTableDataSource<any>([]);
        });
    }

    addNewAlert() {
        this.currentAlertId = null;
        this.editForm.reset({
            title: '',
            description: '',
            hyperlink: '',
            type: 'general',
            exam_tags: '',
            priority: 'medium',
            start_date: '',
            end_date: '',
            status: 1,
            is_featured: 0
        });
        this.dialog.open(this.editAlertDialog, { width: '600px' });
    }

    editAlert(alert) {
        this.currentAlertId = alert.id;
        this.editForm.patchValue({
            title: alert.title,
            description: alert.description,
            hyperlink: alert.hyperlink,
            type: alert.type,
            exam_tags: alert.exam_tags,
            priority: alert.priority,
            start_date: alert.start_date,
            end_date: alert.end_date,
            status: alert.status,
            is_featured: alert.is_featured
        });
        this.dialog.open(this.editAlertDialog, { width: '600px' });
    }

    saveAlert() {
        this.editLoader = true;
        const alertData = this.editForm.value;

        if (this.currentAlertId) {
            alertData.id = this.currentAlertId;
            this.campusService.updateAlert(alertData).subscribe((res) => {
                this.editLoader = false;
                if (res.response_code === 1 || res.response_code === '1') {
                    Swal.fire('Success', 'Alert updated successfully', 'success');
                    this.dialog.closeAll();
                    this.getAlertsList();
                } else {
                    Swal.fire('Error', res.response_message || 'Failed to update alert', 'error');
                }
            }, () => {
                this.editLoader = false;
                Swal.fire('Error', 'Failed to update alert', 'error');
            });
        } else {
            this.campusService.insertAlert(alertData).subscribe((res) => {
                this.editLoader = false;
                if (res.response_code === 1 || res.response_code === '1') {
                    Swal.fire('Success', 'Alert created successfully', 'success');
                    this.dialog.closeAll();
                    this.getAlertsList();
                } else {
                    Swal.fire('Error', res.response_message || 'Failed to create alert', 'error');
                }
            }, () => {
                this.editLoader = false;
                Swal.fire('Error', 'Failed to create alert', 'error');
            });
        }
    }

    deleteAlert(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this alert?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                this.campusService.deleteAlert(id).subscribe((res) => {
                    if (res.response_code === 1 || res.response_code === '1') {
                        this.getAlertsList();
                        Swal.fire('Deleted!', 'Alert has been deleted.', 'success');
                    } else {
                        Swal.fire({ icon: 'warning', text: res.response_message || 'Failed to delete' });
                    }
                });
            }
        });
    }

    updateStatus(id, status) {
        this.campusService.updateAlertStatus(id, status).subscribe((res) => {
            if (res.response_code === 1 || res.response_code === '1') {
                this.getAlertsList();
                Swal.fire('', 'Status updated successfully.', 'success');
            }
        });
    }

    close() {
        this.dialog.closeAll();
    }

    getPriorityColor(priority) {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-green-100 text-green-800';
        }
    }

    getTypeColor(type) {
        switch (type) {
            case 'exam_date': return 'bg-blue-100 text-blue-800';
            case 'counseling': return 'bg-purple-100 text-purple-800';
            case 'result': return 'bg-green-100 text-green-800';
            case 'application': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
}
