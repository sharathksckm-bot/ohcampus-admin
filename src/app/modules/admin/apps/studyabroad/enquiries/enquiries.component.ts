import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service';
import Swal from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as xlsx from 'xlsx';

interface Status {
    id: string;
    name: string;
}

@Component({
    selector: 'app-enquiries',
    templateUrl: './enquiries.component.html',
    styleUrls: ['./enquiries.component.scss']
})
export class EnquiriesComponent implements OnInit {

    status: Status[] = [
        { id: '1', name: 'Attended' },
        { id: '0', name: 'Pending' },
    ];

    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
    @ViewChild('enquiryDetails', { static: false }) enquiryDetails: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = ['Sr.No', 'name', 'email', 'phone', 'preferred_country', 'course_name', 'statename', 'create_date', 'status', 'actions'];
    enquiryListData: any[];
    dataSource: any;
    enquiryList: FormGroup;
    responseForm: FormGroup;
    listLoader: boolean = false;
    page: number = 1;
    pageSize: number = 10;
    startNum: number = 0;
    sortValue: string = "desc";
    recordsTotal: any;
    count: number = 1;
    recordsFiltered: any;
    columnIndex: number = 1;
    searchLoader: boolean = false;
    enquiryDetailsById: any;
    addLoader: boolean = false;

    constructor(
        private _formBuilder: FormBuilder,
        private campusService: CampusService,
        public _route: Router,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.enquiryList = this._formBuilder.group({
            search: [''],
        });

        this.responseForm = this._formBuilder.group({
            enquiry: [''],
            response: [''],
            emailAddress: [''],
        });

        this.listLoader = true;
        this.getEnquiryList();
    }

    convertDate(inputFormat) {
        if (!inputFormat) return '-';
        function pad(s) { return (s < 10) ? '0' + s : s; }

        var monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        var d = new Date(inputFormat);
        var day = pad(d.getDate());
        var month = monthNames[d.getMonth()];
        var year = d.getFullYear();

        var hours = pad(d.getHours());
        var minutes = pad(d.getMinutes());
        return [day, month, year].join(' ') + ' ' + [hours, minutes].join(':');
    }

    onPageChange(event: PageEvent): void {
        this.page = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.startNum = (this.pageSize * (event.pageIndex));
        this.getEnquiryList();
    }

    applyFilter(filterValue: string) {
        this.searchLoader = true;
        this.getEnquiryList();
        setTimeout(() => { this.searchLoader = false; }, 500);
    }

    onSortChange(event: MatSort) {
        this.sortValue = event.direction;
        this.getEnquiryList();
    }

    getEnquiryList() {
        this.campusService.getStudyAbroadList(this.page, this.pageSize, this.startNum, this.columnIndex, this.sortValue, this.enquiryList.value.search).subscribe((res) => {
            // Handle both response_code formats: 1, '1', '200', 200
            const isSuccess = res.response_code === 1 || res.response_code === '1' || res.response_code === '200' || res.response_code === 200;
            if (isSuccess || res.data) {
                // Handle different response structures
                this.enquiryListData = res.data || res.response_data?.data || res.response_data || [];
                this.recordsTotal = res.recordsTotal || res.response_data?.recordsTotal || this.enquiryListData.length;
                this.recordsFiltered = res.recordsFiltered || res.response_data?.recordsFiltered || this.enquiryListData.length;
                this.dataSource = new MatTableDataSource<any>(this.enquiryListData);
                this.dataSource.sort = this.sort;
            } else {
                this.enquiryListData = [];
                this.dataSource = new MatTableDataSource<any>([]);
            }
            this.listLoader = false;
        }, (error) => {
            this.listLoader = false;
            this.enquiryListData = [];
            this.dataSource = new MatTableDataSource<any>([]);
        });
    }

    deleteEnquiryDetails(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this enquiry?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                this.campusService.deleteStudyAbroad(id).subscribe((res) => {
                    const isSuccess = res.response_code === 1 || res.response_code === '1' || res.response_code === '200' || res.response_code === 200 || res.response_message === "Success";
                    if (isSuccess) {
                        this.getEnquiryList();
                        Swal.fire('Deleted!', 'Enquiry has been deleted.', 'success');
                    } else {
                        Swal.fire({ icon: 'warning', text: res.response_message || 'Failed to delete' });
                    }
                });
            }
        });
    }

    getExcel() {
        const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(this.enquiryDetails.nativeElement);
        const wb: xlsx.WorkBook = xlsx.utils.book_new();
        ws['!cols'][9] = { hidden: true };
        xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
        xlsx.writeFile(wb, 'studyAbroad_enquiries.xlsx');
    }

    updateStatus(id, status) {
        this.campusService.updateStudyAbroadStatus(id, status).subscribe((res) => {
            const isSuccess = res.response_code === 1 || res.response_code === '1' || res.response_code === '200' || res.response_code === 200 || res.response_message === "Success";
            if (isSuccess) {
                this.getEnquiryList();
                Swal.fire('', 'Status updated successfully.', 'success');
            }
        });
    }

    sendEnquiryResponse() {
        this.addLoader = true;
        let email = this.enquiryDetailsById.email;
        let enquiryId = this.enquiryDetailsById.id;
        let enquiry = this.responseForm.value.enquiry;
        let response = this.responseForm.value.response;

        this.campusService.sendStudyAbroadResponse(email, enquiry, response, enquiryId).subscribe((res) => {
            this.addLoader = false;
            if (res.response_code === 1 || res.response_code === '1' || res.response_message?.includes('success')) {
                Swal.fire('', 'Response sent successfully', 'success');
                this.responseForm.get('enquiry').setValue(null);
                this.responseForm.get('response').setValue(null);
                this.dialog.closeAll();
                this.getEnquiryList();
            } else {
                Swal.fire({ icon: 'error', text: res.response_message || 'Failed to send response' });
            }
        });
    }

    openResponseDialog(data) {
        this.responseForm.get('emailAddress').setValue(data.email);
        this.enquiryDetailsById = data;
        const dialogRef = this.dialog.open(this.callAPIDialog);
        dialogRef.afterClosed().subscribe((result) => { });
    }

    close() {
        this.dialog.closeAll();
    }

    getStatusColor(status) {
        return status === '1' || status === 1 ? 'primary' : 'warn';
    }

    getStatusText(status) {
        return status === '1' || status === 1 ? 'Attended' : 'Pending';
    }
}
