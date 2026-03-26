import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-loanlist',
  templateUrl: './loanlist.component.html',
  styleUrls: ['./loanlist.component.scss']
})
export class LoanlistComponent implements OnInit {
  displayedColumns: string[] = ['Sr.No', 'name','type','actions'];
  dataSource : any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  loanListData: any[];
  @ViewChild(MatSort) sort: MatSort;
  loanList : FormGroup
  page: number = 1;
  pageSize: number = 10;
  startNum:  number = 0;
  listLoader:boolean = false;
  Loader : boolean = false;
  sortValue: string = "desc";
  recordsTotal: any;
  recordsFiltered: any;
  columnIndex: number = 1;
  searchLoader : boolean = false;


  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public _route: Router,
  ) { }

  ngOnInit(): void {
    this.loanList = this._formBuilder.group({
      search: [''],
   });
   this.listLoader = true
    this.getLoanList()
  }

  getLoanList(){
    this.campusService.getLoanList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.loanList.value.search).subscribe((res) =>{
      this.loanListData = res.data
      this.recordsTotal = res.recordsTotal
      this.recordsFiltered = res.recordsFiltered
    if(this.loanListData?.length != 0){
      this.dataSource = new MatTableDataSource<any>(this.loanListData);
      // this.dataSource.paginator = this.paginator;
      this.listLoader = false;
      this.dataSource.sort = this.sort;
    }else{
      this.listLoader = false;
    }
    })

  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.startNum = (this.pageSize * (event.pageIndex))
    this.getLoanList()
  }

  addLoan(){
    this._route.navigate(['apps/loans/addloan']);
  }

  applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.searchLoader = true
    this.getLoanList()
    setTimeout(() => { this.searchLoader = false; }, 500);
  }

  editLoan(loanId) {
    let loan_id = loanId;
    this._route.navigate(['apps/loans/addloan/update/'+ loan_id]);
  }

  onSortChange(event: MatSort) {
    this.sortValue = event.direction
    this.columnIndex = this.displayedColumns.indexOf(event.active);
    this.getLoanList()
  }

  deleteLoan(loanId){
    let loan_id = loanId
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete loan Details',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.campusService.deleteLoan(loan_id).subscribe((res) =>{
            if(res.response_message == "Success"){
              this.getLoanList()
              Swal.fire(
                'Deleted!',
                'Loan Details has been deleted.',
                'success'
              );
            }
            else if(res.response_code=="300"){
                Swal.fire({ icon: 'warning',text : res.response_message
            }
                  );
            }

          });
        } else {
        }

    })
  }
}
