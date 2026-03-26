import { ChangeDetectionStrategy, Component, AfterViewInit, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-colleges',
  templateUrl: './colleges.component.html',
  styleUrls: ['./colleges.component.scss']
})

export class CollegesComponent implements OnInit {
  @ViewChild(MatPaginator) paginatior: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Sr.No','title','registraion_type', 'map_location', 'state','created_by_name','create_date','updated_by_name','updated_date', 'status','views','actions'];
  collegeListData: any[];
  dataSource : any;
  collegeList : FormGroup
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
      this.collegeList = this._formBuilder.group({
        search: [''],
     });
     this.listLoader = true
     this.getClgList();
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

    toggleDescription(element: any): void {
      element.showFullDescription = !element.showFullDescription;
    }

    onPageChange(event: PageEvent): void {
      this.page = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      this.startNum = (this.pageSize * (event.pageIndex))
      this.getClgList();
    }

    addNewCollege(){
      this._route.navigate(['apps/college/addcolleges']);
    }

    applyFilter(filterValue: string) {
      this.searchLoader = true
      this.getClgList();
      setTimeout(() => { this.searchLoader = false; }, 500);
    }

    onSortChange(event: MatSort) {
      this.sortValue = event.direction
      this.getClgList();
    }

    getClgList(){
      this.campusService.getClgList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.collegeList.value.search).subscribe((res) =>{
        this.collegeListData = res.data;
        this.recordsTotal = res.recordsTotal
        this.recordsFiltered = res.recordsFiltered
      if(this.collegeListData?.length != 0){
          this.dataSource = new MatTableDataSource<any>(this.collegeListData);
          // this.dataSource.paginator = this.paginatior;
          this.dataSource.sort = this.sort;
          this.listLoader = false;
      }else{
        this.listLoader = false;
      }
      });
    }

    editCollegeDetails(clgId) {
        let clg_Id = clgId;
        const url = 'apps/college/editcollegedetails/update/' + clg_Id;
        window.open(url, '_blank');
      }


    // window.open(this.pdf, "_blank");
    viewCollegeDetails(ClgId){
    this.link ="https://ohcampus.com/collegeDetails/"+ClgId
   //  this.link ="https://win.k2key.in/ohcampus/collegeDetails/"+ClgId
     window.open(this.link, "_blank");
    }

    deleteCollegeDetails(ClgId){
      let clg_id = ClgId
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to delete college details',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.campusService.deleteCollege(clg_id).subscribe((res) =>{
              if(res.response_message == "Success"){
                this.getClgList()
                Swal.fire(
                  'Deleted!',
                  'College details has been deleted.',
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
