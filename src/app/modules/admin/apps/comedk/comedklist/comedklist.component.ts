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
  selector: 'app-comedklist',
  templateUrl: './comedklist.component.html',
  styleUrls: ['./comedklist.component.scss']
})
export class ComedklistComponent  implements OnInit {
    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;

    displayedColumns: string[] = ['Sr.No','round','year','collegename','category','rank','course','action'];
    dataSource : any
    @ViewChild(MatPaginator) paginator: MatPaginator;
    faqsListData: any[];
    ViewMoreListData: any[];

    @ViewChild(MatSort) sort: MatSort;
    comedkList : FormGroup
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
    comedklist: any;
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
      this.comedkList = this._formBuilder.group({
        search: [''],
     });
     this.listLoader = true
    // this.getcomedklist()
     this.getCOMEDKCutOffList()
    //  this.viewMoreKCET(Id)

  }

  toggleDescription(element: any): void {
      element.showFullDescription = !element.showFullDescription;
  }


  getCOMEDKCutOffList(){
    this.campusService.getCOMEDKCutOffList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.comedkList.value.search).subscribe((res) =>{
      this.comedklist = res.data
      this.recordsTotal = res.recordsTotal
      this.recordsFiltered = res.recordsFiltered
    if(this.comedklist?.length != 0){
      this.dataSource = new MatTableDataSource<any>(this.comedklist);
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
      this.getCOMEDKCutOffList()
  }

  addcmedk(){
     this._route.navigate(['apps/comedk/addcomedk']);
  }

  applyFilter(filterValue: string) {
      // this.dataSource.filter = filterValue.trim().toLowerCase();
      this.searchLoader = true
      this.getCOMEDKCutOffList()
      setTimeout(() => { this.searchLoader = false; }, 500);
  }

  onSortChange(event: MatSort) {
      this.sortValue = event.direction
      this.columnIndex = this.displayedColumns.indexOf(event.active);
      this.getCOMEDKCutOffList()
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
//                 this.getcomedklist()
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
     let comedk_id =id;
   this._route.navigate(['apps/comedk/addcomedk/update',comedk_id]);
}

deleteCOMEDK(Id){

    let comedid = Id
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to delete COMEDK CutOff details',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.campusService.deleteCOMEDK(comedid).subscribe((res) =>{
              if(res.response_message == "Success"){
                this.getCOMEDKCutOffList()
                Swal.fire(
                  'Deleted!',
                  'Your COMEDK CutOff details has been deleted.',
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
    let type="COMEDK"
    this.campusService.getSampleCSV1(type).subscribe((buffer) => {
      console.log("API Response:", buffer.samplecsv);

      const data: Blob = new Blob([buffer.samplecsv], {
        type: "text/csv;charset=utf-8"
      });
      saveAs(buffer.samplecsv, "samplecsv.csv");
    });
  }


  importCOMEDKcsv(event: any) {
    console.log(event)
    const selectedFile = event.target.files[0];
    console.log(selectedFile.name);
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    this.campusService.importCOMEDKcsv(formData).subscribe(res => {
        if(res.response_code == 200)
            {
                Swal.fire({ icon: 'success',text : 'file imported successfully !'});
                this.getCOMEDKCutOffList();
            }
            else
            {
                Swal.fire({ icon: 'warning',text : res.response_message});
                this.getCOMEDKCutOffList();
            }
    });
}
  }

  function Id(Id: any) {
    throw new Error('Function not implemented.');
  }


