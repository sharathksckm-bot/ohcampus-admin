import { Component, OnInit, ViewChild, TemplateRef, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-coarses',
  templateUrl: './coarses.component.html',
  styleUrls: ['./coarses.component.scss']
})

export class CoarsesComponent implements OnInit {
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() collegeDetails: any;
  @Input() course_data: any;
  coursesForm: FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader: boolean = false;
  updateButton: boolean = false;
  Loader: boolean = false;

  retriveData: any;



  UGCourseslist: any[] = [];
  PGCourseslist: any[] = [];
  DiplomaCourseslist: any[] = [];
  DoctorialCourseslist: any[] = [];
  OtherCourseslist: any[] = [];
  postCourseslist: any[] = [];
  advMasteCourseslist: any[] = [];

  selectedUGCourses: any[] = [];
  selectedPGCourses: any[] = [];
  selectedDiplomaCourses: any[] = [];
  selectedDoctorialCourses: any[] = [];
  selectedOherCourses: any[] = [];
  selectedPostDocrCourses: any[] = [];
  selectedAdvMasterrCourses: any[] = [];

  collegeid: any;
  clgId: any;
  tmpUGCourseList: any;
  tmpPGCourseList: any;
  tmpDPCourseList: any;
  tmpDocCourseList: any;
  tmpPostDocCourseslist: any;
  tmpAdvMasterCourseslist: any;
  tmpOtherCourseslist: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService: CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router,) { }

  ngOnInit(): void {
    this.Loader = true ;
    this.coursesForm = this._formBuilder.group({
      ugcourse: [''],
      searchUg: [''],
      pgcourse: [''],
      searchPg: [''],
      diplomacourse: [''],
      searchDp: [''],
      doctorialcourse: [''],
      searchDoc: [''],
      postdoctorialcourse: [''],
      searcPostDoc: [''],
      advancedmastercourse: [''],
      searcAdvMas: [''],
      othercourse: [''],
      searchOther: ['']

    })
    this.getUGCourses()
    this.getPGCourses()
    this.getDiplomaCourse();
    this.getDoctorialCourses();
    this.getPostDocCourses('');
    this.getAdvMasterCourses();
    this.getOtherCourses();

    this.clgId = this.collegeDetails.id

    if ((this.clgId != null)) {
     
      setTimeout(() => {

   //     this.bindUgCourses()
        // this.getClgDetailsById();

        // this.bindPgCourses()
        // this.bindDiplomaCourses()
        // this.bindDoctorialCourses()
        this.bindPostDoctorialCourses()
        // this.bindAdvMasterCourses()
        // this.bindOtherCourses()
      }, 3000);
    }
  }

  ngAfterViewInit(): void {
    if ((this.clgId != null)) {
      this.updateButton = true
    }
  }

  viewCourse(courseId) {
    this._route.navigate(['apps/courseDetails/viewcourse/' + courseId + '/' + this.clgId]);
  }

  // ---------------------------------UG Courses---------------------------------//

  getUGCourses() {
    this.collegeid = this.collegeDetails.id
    this.campusService.getUGCourses(this.coursesForm.value.searchUg,this.collegeid).subscribe((res) => {
      this.UGCourseslist = res.response_data;
      this.tmpUGCourseList =  res.response_data;
      // console.log(this.UGCourseslist);
      // if ((this.clgId != null)) {
      //   this.Loader = true
      //   setTimeout(() => {

      //     this.bindUgCourses();
      //   })
      // }
      // console.log(this.UGCourseslist)
      this.UGCourseslist.forEach((itemm) => {

        // console.log(JSON.stringify(itemm));
        if (itemm.CIds != 0 && itemm.CIds != null) {
        
          console.log(itemm)
          this.selectedUGCourses.push(itemm);
          // this.changeUGSelection;
        }
      });
      this.coursesForm.get('ugcourse').setValue(this.selectedUGCourses);
      // console.log(this.coursesForm.value.ugcourse)
      this.changeUGSelection(this.coursesForm.value.ugcourse);
      this.Loader = true


    })
  }

  searchUGCourses() {
    const collegeid = this.collegeDetails.id

    const searchValue = this.coursesForm.value.searchUg.toLowerCase();
    this.UGCourseslist =   this.tmpUGCourseList ;
      this.UGCourseslist = this.UGCourseslist.filter(course => 
        course.name.toLowerCase().includes(searchValue)
      );

  
    
  }
  searchPGCourses() {
    const collegeid = this.collegeDetails.id
    const searchValue = this.coursesForm.value.searchPg.toLowerCase();
    this.PGCourseslist =   this.tmpPGCourseList ;
    this.PGCourseslist = this.PGCourseslist.filter(course => 
        course.name.toLowerCase().includes(searchValue)
      );
  }

  searchDiplomaCourses() {
    const collegeid = this.collegeDetails.id
    const searchValue = this.coursesForm.value.searchDp.toLowerCase();
    this.DiplomaCourseslist =   this.tmpDPCourseList ;
    this.DiplomaCourseslist = this.DiplomaCourseslist.filter(course => 
        course.name.toLowerCase().includes(searchValue)
      );

  }
  searchDocCourses()
  {
    const collegeid = this.collegeDetails.id
    const searchValue = this.coursesForm.value.searchDoc.toLowerCase();
    this.DoctorialCourseslist =   this.tmpDocCourseList ;
    this.DoctorialCourseslist = this.DoctorialCourseslist.filter(course => 
        course.name.toLowerCase().includes(searchValue)
      );

  }
  searchPostDocCourses()
  {
    const collegeid = this.collegeDetails.id
    const searchValue = this.coursesForm.value.searcPostDoc.toLowerCase();
    this.postCourseslist =   this.tmpPostDocCourseslist ;
    this.postCourseslist = this.postCourseslist.filter(course => 
        course.name.toLowerCase().includes(searchValue)
      );
  }
  searchAdvMasterCourses()
  {
    const collegeid = this.collegeDetails.id
    const searchValue = this.coursesForm.value.searcAdvMas.toLowerCase();
    this.advMasteCourseslist =   this.tmpAdvMasterCourseslist ;
    this.advMasteCourseslist = this.advMasteCourseslist.filter(course => 
        course.name.toLowerCase().includes(searchValue)
      );
  }

  searchOtherCourses()
  {
    const collegeid = this.collegeDetails.id
    const searchValue = this.coursesForm.value.searchOther.toLowerCase();
    this.OtherCourseslist =   this.tmpOtherCourseslist ;
    this.OtherCourseslist = this.OtherCourseslist.filter(course => 
        course.name.toLowerCase().includes(searchValue)
      );
  }
  bindUgCourses() {
    if (this.UGCourseslist != undefined) {
      // console.log(this.course_data)
      // console.log(this.UGCourseslist)
      this.course_data.forEach((item) => {


        this.UGCourseslist.forEach((itemm) => {

          // console.log(JSON.stringify(itemm));
          

          if(itemm.id ==3186) console.log(item.courseid);
          if (item.courseid == itemm.id) {
          
          
            this.selectedUGCourses.push(itemm);
            this.changeUGSelection;
          }
        });
        
        this.coursesForm.get('ugcourse').setValue(this.selectedUGCourses);
        this.changeUGSelection(this.coursesForm.value.ugcourse);
      })
    }
    this.Loader = false
  }

  // getClgDetailsById(){
  //   this.campusService.getCollegeDetailsById(this.clgId).subscribe((res) =>{
  //     this.course_data=res.course_data
  //   if(res.response_message == "Success"){
  //     if (this.UGCourseslist != undefined) {
  //       console.log(this.course_data)
  //       console.log(this.UGCourseslist)
  //       this.course_data.forEach((item) => {


  //         this.UGCourseslist.forEach((itemm) => {

  //           // console.log(JSON.stringify(itemm));
  //           if (item.courseid == itemm.id) {
  //             // alert(78)
  //             console.log(itemm)
  //             this.selectedUGCourses.push(itemm);
  //             this.changeUGSelection;
  //           }
  //         });
  //         console.log(this.selectedUGCourses)
  //         this.coursesForm.get('ugcourse').setValue(this.selectedUGCourses);
  //         this.changeUGSelection(this.coursesForm.value.ugcourse);
  //       })
  //     }
  //     this.Loader = false
  //   }
  // })
  // }

  changeUGSelection(selectedCourses: any) {
    this.selectedUGCourses = selectedCourses;
    // console.log(this.selectedUGCourses)
  }

  // removeUgCourse(index: number, id: any) {
  //     if (id != null) {
  //       this.selectedUGCourses = this.selectedUGCourses.filter(item => item.id !== id);
  //       const ugCoursesControl = this.coursesForm.get('ugcourse');
  //       if (ugCoursesControl) {
  //         ugCoursesControl.setValue(this.selectedUGCourses);
  //       }
  //     }
  // }
  removeUgCourse(index: number, id: any) {

    if (id != null) {
      let courseid = id
      this.collegeid = this.collegeDetails.id

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete college UG course',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.campusService.deleteClgCourses(courseid, this.collegeid).subscribe((res) => {
            if (res.response_message == "Success") {
              //this.getClgList()
              Swal.fire(
                'Deleted!',
                'UG course has been deleted.',
                'success'
              );
              this.selectedUGCourses = this.selectedUGCourses.filter(item => item.id !== id);
              const ugCoursesControl = this.coursesForm.get('ugcourse');
              // console.log(this.selectedUGCourses)
              if (ugCoursesControl) {
                ugCoursesControl.setValue(this.selectedUGCourses);
              }
            }
            else if (res.response_code == "300") {
              Swal.fire({
                icon: 'warning', text: res.response_message
              }
              );
            }
          });

        } else {
        }

      })

    }
  }

  // ---------------------------------PG Courses---------------------------------//

  getPGCourses() {
    this.collegeid = this.collegeDetails.id

    this.campusService.getPGCourses(this.coursesForm.value.searchPg,this.collegeid).subscribe((res) => {
      this.PGCourseslist = res.response_data ;
      this.tmpPGCourseList = res.response_data ;
      // console.log('PGCourseslist',this.PGCourseslist );
      this.PGCourseslist.forEach((item) => {
      if (item.CIds != 0 && item.CIds != null) {
        this.selectedPGCourses.push(item);
        // this.changePGSelection;
      }
    });
    this.coursesForm.get('pgcourse').setValue(this.selectedPGCourses);
    this.changePGSelection(this.coursesForm.value.pgcourse);
    this.Loader = true

  })
    
  }

  bindPgCourses() {
    if (this.PGCourseslist != undefined) {
      this.course_data.forEach((item) => {
        this.PGCourseslist.forEach((itemm) => {
          if (item.courseid == itemm.id) {
            this.selectedPGCourses.push(itemm);
            this.changePGSelection;
          }
        });
        this.coursesForm.get('pgcourse').setValue(this.selectedPGCourses);
        this.changePGSelection(this.coursesForm.value.pgcourse);
      })
    }
    this.Loader = false
  }

  changePGSelection(selectedCourses: any[]) {
    this.selectedPGCourses = selectedCourses;
  }

  // removePGCourse(index: number, id: any) {
  //     if (id != null) {
  //       this.selectedPGCourses = this.selectedPGCourses.filter(item => item.id !== id);
  //       const pgCoursesControl = this.coursesForm.get('pgcourse');
  //       if (pgCoursesControl) {
  //         pgCoursesControl.setValue(this.selectedPGCourses);
  //       }
  //     }
  // }

  removePGCourse(index: number, id: any) {
    // if (id != null) {
    //   this.selectedPGCourses = this.selectedPGCourses.filter(item => item.id !== id);
    //   const pgCoursesControl = this.coursesForm.get('pgcourse');
    //   if (pgCoursesControl) {
    //     pgCoursesControl.setValue(this.selectedPGCourses);
    //   }
    // }

    if (id != null) {
      let courseid = id
      this.collegeid = this.collegeDetails.id

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete college PG course',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.campusService.deleteClgCourses(courseid, this.collegeid).subscribe((res) => {
            if (res.response_message == "Success") {
              //this.getClgList()
              Swal.fire(
                'Deleted!',
                'PG course has been deleted.',
                'success'
              );
              this.selectedPGCourses = this.selectedPGCourses.filter(item => item.id !== id);
              const pgCoursesControl = this.coursesForm.get('pgcourse');
              if (pgCoursesControl) {
                pgCoursesControl.setValue(this.selectedPGCourses);
              }
            }
            else if (res.response_code == "300") {
              Swal.fire({
                icon: 'warning', text: res.response_message
              }
              );
            }
          });

        } else {
        }

      })

    }
  }


  // ---------------------------------Diploma Courses---------------------------------//

  getDiplomaCourse() {
    this.collegeid = this.collegeDetails.id

    this.campusService.getDiplomaCourses(this.coursesForm.value.searchDp,this.collegeid).subscribe((res) => {
      this.DiplomaCourseslist = res.response_data
      this.tmpDPCourseList =  res.response_data;

      this.DiplomaCourseslist.forEach((item) => {

        if (item.CIds != 0 && item.CIds != null) {
          this.selectedDiplomaCourses.push(item);
          // this.changeDiplomaSelection;

        }
      });
      this.coursesForm.get('diplomacourse').setValue(this.selectedDiplomaCourses);
      this.changeDiplomaSelection(this.coursesForm.value.diplomacourse);
      this.Loader = true
    })

    
  }

  bindDiplomaCourses() {
    if (this.DiplomaCourseslist != undefined) {
      this.course_data.forEach((item) => {
        this.DiplomaCourseslist.forEach((itemm) => {

          if (item.courseid === itemm.id) {
            this.selectedDiplomaCourses.push(itemm);
            this.changeDiplomaSelection;

          }
        });
        this.coursesForm.get('diplomacourse').setValue(this.selectedDiplomaCourses);
        this.changeDiplomaSelection(this.coursesForm.value.diplomacourse);
      })
    }
    this.Loader = false
  }

  changeDiplomaSelection(selectedCourses: any[]) {
    this.selectedDiplomaCourses = selectedCourses;
  }

  // removeDiplomaCourse(index: number, id: any) {
  //     if (id != null) {
  //       this.selectedDiplomaCourses = this.selectedDiplomaCourses.filter(item => item.id !== id);
  //       const diplomaCoursesControl = this.coursesForm.get('diplomacourse');
  //       if (diplomaCoursesControl) {
  //         diplomaCoursesControl.setValue(this.selectedDiplomaCourses);
  //       }
  //     }
  // }

  removeDiplomaCourse(index: number, id: any) {
    // if (id != null) {
    //   this.selectedDiplomaCourses = this.selectedDiplomaCourses.filter(item => item.id !== id);
    //   const diplomaCoursesControl = this.coursesForm.get('diplomacourse');
    //   if (diplomaCoursesControl) {
    //     diplomaCoursesControl.setValue(this.selectedDiplomaCourses);
    //   }
    // }
    if (id != null) {
      let courseid = id
      this.collegeid = this.collegeDetails.id

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete college Diploma course',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.campusService.deleteClgCourses(courseid, this.collegeid).subscribe((res) => {
            if (res.response_message == "Success") {
              //this.getClgList()
              Swal.fire(
                'Deleted!',
                'Diploma course has been deleted.',
                'success'
              );
              this.selectedDiplomaCourses = this.selectedDiplomaCourses.filter(item => item.id !== id);
              const diplomaCoursesControl = this.coursesForm.get('diplomacourse');
              if (diplomaCoursesControl) {
                diplomaCoursesControl.setValue(this.selectedDiplomaCourses);
              }
            }
            else if (res.response_code == "300") {
              Swal.fire({
                icon: 'warning', text: res.response_message
              }
              );
            }
          });

        } else {
        }

      })

    }
  }

  // ---------------------------------Doctorial Courses---------------------------------//

  getDoctorialCourses() {
    this.collegeid = this.collegeDetails.id

    this.campusService.getDoctorialCourses(this.coursesForm.value.searchDoc,this.collegeid).subscribe((res) => {
      this.DoctorialCourseslist = res.response_data
      this.tmpDocCourseList = res.response_data
      this.DoctorialCourseslist.forEach((item) => {

        if (item.CIds != 0 && item.CIds != null) {
          this.selectedDoctorialCourses.push(item);
          // this.changeDoctorialSelection;

        }
      });
      this.coursesForm.get('doctorialcourse').setValue(this.selectedDoctorialCourses);
      this.changeDoctorialSelection(this.coursesForm.value.doctorialcourse);
      this.Loader = true
    })

    
  }

  changeDoctorialSelection(selectedCourses: any[]) {
    this.selectedDoctorialCourses = selectedCourses;
  }

  bindDoctorialCourses() {
    if (this.DoctorialCourseslist != undefined) {
      this.course_data.forEach((item) => {
        this.DoctorialCourseslist.forEach((itemm) => {

          if (item.courseid === itemm.id) {
            this.selectedDoctorialCourses.push(itemm);
            this.changeDoctorialSelection;

          }
        });
        this.coursesForm.get('doctorialcourse').setValue(this.selectedDoctorialCourses);
        this.changeDoctorialSelection(this.coursesForm.value.doctorialcourse);
      })
    }
    this.Loader = false
  }

  // removeDoctorialCourses(index: number, id: any) {
  //   if (id != null) {
  //     this.selectedDoctorialCourses = this.selectedDoctorialCourses.filter(item => item.id !== id);
  //     const doctorialCoursesControl = this.coursesForm.get('doctorialcourse');
  //     if (doctorialCoursesControl) {
  //       doctorialCoursesControl.setValue(this.selectedDoctorialCourses);
  //     }
  //   }
  // }


  removeDoctorialCourses(index: number, id: any) {
    //   if (id != null) {
    //     this.selectedDoctorialCourses = this.selectedDoctorialCourses.filter(item => item.id !== id);
    //     const doctorialCoursesControl = this.coursesForm.get('doctorialcourse');
    //     if (doctorialCoursesControl) {
    //       doctorialCoursesControl.setValue(this.selectedDoctorialCourses);
    //     }
    //   }
    if (id != null) {
      let courseid = id
      this.collegeid = this.collegeDetails.id

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete college Doctorial course',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.campusService.deleteClgCourses(courseid, this.collegeid).subscribe((res) => {
            if (res.response_message == "Success") {
              //this.getClgList()
              Swal.fire(
                'Deleted!',
                'Doctorial course has been deleted.',
                'success'
              );
              this.selectedDoctorialCourses = this.selectedDoctorialCourses.filter(item => item.id !== id);
              const doctorialCoursesControl = this.coursesForm.get('doctorialcourse');
              if (doctorialCoursesControl) {
                doctorialCoursesControl.setValue(this.selectedDoctorialCourses);
              }
            }
            else if (res.response_code == "300") {
              Swal.fire({
                icon: 'warning', text: res.response_message
              }
              );
            }
          });

        } else {
        }

      })

    }
  }

  // ---------------------------------Post Doctorial Courses---------------------------------//

  // getPostDocCourses() {
  //   this.campusService.getPostDocCourses(this.coursesForm.value.searcPostDoc).subscribe((res) => {
  //     this.postCourseslist = res.response_data

  //   })
  // }
  getPostDocCourses(val:string) {
    this.collegeid = this.collegeDetails.id

    this.campusService.getPostDocCourses(this.coursesForm.value.searchDp,this.collegeid).subscribe((res) => {
      this.postCourseslist = res.response_data
      this.tmpPostDocCourseslist = res.response_data
      this.postCourseslist.forEach((item) => {

        if (item.CIds != 0 && item.CIds != null && val != 'typed') {
          this.selectedPostDocrCourses.push(item);
          // this.changeDiplomaSelection;

        }
      });
      this.coursesForm.get('postdoctorialcourse').setValue(this.selectedPostDocrCourses);
      this.changePostDocrSelection(this.coursesForm.value.postdoctorialcourse);
      // this.Loader = true
    })

    
  }
  changePostDocrSelection(selectedCourses: any[]) {
    this.selectedPostDocrCourses = selectedCourses;
  }

  bindPostDoctorialCourses() {
    if (this.postCourseslist != undefined) {
      this.course_data.forEach((item) => {
        this.postCourseslist.forEach((itemm) => {
          if (item.courseid === itemm.id) {
            this.selectedPostDocrCourses.push(itemm);
            this.changePostDocrSelection;
          }
        });
        this.coursesForm.get('postdoctorialcourse').setValue(this.selectedPostDocrCourses);
        this.changePostDocrSelection(this.coursesForm.value.postdoctorialcourse);
      })
    }
    this.Loader = false
  }

  // removePostDoctrialCourse(index: number, id: any) {
  //     if (id != null) {
  //       this.selectedPostDocrCourses = this.selectedPostDocrCourses.filter(item => item.id !== id);
  //       const postdoctCoursesControl = this.coursesForm.get('postdoctorialcourse');
  //       if (postdoctCoursesControl) {
  //         postdoctCoursesControl.setValue(this.selectedPostDocrCourses);
  //       }
  //     }
  // }

  removePostDoctrialCourse(index: number, id: any) {
    // if (id != null) {
    //   this.selectedPostDocrCourses = this.selectedPostDocrCourses.filter(item => item.id !== id);
    //   const postdoctCoursesControl = this.coursesForm.get('postdoctorialcourse');
    //   if (postdoctCoursesControl) {
    //     postdoctCoursesControl.setValue(this.selectedPostDocrCourses);
    //   }
    // }
    if (id != null) {
      let courseid = id
      this.collegeid = this.collegeDetails.id

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete college Postdoctorial Course',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.campusService.deleteClgCourses(courseid, this.collegeid).subscribe((res) => {
            if (res.response_message == "Success") {
              //this.getClgList()
              Swal.fire(
                'Deleted!',
                'PostdoctorialCourse course has been deleted.',
                'success'
              );
              this.selectedPostDocrCourses = this.selectedPostDocrCourses.filter(item => item.id !== id);
              const postdoctCoursesControl = this.coursesForm.get('postdoctorialcourse');
              if (postdoctCoursesControl) {
                postdoctCoursesControl.setValue(this.selectedPostDocrCourses);
              }
            }
            else if (res.response_code == "300") {
              Swal.fire({
                icon: 'warning', text: res.response_message
              }
              );
            }
          });

        } else {
        }

      })

    }
  }

  // ---------------------------------Adv Master Courses---------------------------------//

  getAdvMasterCourses() {
    this.collegeid = this.collegeDetails.id

    this.campusService.getAdvMasterCourses(this.coursesForm.value.searcAdvMas,this.collegeid).subscribe((res) => {
      this.advMasteCourseslist = res.response_data
      this.tmpAdvMasterCourseslist = res.response_data
      this.advMasteCourseslist.forEach((itemm) => {

        if (itemm.CIds != 0 && itemm.CIds != null) {
          this.selectedAdvMasterrCourses.push(itemm);
          // this.changeAdvMasterSelection;

        }
      });
      this.coursesForm.get('advancedmastercourse').setValue(this.selectedAdvMasterrCourses);
      this.changeAdvMasterSelection(this.coursesForm.value.advancedmastercourse);
      this.Loader = true
    })
    
  }

  changeAdvMasterSelection(selectedCourses: any[]) {
    this.selectedAdvMasterrCourses = selectedCourses;
  }

  bindAdvMasterCourses() {
    if (this.advMasteCourseslist != undefined) {
      this.course_data.forEach((item) => {
        this.advMasteCourseslist.forEach((itemm) => {

          if (item.courseid === itemm.id) {
            this.selectedAdvMasterrCourses.push(itemm);
            this.changeAdvMasterSelection;

          }
        });
        this.coursesForm.get('advancedmastercourse').setValue(this.selectedAdvMasterrCourses);
        this.changeAdvMasterSelection(this.coursesForm.value.advancedmastercourse);
      })
    }
    this.Loader = false
  }

  // removeAdvMasterCourses(index: number, id: any) {
  //     if (id != null) {
  //       this.selectedAdvMasterrCourses = this.selectedAdvMasterrCourses.filter(item => item.id !== id);
  //       const dAdvMasterCoursesControl = this.coursesForm.get('advancedmastercourse');
  //       if (dAdvMasterCoursesControl) {
  //         dAdvMasterCoursesControl.setValue(this.selectedAdvMasterrCourses);
  //       }
  //     }
  // }

  removeAdvMasterCourses(index: number, id: any) {
    // if (id != null) {
    //   this.selectedAdvMasterrCourses = this.selectedAdvMasterrCourses.filter(item => item.id !== id);
    //   const dAdvMasterCoursesControl = this.coursesForm.get('advancedmastercourse');
    //   if (dAdvMasterCoursesControl) {
    //     dAdvMasterCoursesControl.setValue(this.selectedAdvMasterrCourses);
    //   }
    // }
    if (id != null) {
      let courseid = id
      this.collegeid = this.collegeDetails.id

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete Advanced Master Course',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.campusService.deleteClgCourses(courseid, this.collegeid).subscribe((res) => {
            if (res.response_message == "Success") {
              //this.getClgList()
              Swal.fire(
                'Deleted!',
                'Advanced Master Course has been deleted.',
                'success'
              );
              this.selectedAdvMasterrCourses = this.selectedAdvMasterrCourses.filter(item => item.id !== id);
              const dAdvMasterCoursesControl = this.coursesForm.get('advancedmastercourse');
              if (dAdvMasterCoursesControl) {
                dAdvMasterCoursesControl.setValue(this.selectedAdvMasterrCourses);
              }
            }
            else if (res.response_code == "300") {
              Swal.fire({
                icon: 'warning', text: res.response_message
              }
              );
            }
          });

        } else {
        }

      })

    }
  }


  // ---------------------------------Other Courses---------------------------------//

  getOtherCourses() {
    this.collegeid = this.collegeDetails.id
    this.campusService.getOtherCourses(this.coursesForm.value.searchOther,this.collegeid).subscribe((res) => {
      this.OtherCourseslist = res.response_data
      this.tmpOtherCourseslist = res.response_data
      this.OtherCourseslist.forEach((itemm) => {

        if (itemm.CIds != 0 && itemm.CIds != null) {
          this.selectedOherCourses.push(itemm);
          // this.changeOtherSelection;

        }
      });
      this.coursesForm.get('othercourse').setValue(this.selectedOherCourses);
      this.changeOtherSelection(this.coursesForm.value.othercourse);
      this.Loader = false ;

    })
  }
    

  bindOtherCourses() {
    if (this.OtherCourseslist != undefined) {
      this.course_data.forEach((item) => {
        this.OtherCourseslist.forEach((itemm) => {

          if (item.courseid === itemm.id) {
            this.selectedOherCourses.push(itemm);
            this.changeOtherSelection;

          }
        });
        this.coursesForm.get('othercourse').setValue(this.selectedOherCourses);
        this.changeOtherSelection(this.coursesForm.value.othercourse);
      })
    }
    this.Loader = false
  }

  changeOtherSelection(selectedCourses: any[]) {
    this.selectedOherCourses = selectedCourses;
  }

  // removeOtherCourses(index: number, id: any) {
  //     if (id != null) {
  //       this.selectedOherCourses = this.selectedOherCourses.filter(item => item.id !== id);
  //       const selectedOherControl = this.coursesForm.get('othercourse');
  //       if (selectedOherControl) {
  //         selectedOherControl.setValue(this.selectedOherCourses);
  //       }
  //     }
  // }

  removeOtherCourses(index: number, id: any) {
    // if (id != null) {
    //   this.selectedOherCourses = this.selectedOherCourses.filter(item => item.id !== id);
    //   const selectedOherControl = this.coursesForm.get('othercourse');
    //   if (selectedOherControl) {
    //     selectedOherControl.setValue(this.selectedOherCourses);
    //   }
    // }

    if (id != null) {
      let courseid = id
      this.collegeid = this.collegeDetails.id

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete Other Course',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.campusService.deleteClgCourses(courseid, this.collegeid).subscribe((res) => {
            if (res.response_message == "Success") {
              //this.getClgList()
              Swal.fire(
                'Deleted!',
                'Other Course has been deleted.',
                'success'
              );
              this.selectedOherCourses = this.selectedOherCourses.filter(item => item.id !== id);
              const selectedOherControl = this.coursesForm.get('othercourse');
              if (selectedOherControl) {
                selectedOherControl.setValue(this.selectedOherCourses);
              }
            }
            else if (res.response_code == "300") {
              Swal.fire({
                icon: 'warning', text: res.response_message
              }
              );
            }
          });

        } else {
        }

      })

    }
  }

  insertCourseForClg() {
    this.updateLoader = true
    this.clgId = this.collegeDetails.id

    let courses = this.selectedUGCourses.concat(this.selectedPGCourses);
    this.campusService.updateCourseForClg(this.clgId, courses).subscribe((res) => {
      if (res.response_message == "Success") {
        this.updateLoader = false
        Swal.fire({
          text: 'College courses added successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this.sendValueToParent()
          }
        });
      } else {
        this.updateLoader = false
        Swal.fire('', res.response_message, 'error')
      }

    })
  }

  updateCourseForClg() {

    this.clgId = this.collegeDetails.id

    this.updateLoader = true
    let courses = this.selectedUGCourses.concat(this.selectedPGCourses).concat(this.selectedDiplomaCourses).concat(this.selectedDoctorialCourses).concat(this.selectedOherCourses).concat(this.selectedPostDocrCourses).concat(this.selectedAdvMasterrCourses);
    this.campusService.updateCourseForClg(this.clgId, courses).subscribe((res) => {
      if (res.response_message == "Success") {
        this.updateLoader = false
        Swal.fire({
          text: 'College courses updated successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this.sendValueToParent()
          }
        });
      } else {
        this.updateLoader = false
        Swal.fire('', res.response_message, 'error')
      }

    })
  }

  back() {
    this.sendValueToParent2();
  }

  sendValueToParent() {
    const valueToSend = "4";
    this.valueChanged.emit(valueToSend);
  }

  sendValueToParent2() {
    const valueToSend = "2";
    this.valueChanged.emit(valueToSend);
  }
}


