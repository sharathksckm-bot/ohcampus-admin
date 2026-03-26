import { Component, OnInit,ViewChild ,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editcollegedetails',
  templateUrl: './editcollegedetails.component.html',
  styleUrls: ['./editcollegedetails.component.scss']
})
export class EditcollegedetailsComponent implements OnInit {
  indexNum: number = 0;
  activeIndex: number = 0;
  clgId: any;
  receivedValue: string;
  submitData: boolean = false
  selectedIndex: any;
  getData : boolean = false
  retriveData: any = {} ;
  imageData: any = {} ;
  course_data: any = {} ;
  highlights_data: any = {} ;
  Fee_structure: any = {} ;
  brochures: any = {} ;
  Rank: any = {} ;
  placements: any = {} ;
  tableofcontent: any = {} ;
  faqsData: any = {} ;
  entranceExam: any ={};

  constructor(
        private _formBuilder: FormBuilder,
        private campusService : CampusService,
        public globalService: GlobalService,
        public dialog: MatDialog,
        public _activatedroute: ActivatedRoute,
        public _route: Router, ) { }

ngOnInit(): void {
    const routeParams = this._activatedroute.snapshot.params;
    if (routeParams.clgId) {
    this.clgId = routeParams.clgId;
    }

  this._activatedroute.queryParams.subscribe(params => {
    if(params['index'] != undefined){
    const index = params['index'];
    this.indexNumber(index)
    }
  });
}

ngAfterViewInit(): void {

  if ((this.clgId != '' && this.clgId != undefined)) {
    this.getClgDetailsById();
   }else{
    this.getData = true
  }
  }


isSelected(index: any): boolean {
  return this.indexNum == index;
}

getClgDetailsById(){
  this.campusService.getCollegeDetailsById(this.clgId).subscribe((res) =>{
    //alert(this.clgId);
  if(res.response_message == "Success"){
  this.retriveData = res.response_data || {}
  this.imageData = res.image_data || {}
  this.course_data = res.course_data || {}
  this.entranceExam =res.exams || {}
  this.highlights_data = res.highlights_data || {}
  this.Fee_structure = res.Fee_structure || {}
  this.brochures = res.brochures || {}
  this.Rank = res.Rank || {}
  this.placements = res.placements || {}
  this.faqsData = res.faq || {}
  this.tableofcontent = res.tableofcontent || {}
  this.getData = true
  }
})
}

onValueChanged(value: string) {
  this.getClgDetailsById();
  this.receivedValue = value;
  console.log('Received value in parent:', this.receivedValue);
  this.indexNumber(value)
  this.submitData = true
}

indexNumber(index){
  this.indexNum = index
  this.activeIndex = index;
}

}
