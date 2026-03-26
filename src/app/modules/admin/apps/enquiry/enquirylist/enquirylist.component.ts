import { ChangeDetectionStrategy, Component, AfterViewInit, OnDestroy, OnInit, ViewChild, ViewEncapsulation, TemplateRef, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as xlsx from 'xlsx';
interface Status {
  id: string;
  name: string;
}

@Component({
  selector: 'app-enquirylist',
  templateUrl: './enquirylist.component.html',
  styleUrls: ['./enquirylist.component.scss']
})
export class EnquirylistComponent implements OnInit {

  status: Status[] = [
    {id: '1', name: 'Attended'},
    {id: '0', name: 'Pending'},
  ];
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  @ViewChild('enquiryDetails', { static: false }) enquiryDetails: ElementRef;
  @ViewChild(MatPaginator) paginatior: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Sr.No', 'name','email','phone','message','inquiry_type','college', 'cityname','statename','create_date','attended_by','attended_date','actions'];
  enquiryListData: any[];
  dataSource : any;
  enquiryList : FormGroup
  responseForm : FormGroup
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
  pdf: any;
  enquiryDetailsById: any;
  addLoader: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public _route: Router,
    public dialog: MatDialog,
    ){ }

    ngOnInit() {
      this.enquiryList = this._formBuilder.group({
        search: [''],
     });

     this.responseForm = this._formBuilder.group({
      enquiry: [''],
      response: [''],
      emailAddress: [''],
   });

     this.listLoader = true
     this.getEnquiryList();
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
      this.getEnquiryList();
    }

    addNewEnquiry(){
      this._route.navigate(['apps/enquiry/addenquiry']);
    }

    applyFilter(filterValue: string) {
      this.searchLoader = true
      this.getEnquiryList();
    setTimeout(() => { this.searchLoader = false; }, 500);
      // this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onSortChange(event: MatSort) {
      this.sortValue = event.direction
      // this.columnIndex = this.displayedColumns.indexOf(event.active);
      this.getEnquiryList();
    }

    pendingData:any=[];
    attendedData:any=[];
    getEnquiryList(){
      this.campusService.getEnquiryList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.enquiryList.value.search).subscribe((res) =>{
        this.enquiryListData = res.data;
        this.pdf = res.pdf
        this.recordsTotal = res.recordsTotal
        this.recordsFiltered = res.recordsFiltered
      if(this.enquiryListData?.length != 0){
          this.dataSource = new MatTableDataSource<any>(this.enquiryListData);
          // this.dataSource.paginator = this.paginatior;
          this.dataSource.sort = this.sort;
         this.listLoader = false;
      }else{
        this.listLoader = false;
      }
      });
    }

    editEnquiryDetails(enquiryId) {
      let enquiry_Id = enquiryId;
      this._route.navigate(['apps/enquiry/addenquiry/update/'+ enquiry_Id]);
    }

    deleteEnquiryDetails(EnquiryId){
      let enquiryId = EnquiryId
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to delete enquiry details',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.campusService.deleteEnquiry(enquiryId).subscribe((res) =>{
              if(res.response_message == "Success"){
                this.getEnquiryList()
                Swal.fire(
                  'Deleted!',
                  'Enquiry details has been deleted.',
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

getPdf(){
    window.open(this.pdf, "_blank");
}

getExcel() {
  const ws: xlsx.WorkSheet =  xlsx.utils.table_to_sheet(this.enquiryDetails.nativeElement);
  const wb: xlsx.WorkBook = xlsx.utils.book_new();
  ws['!cols'][11] = { hidden: true };
  xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
  xlsx.writeFile(wb, 'enquiryDetails.xlsx');
}

updateStatus(id,status){
  let type = 'inquiry'
        this.campusService.updateStatus(id,status,type).subscribe((res) =>{
          if(res.response_message == "Success"){
             this.getEnquiryList();
          Swal.fire(
            '',
            'Enquiry status updated.',
            'success'
          );
        }
    })
}

SendEnquiryResponse(){
  this.addLoader = true
  let email = this.enquiryDetailsById.email
  let enquiryId = this.enquiryDetailsById.id
  let enquiry = this.responseForm.value.enquiry
  let response = this.responseForm.value.response

  this.campusService.SendEnquiryResponse(email,enquiry,response,enquiryId).subscribe((res) =>{
    this.addLoader = false
    if(res.response_message == "Response sent successfully."){
      Swal.fire(
      '',
      'Response sent successfully',
      'success'
    );
    this.responseForm.get('enquiry').setValue(null)
    this.responseForm.get('response').setValue(null)
    this.dialog.closeAll();
    }
  });
}

editEnquiry(data) {

  this.responseForm.get('emailAddress').setValue(data.email)
  this.enquiryDetailsById = data

    const dialogRef = this.dialog.open(this.callAPIDialog);
    dialogRef.afterClosed().subscribe((result) => { });
}

close() {
    this.dialog.closeAll();
}
}
