import { Component, OnInit,TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import saveAs from 'file-saver';

@Component({
  selector: 'app-kcetcutofflist',
  templateUrl: './kcetcutofflist.component.html',
  styleUrls: ['./kcetcutofflist.component.scss']
})
export class KcetcutofflistComponent  implements OnInit {
    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;

    displayedColumns: string[] = ['Sr.No','round','year','collegename','category','course','action'];
    dataSource : any
    @ViewChild(MatPaginator) paginator: MatPaginator;
    faqsListData: any[];
    ViewMoreListData: any[];

    @ViewChild(MatSort) sort: MatSort;
    faqsList : FormGroup
    page: number = 1;
    pageSize: number = 10;
    startNum:  number = 0;
    listLoader:boolean = false;
    Loader : boolean = false;
    sortValue: string = "desc";
    recordsTotal: any;
    recordsFiltered: any;
    columnIndex: number = 0;
    CategoryList: any;
    searchLoader : boolean = false;
    kcetcutofflist: any;
    collegename: any;
    coursename: any;
    category: any;
  getSampleCSV: any;


  constructor(
      private _formBuilder: FormBuilder,
      private campusService : CampusService,
      public _route: Router,
      public dialog: MatDialog
  ) { }

  ngOnInit(): void {
      this.faqsList = this._formBuilder.group({
        search: [''],
     });
     this.listLoader = true
    // this.getKCETCutOffList()
     this.getKCETCutOffList()
    //  this.viewMoreKCET(Id)

  }

  toggleDescription(element: any): void {
      element.showFullDescription = !element.showFullDescription;
  }


  getKCETCutOffList(){
    this.campusService.getKCETCutOffList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.faqsList.value.search).subscribe((res) =>{
      this.kcetcutofflist = res.data
      console.log('kcetlist',this.kcetcutofflist)
      // this.kcetid =
      this.recordsTotal = res.recordsTotal
      this.recordsFiltered = res.recordsFiltered
    if(this.kcetcutofflist?.length != 0){
      this.dataSource = new MatTableDataSource<any>(this.kcetcutofflist);
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
      this.getKCETCutOffList()
  }

  addcutoff(){
      this._route.navigate(['apps/cutoffkcet/addkcetcutoff']);
  }

  applyFilter(filterValue: string) {
      // this.dataSource.filter = filterValue.trim().toLowerCase();
      this.searchLoader = true
      this.getKCETCutOffList()
      setTimeout(() => { this.searchLoader = false; }, 500);
  }

  onSortChange(event: MatSort) {
      this.sortValue = event.direction
      this.columnIndex = this.displayedColumns.indexOf(event.active);
      this.getKCETCutOffList()
  }



//   deleteFaq(faqsId){
//       let faqs_id = faqsId
//         Swal.fire({
//           title: 'Are you sure?',
//           text: 'You want to delete FAQs details',
//           icon: 'warning',
//           showCancelButton: true,
//           confirmButtonText: 'Yes',
//           cancelButtonText: 'Cancel'
//         }).then((result) => {
//           if (result.isConfirmed) {
//             this.campusService.deleteFaq(faqs_id).subscribe((res) =>{
//               if(res.response_message == "Success"){
//                 this.getKCETCutOffList()
//                 Swal.fire(
//                   'Deleted!',
//                   'Your FAQs details has been deleted.',
//                   'success'
//                 );
//               }
//               else if(res.response_code=="300"){
//                   Swal.fire({ icon: 'warning',text : res.response_message
//               }
//                     );
//               }

//             });
//           } else {
//           }

//       })
//   }
  close() {
    this.dialog.closeAll();
  }

  // openImageDialog(Id) {
  //   alert(Id);
  // }

  viewMoreKCET(Id){
    // let id="1"
    const dialogRef = this.dialog.open(this.callAPIDialog);

    this.campusService.viewMoreKCET(Id).subscribe((res) =>{
      this.ViewMoreListData = res.response_data
      this.collegename = res.collegename
      this.coursename = res.coursename
      this.category = res.categoryname


    })
  }

getDetailsById(id) {

  let cutoff_id = id;
  this._route.navigate(['apps/cutoffkcet/addkcetcutoff/update',cutoff_id]);
}

  deleteKCET(Id){
    let kcetid = Id
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to delete KCET CutOff details',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.campusService.deleteKCET(kcetid).subscribe((res) =>{
              if(res.response_message == "Success"){
                this.getKCETCutOffList()
                Swal.fire(
                  'Deleted!',
                  'Your KCET CutOff details has been deleted.',
                  'success'
                );
              }
              else if(res.response_code=="400"){
                  Swal.fire({ icon: 'warning',text : res.response_message
              }
                    );
              }

            });
          } else {
          }

      })
  }

  downloadCSV(): void {
    this.campusService.getSampleCSV().subscribe((buffer) => {
      console.log("API Response:", buffer.samplecsv);

      const data: Blob = new Blob([buffer.samplecsv], {
        type: "text/csv;charset=utf-8"
      });
      saveAs(buffer.samplecsv, "samplecsv.csv");
    });
  }


importKCETcsv(event: any) {
    console.log(event);
    const selectedFile = event.target.files[0];
    console.log(selectedFile.name);
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    this.campusService.importKCETcsv(formData).subscribe(res => {
        if(res.response_code == 200)
            {
                Swal.fire({ icon: 'success',text : 'file imported successfully !'});
                this.getKCETCutOffList();
            }
            else
            {
                Swal.fire({ icon: 'warning',text : res.response_message});
                this.getKCETCutOffList();
            }
    });
  }

  exportToExcel(): void {
    if (!this.faqsListData || this.faqsListData.length === 0) {
      Swal.fire({ icon: 'info', text: 'No data to export' });
      return;
    }

    const headers = ['Round', 'Year', 'College Name', 'Category', 'Course', 'Closing Rank'];
    const rows = this.faqsListData.map(c => [
      c.round,
      c.year,
      c.collegename || c.college_name,
      c.category,
      c.course,
      c.closing_rank || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c || ''}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, `kcet_cutoff_export_${new Date().toISOString().split('T')[0]}.csv`);
  }
}


