import { ChangeDetectionStrategy, Component, AfterViewInit, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-viewevents',
  templateUrl: './viewevents.component.html',
  styleUrls: ['./viewevents.component.scss']
})
export class VieweventsComponent implements OnInit {

  @ViewChild(MatPaginator) paginatior: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Sr.No','name', 'package_type','created_by_name','create_date','updated_by_name','updated_date', 'status','actions'];
  eventListData: any[];
  dataSource : any;
  eventList : FormGroup
  listLoader:boolean = false;
  page: number = 1;
  pageSize: number = 10;
  startNum:  number = 0;
  sortValue: string = "desc";
  recordsTotal: any;
  count: number = 1;
  recordsFiltered: any;
  columnIndex: number = 1;
  searchLoader : boolean = false;
  link: string;


  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public _route: Router,
    ){ }

    ngOnInit() {
      this.eventList = this._formBuilder.group({
        search: [''],
     });
     this.listLoader = true
     this.getEventList();
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
      this.getEventList();
    }

    addNewEvent(){
      this._route.navigate(['apps/event/addevent']);
    }

    applyFilter(filterValue: string) {
      this.searchLoader = true
      this.getEventList();
      setTimeout(() => { this.searchLoader = false; }, 500);
      // this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onSortChange(event: MatSort) {
      this.sortValue = event.direction
      // this.columnIndex = this.displayedColumns.indexOf(event.active);
      this.getEventList();
    }

    getEventList(){
      this.campusService.getEventList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.eventList.value.search).subscribe((res) =>{
        this.eventListData = res.data;
        this.recordsTotal = res.recordsTotal
        this.recordsFiltered = res.recordsFiltered
      if(this.eventListData?.length != 0){
          this.dataSource = new MatTableDataSource<any>(this.eventListData);
          // this.dataSource.paginator = this.paginatior;
          this.dataSource.sort = this.sort;
         this.listLoader = false;
      }else{
        this.listLoader = false;
      }
      });
    }

    editEventDetails(eventId) {
      let event_Id = eventId;
      this._route.navigate(['apps/event/addevent/update/'+ event_Id]);
    }

    viewEventDetails(eventId){
     // this.link ="https://win.k2key.in/Oh_Campus/eventdetails/"+eventId
    this.link ="https://ohcampus.com/eventdetails/"+eventId

      window.open(this.link, "_blank");
    }

    deleteEventDetails(EventId){
      let eventId = EventId
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to delete event details',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.campusService.deleteEvent(eventId).subscribe((res) =>{
              if(res.response_message == "Success"){
                this.getEventList()
                Swal.fire(
                  'Deleted!',
                  'Event details has been deleted.',
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
