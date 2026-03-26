import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from "app/config";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-management-seat-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ManagementSeatListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    
    dataSource = new MatTableDataSource<any>([]);
    displayedColumns: string[] = ['student_name', 'mobile', 'email', 'state', 'city', 'category', 'course_level', 'interested_courses', 'create_date', 'status', 'actions'];
    
    loading = false;
    totalRecords = 0;
    pageSize = 10;
    currentPage = 0;
    searchText = '';
    statusFilter = '';
    
    // Stats
    stats = {
        total: 0,
        pending: 0,
        attended: 0,
        converted: 0
    };
    
    // Dialog states
    showDetailDialog = false;
    showResponseDialog = false;
    selectedEnquiry: any = null;
    responseText = '';
    
    statusOptions = [
        { value: '', label: 'All Status' },
        { value: '0', label: 'Pending' },
        { value: '1', label: 'Attended' },
        { value: '2', label: 'In Progress' },
        { value: '3', label: 'Converted' },
        { value: '4', label: 'Not Interested' }
    ];

    constructor(
        private http: HttpClient,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.loadStats();
        this.loadData();
    }

    loadStats(): void {
        this.http.post<any>(`${config.apiurl3}ManagementSeat/getStats`, {})
            .subscribe({
                next: (res) => {
                    if (res.response_code === '200') {
                        this.stats = res.response_data || this.stats;
                    }
                }
            });
    }

    loadData(): void {
        this.loading = true;
        const payload = {
            startNum: this.currentPage * this.pageSize,
            pageSize: this.pageSize,
            search: this.searchText,
            statusFilter: this.statusFilter,
            sortValue: 'desc'
        };
        
        this.http.post<any>(`${config.apiurl3}ManagementSeat/getManagementSeatList`, payload)
            .subscribe({
                next: (res) => {
                    this.dataSource.data = res.data || [];
                    this.totalRecords = res.recordsFiltered || 0;
                    this.loading = false;
                },
                error: () => {
                    this.loading = false;
                    this.snackBar.open('Failed to load data', 'Close', { duration: 3000 });
                }
            });
    }

    onPageChange(event: PageEvent): void {
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadData();
    }

    search(): void {
        this.currentPage = 0;
        this.loadData();
    }

    applyFilter(value: string): void {
        this.searchText = value;
        this.search();
    }

    viewDetails(row: any): void {
        this.selectedEnquiry = row;
        this.showDetailDialog = true;
    }

    closeDetailDialog(): void {
        this.showDetailDialog = false;
        this.selectedEnquiry = null;
    }

    openResponseDialog(row: any): void {
        this.selectedEnquiry = row;
        this.responseText = '';
        this.showResponseDialog = true;
    }

    closeResponseDialog(): void {
        this.showResponseDialog = false;
        this.responseText = '';
    }

    sendResponse(): void {
        if (!this.responseText.trim()) {
            this.snackBar.open('Please enter a response', 'Close', { duration: 3000 });
            return;
        }
        
        this.loading = true;
        const payload = {
            enquiryId: this.selectedEnquiry.id,
            email: this.selectedEnquiry.email,
            enquiry: `Student: ${this.selectedEnquiry.student_name}\nCourse: ${this.selectedEnquiry.interested_courses}\nLocation: ${this.selectedEnquiry.preferred_location}`,
            response: this.responseText
        };
        
        this.http.post<any>(`${config.apiurl3}ManagementSeat/sendResponse`, payload)
            .subscribe({
                next: (res) => {
                    if (res.response_code === '200') {
                        this.snackBar.open('Response sent successfully', 'Close', { duration: 3000 });
                        this.closeResponseDialog();
                        this.loadData();
                        this.loadStats();
                    } else {
                        this.snackBar.open(res.response_message || 'Failed to send response', 'Close', { duration: 3000 });
                    }
                    this.loading = false;
                },
                error: () => {
                    this.loading = false;
                    this.snackBar.open('Failed to send response', 'Close', { duration: 3000 });
                }
            });
    }

    updateStatus(row: any, status: string): void {
        this.http.post<any>(`${config.apiurl3}ManagementSeat/updateStatus`, {
            id: row.id,
            status: status
        }).subscribe({
            next: (res) => {
                if (res.response_code === '200') {
                    this.snackBar.open('Status updated', 'Close', { duration: 3000 });
                    this.loadData();
                    this.loadStats();
                } else {
                    this.snackBar.open(res.response_message || 'Failed to update status', 'Close', { duration: 3000 });
                }
            },
            error: () => {
                this.snackBar.open('Failed to update status', 'Close', { duration: 3000 });
            }
        });
    }

    deleteEnquiry(row: any): void {
        if (confirm('Are you sure you want to delete this enquiry?')) {
            this.http.post<any>(`${config.apiurl3}ManagementSeat/deleteManagementSeat`, { id: row.id })
                .subscribe({
                    next: (res) => {
                        if (res.response_code === '200') {
                            this.snackBar.open('Enquiry deleted', 'Close', { duration: 3000 });
                            this.loadData();
                            this.loadStats();
                        } else {
                            this.snackBar.open(res.response_message || 'Failed to delete', 'Close', { duration: 3000 });
                        }
                    },
                    error: () => {
                        this.snackBar.open('Failed to delete', 'Close', { duration: 3000 });
                    }
                });
        }
    }

    exportToExcel(): void {
        this.loading = true;
        this.http.post<any>(`${config.apiurl3}ManagementSeat/exportList`, {
            statusFilter: this.statusFilter,
            search: this.searchText
        }).subscribe({
            next: (res) => {
                if (res.response_code === '200') {
                    this.downloadCSV(res.data);
                } else {
                    this.snackBar.open('Failed to export', 'Close', { duration: 3000 });
                }
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.snackBar.open('Failed to export', 'Close', { duration: 3000 });
            }
        });
    }

    downloadCSV(data: any[]): void {
        const headers = ['Sr.No', 'Student Name', 'Mobile', 'Email', 'State', 'City', 'Category', 'Course Level', 'Interested Courses', 'Preferred Location', 'Preferred College', 'Created Date', 'Status', 'Attended By', 'Attended Date'];
        const csvRows = [headers.join(',')];
        
        data.forEach(row => {
            const values = [
                row.sr_no,
                `"${row.student_name || ''}"`,
                row.mobile,
                row.email,
                `"${row.state || ''}"`,
                `"${row.city || ''}"`,
                `"${row.category || ''}"`,
                `"${row.course_level || ''}"`,
                `"${row.interested_courses || ''}"`,
                `"${row.preferred_location || ''}"`,
                `"${row.preferred_college || ''}"`,
                row.create_date,
                row.status,
                `"${row.attended_by || ''}"`,
                row.attended_date
            ];
            csvRows.push(values.join(','));
        });
        
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `management_seat_enquiries_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
    }

    getStatusClass(status: string): string {
        const statusClasses: { [key: string]: string } = {
            '0': 'bg-yellow-100 text-yellow-800',
            '1': 'bg-blue-100 text-blue-800',
            '2': 'bg-purple-100 text-purple-800',
            '3': 'bg-green-100 text-green-800',
            '4': 'bg-red-100 text-red-800'
        };
        return statusClasses[status] || 'bg-gray-100 text-gray-800';
    }
}
