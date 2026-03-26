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

@Component({
  selector: 'app-questionsanslist',
  templateUrl: './questionsanslist.component.html',
  styleUrls: ['./questionsanslist.component.scss']
})
export class QuestionsanslistComponent implements OnInit {

    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
    @ViewChild('callAPIDialog1') callAPIDialog1: TemplateRef<any>;

    postAnswer :FormGroup;
    commentAnswer:FormGroup;
    displayedColumns: string[] = ['Sr.No','collegename','course_type','coursename','question','question_asked_by','question_view','replied','action'];
    dataSource : any
    @ViewChild(MatPaginator) paginator: MatPaginator;
    questionandanswerListData: any[];
    ViewMoreListData: any[];
    panelOpenState = false;

    @ViewChild(MatSort) sort: MatSort;
    questionandanswerList : FormGroup
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
    questionans: any;
    QAData: any;
    postAnswereData: any;
    userId: string;
    CommentData: any;
    questionAnswereData: any;
    commentData: any;
    reponseData: any;

  constructor(
      private _formBuilder: FormBuilder,
      private campusService : CampusService,
      public _route: Router,
      public dialog: MatDialog
  ) { }

  ngOnInit(): void {
      this.questionandanswerList = this._formBuilder.group({
        search: [''],
     });
     this.postAnswer = this._formBuilder.group({
      answer: [''],
   });

   this.commentAnswer = this._formBuilder.group({
    comment: [''],
 });

   const userData=JSON.parse(localStorage.getItem('currentUser'));
   this.userId= userData.userId;
   console.log(this.userId);
     this.listLoader = true
     this.getQuestionList()
    // this.viewMoreKCET(Id)

  }

  toggleDescription(element: any): void {
      element.showFullDescription = !element.showFullDescription;
  }


  getQuestionList(){
    this.campusService.getQuestionList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.questionandanswerList.value.search).subscribe((res) =>{
      this.questionans = res.data
      //console.log('kcetlist',this.questionans)
      this.recordsTotal = res.recordsTotal
      this.recordsFiltered = res.recordsFiltered
    if(this.questionans?.length != 0){
      this.dataSource = new MatTableDataSource<any>(this.questionans);
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
      this.getQuestionList()
  }

  addcutoff(){
      this._route.navigate(['apps/cutoffkcet/addkcetcutoff']);
  }


  close() {
    this.dialog.closeAll();
  }



  getDetailsById(QueId,collegeid) {
    const dialogRef = this.dialog.open(this.callAPIDialog1);
    this.campusService.getQADataByQueId(QueId,collegeid).subscribe((res) =>{
        this.CommentData = res.response_data
        console.log(this.CommentData)
       // this.collegename = res.collegename

      })
  }



  getQADataByQueId(QueId,collegeid){
    console.log(collegeid)
    // let id="1"
    const dialogRef = this.dialog.open(this.callAPIDialog);
    this.campusService.getQADataByQueId(QueId,collegeid).subscribe((res) =>{
      this.QAData = res.response_data
      console.log(this.QAData)
     // this.collegename = res.collegename

    })
  }

  postAnswere(questionId,user_id){
    console.log(questionId)

        Swal.fire({
          title: 'Success',
          text: 'Do want to post your answer ?',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        })
      .then((result) => {
        if (result.isConfirmed) {
        this.campusService.postAnswere(questionId,this.userId,this.postAnswer.value.answer).subscribe((res) =>{
        this.postAnswereData = res.response_data
        if(res.response_code==200){
            Swal.fire({
                title: 'Success',
                text: 'Your answere has been sent successfully !',
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'Cancel'
              })
        this.dialog.closeAll();
        this.getQuestionList();
        }});
      }

    })
  }



  postComment(answer_id){
    this.campusService.postComment(answer_id,this.userId,this.commentAnswer.value.comment).subscribe((res) =>{
      this.commentData = res.response_data
      if(res.response_code==200){
        Swal.fire({
          title: 'Success',
          text: 'Your comments has been sent successfully !',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Ok',
          cancelButtonText: 'Cancel'
        })
      .then((result) => {
        if (result.isConfirmed) {
        this.dialog.closeAll();
        this.getQuestionList();
        }});
      }

    })
  }
  deleteQuestion(questionId)
  {

          Swal.fire({
            title: 'Alert',
            text: 'Do you want to delete this question ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'
          })
        .then((result) => {
          if (result.isConfirmed) {
            this.campusService.deleteQuestion(questionId).subscribe((res) =>{
                this.reponseData = res.response_data
                if(res.response_code==200){
                    Swal.fire({
                        title: 'Success',
                        text: 'Your question has been deleted successfully !',
                        icon: 'success',
                        showCancelButton: true,
                        confirmButtonText: 'Ok',
                        cancelButtonText: 'Cancel'
                      })
          this.dialog.closeAll();
          this.getQuestionList();
          }


        });
        }

      })
  }
  }






