import { ChangeDetectionStrategy, Component, AfterViewInit, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-specilisationlist',
  templateUrl: './specilisationlist.component.html',
  styleUrls: ['./specilisationlist.component.scss']
})
export class SpecilisationlistComponent implements OnInit {
  @ViewChild(MatPaginator) paginatior: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Sr.No','specialisation','created_by_name','create_date','updated_by_name','updated_date', 'status','actions'];
  specialisationListData: any[];
  dataSource : any;
  specialisationList : FormGroup
  listLoader:boolean = false;
  page: number = 1;
  pageSize: number = 10;
  startNum:  number = 0;
  sortValue: string = "desc";
  recordsTotal: any;
  count: number = 1;
  recordsFiltered: any;
  columnIndex: number = 0;
  searchLoader : boolean = false;
  showFullDescription: boolean = false;
  link: string;

   constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public _route: Router,
    ){ }

    ngOnInit() {
      this.specialisationList = this._formBuilder.group({
        search: [''],
     });
     this.listLoader = true
     this.getSpecialisationList();
    }

    convertDate(inputFormat) {
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
      var seconds = pad(d.getSeconds());
      return [day, month, year].join(' ') + ' ' + [hours, minutes, seconds].join(':');
    }

    onPageChange(event: PageEvent): void {
      this.page = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      this.startNum = (this.pageSize * (event.pageIndex))
      this.getSpecialisationList();
    }

    addNewSpecialisation(){
      this._route.navigate(['apps/specilisation/addspecilisation']);
    }

    applyFilter(filterValue: string) {
      this.searchLoader = true
      this.getSpecialisationList();
      setTimeout(() => { this.searchLoader = false; }, 500);
    }

    onSortChange(event: MatSort) {
      this.sortValue = event.direction
      this.getSpecialisationList();
    }

    getSpecialisationList(){
      this.campusService.getList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.specialisationList.value.search).subscribe((res) =>{
        this.specialisationListData = res.data;
        this.recordsTotal = res.recordsTotal
        this.recordsFiltered = res.recordsFiltered
      if(this.specialisationListData?.length != 0){
          this.dataSource = new MatTableDataSource<any>(this.specialisationListData);
          // this.dataSource.paginator = this.paginatior;
          this.dataSource.sort = this.sort;
          this.listLoader = false;
      }else{
       this.listLoader = false;
       this.specialisationListData = null
       this.dataSource = new MatTableDataSource<any>(this.specialisationListData);

      }
      });
    }

    editSpecialisationDetails(speId) {
      this._route.navigate(['apps/specilisation/addspecilisation/update/'+ speId]);
    }


    deleteSpecialisationDetails(speId){
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to delete specilization details',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.campusService.deleteSpecialization(speId).subscribe((res) =>{
              if(res.response_message == "Success"){
                this.getSpecialisationList()
                Swal.fire(
                  'Deleted!',
                  'Specilization details has been deleted.',
                  'success'
                );
              }
              else if(res.response_code=="300"){
                Swal.fire({ icon: 'warning',text : res.response_message
            }
                  );
            }
            });

          }

      })
    }

}
