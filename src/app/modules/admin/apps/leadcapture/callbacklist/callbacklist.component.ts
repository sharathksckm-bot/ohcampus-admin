import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

interface Status {
  id: string;
  name: string;
}

@Component({
  selector: 'app-callbacklist',
  templateUrl: './callbacklist.component.html',
  styleUrls: ['./callbacklist.component.scss']
})
export class CallbacklistComponent implements OnInit {
  @ViewChild('updateDialog') updateDialog: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  displayedColumns: string[] = ['Sr.No', 'name', 'phone', 'preferred_time', 'source', 'status', 'created_at', 'actions'];
  callbackData: any[] = [];
  dataSource: any;
  searchForm: FormGroup;
  updateForm: FormGroup;
  listLoader: boolean = false;
  page: number = 1;
  pageSize: number = 10;
  startNum: number = 0;
  sortValue: string = "desc";
  recordsTotal: any = 0;
  count: number = 1;
  recordsFiltered: any = 0;
  searchLoader: boolean = false;
  selectedCallback: any;
  updateLoader: boolean = false;
  
  // Stats
  stats: any = {
    callbacks: { total: 0, pending: 0, contacted: 0, completed: 0, today: 0, this_week: 0 },
    enquiries: { total: 0 }
  };
  
  statusOptions: Status[] = [
    { id: 'pending', name: 'Pending' },
    { id: 'contacted', name: 'Contacted' },
    { id: 'completed', name: 'Completed' },
    { id: 'cancelled', name: 'Cancelled' }
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

    this.updateForm = this._formBuilder.group({
      status: ['', Validators.required],
      notes: [''],
    });

    this.listLoader = true;
    this.getCallbackList();
    this.getLeadStats();
  }

  convertDate(inputFormat) {
    if (!inputFormat) return '-';
    var d = new Date(inputFormat);
    var monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var day = d.getDate();
    var month = monthNames[d.getMonth()];
    var year = d.getFullYear();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    var minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return day + ' ' + month + ' ' + year + ' ' + hours + ':' + minutesStr + ' ' + ampm;
  }

  getCallbackList() {
    this.campusService.getCallbackRequests(this.page, this.pageSize, this.startNum, this.searchForm.value.search)
      .subscribe({
        next: (data: any) => {
          this.listLoader = false;
          this.searchLoader = false;
          this.callbackData = data.data || [];
          this.recordsTotal = data.recordsTotal || 0;
          this.recordsFiltered = data.recordsFiltered || 0;
          this.count = 1;
          this.dataSource = new MatTableDataSource(this.callbackData);
        },
        error: (error: any) => {
          this.listLoader = false;
          this.searchLoader = false;
          console.log('Failed to load callback requests', error);
          this.callbackData = [];
          this.dataSource = new MatTableDataSource([]);
          // Silent fail - no error dialog
        }
      });
  }

  getLeadStats() {
    this.campusService.getLeadStats().subscribe({
      next: (data: any) => {
        if (data && data.response_code === 1 && data.data) {
          this.stats = data.data;
        }
      },
      error: (error: any) => {
        console.log('Failed to load stats', error);
        // Silent fail
      }
    });
  }

  searchData() {
    this.page = 1;
    this.startNum = 0;
    this.searchLoader = true;
    this.getCallbackList();
  }

  handlePage(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.startNum = event.pageIndex * event.pageSize;
    this.listLoader = true;
    this.getCallbackList();
  }

  openUpdateDialog(callback: any) {
    this.selectedCallback = callback;
    this.updateForm.patchValue({
      status: callback.status,
      notes: callback.notes || ''
    });
    this.dialog.open(this.updateDialog, {
      width: '500px'
    });
  }

  updateStatus() {
    if (this.updateForm.invalid) {
      return;
    }
    
    this.updateLoader = true;
    this.campusService.updateCallbackStatus(
      this.selectedCallback.id,
      this.updateForm.value.status,
      this.updateForm.value.notes,
      null
    ).subscribe({
      next: (data: any) => {
        this.updateLoader = false;
        if (data.response_code === 1) {
          Swal.fire('Success', 'Status updated successfully', 'success');
          this.dialog.closeAll();
          this.getCallbackList();
          this.getLeadStats();
        } else {
          Swal.fire('Error', data.message || 'Failed to update status', 'error');
        }
      },
      error: (error: any) => {
        this.updateLoader = false;
        Swal.fire('Error', 'Failed to update status', 'error');
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'warn';
      case 'contacted': return 'accent';
      case 'completed': return 'primary';
      case 'cancelled': return '';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
