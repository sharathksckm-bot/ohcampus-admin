import { ChangeDetectionStrategy, Component, AfterViewInit, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-alluser',
  templateUrl: './alluser.component.html',
  styleUrls: ['./alluser.component.scss']
})
export class AlluserComponent implements OnInit {
  @ViewChild(MatPaginator) paginatior: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Sr.No','f_name', 'email', 'phone', 'type', 'status','create_date', 'actions'];
  usersData: any[];
  userListData: any[];
  dataSource : any;
  userList : FormGroup
  listLoader:boolean = false;
  length: number;
  page: number = 1;
  pageSize: number = 10;
  startNum:  number = 0;
  sortValue: string = "desc";
  recordsTotal: any;
  count: number = 1;
  recordsFiltered: any;
  columnIndex: number = 6;
  searchLoader : boolean = false;
    currentUser: any;
    type: any;

  constructor(
         private _formBuilder: FormBuilder,
         private campusService : CampusService,
         public _route: Router,
         ){ }

  ngOnInit() {
    this.userList = this._formBuilder.group({
      search: [''],
   });
   this.listLoader = true
   this.getUsers();
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.startNum = (this.pageSize * (event.pageIndex))
    this.getUsers();
  }

  convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    // var d = new Date(inputFormat);

    var monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    var d = new Date(inputFormat);
    var day = pad(d.getDate());
    var month = monthNames[d.getMonth()];
    var year = d.getFullYear();
    // return ([ pad(d.getDate()),pad(d.getMonth()+1),d.getFullYear()].join('/'));
    return [day, month, year].join(' ');
  }

  addNewUser(){
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
            this.type = this.currentUser.type;
            if(this.type.toUpperCase()=='EMPLOYEE'){
                Swal.fire({
                    title: 'Sorry, you do not have permission to add new users',
                    icon : 'warning'

                }

                  );
                //alert('This user has not access to add new user.please contact administration.');
            }
            else{
                this._route.navigate(['apps/user/addnewuser']);

            }
  }

  applyFilter(filterValue: string) {

    this.searchLoader = true
    this.getUsers();
    setTimeout(() => { this.searchLoader = false; }, 500);
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSortChange(event: MatSort) {
    this.sortValue = event.direction
    this.columnIndex = this.displayedColumns.indexOf(event.active);
    this.getUsers();
  }

  getUsers(){
    this.campusService.getUsers(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.userList.value.search).subscribe((res) =>{
      this.usersData = res.data;
      this.recordsTotal = res.recordsTotal
      this.recordsFiltered = res.recordsFiltered
    if(this.usersData?.length != 0){
        this.dataSource = new MatTableDataSource<any>(this.usersData);
        // this.dataSource.paginator = this.paginatior;
        this.dataSource.sort = this.sort;
        this.listLoader = false;
    }else{
      this.listLoader = false;
    }
    });
  }


  editUserDetails(userId) {
    let user_id = userId;
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.type = this.currentUser.type;
    if(this.type.toUpperCase()=='EMPLOYEE'){
        Swal.fire({
            title: 'Sorry, you do not have permission to add new users',
            icon : 'warning'

        }

          );
        //alert('This user has not access to add new user.please contact administration.');
    }
    else{
        this._route.navigate(['apps/user/addnewuser/update/'+ user_id]);

    }

  }

  deleteUserDetails(UserId){
    let userId = UserId
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete user details',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.campusService.deleteUserDetails(userId).subscribe((res) =>{
            if(res.response_message == "Success"){
              this.getUsers()
              Swal.fire(
                'Deleted!',
                'User details has been deleted.',
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
  getStatusClass(status: string): string {
    if (!status) {
        return 'other-status';
    }
    switch (status.toLowerCase()) {
      case 'active':
        return 'active-status';
      case 'deactive':
        return 'inactive-status';
      default:
        return 'other-status';
    }
  }
}


