import { ChangeDetectionStrategy, Component, AfterViewInit, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CampusService } from 'app/modules/service/campus.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApexOptions, ApexPlotOptions } from 'ng-apexcharts';
import { Subject } from 'rxjs';
import { DataService } from 'app/modules/service/data.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexTooltip
} from "ng-apexcharts";

// Extend ChartOptions to include the tooltip
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  colors: string[];
  tooltip?: ApexTooltip; // Add tooltip configuration here
};

@Component({
  selector: 'project',
  templateUrl: './project.component.html',
})
export class ProjectComponent implements AfterViewInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  usersData: any[];
  courseData: any[];

  displayedColumns: string[] = ['Sr.No', 'f_name', 'email', 'phone', 'type', 'status', 'create_date',];
  userListData: any[];
  currentPage: number = 0;
  pageSize: number = 5; // Or your desired default page size
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginatior: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dashboardData: any;

  blogsCount: any;
  collegeCount: any;
  eventCount: any;
  userCount: any;
  listLoader: boolean = false;
  length: number;
  page: number = 1;
  dashboard: FormGroup
  userList: FormGroup
  startNum: number = 0;
  sortValue: string = "desc";
  columnIndex: number = 6;
  coursesCount: any;
  enquiryCount: any;
  courseEnquiryCount: any;
  applicationCount: any;
  currentUser: any;
  type: any;

  // Advanced Statistics
  studyAbroadCount: any = 0;
  mockTestsCount: any = 0;
  alertsCount: any = 0;
  rankPredictorCount: any = 0;
  testAttemptsCount: any = 0;
  pendingEnquiriesCount: any = 0;

  totalRecords: number;
  dataSource1: any;
  usersData1: any;
  fromDateFrom3month = new Date();
  fromMinDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  minDate = new Date(new Date().setMonth(new Date().getMonth() + 2));
  fromMaxDate = new Date();
  frdate = new Date(new Date().setDate(new Date().getDate() + 7));

  eventMinDate = new Date(new Date().setMonth(new Date().getMonth() - 12));
  eventMaxDate = new Date(new Date().setMonth(new Date().getMonth() + 12));
  constructor(
    private _formBuilder: FormBuilder,
    private campusService: CampusService,
    private dataService: DataService) {
    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        type: 'bar',
      },
      title: {
        text: 'Loading...',
      },
      xaxis: {
        categories: [],
      },
      colors: ['#1e293b'],
      tooltip: {
           y:{
            
           }
      }
    };
  }



  ngAfterViewInit() {
  }

  ngOnInit() {

    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.type = this.currentUser.type;

    this.userList = this._formBuilder.group({
      search: ['', Validators.required],

    });

    this.dashboard = this._formBuilder.group({
      fromdate: [''],
      todate: [''],
    });
    const today = new Date();
    const pastWeek = new Date();
    pastWeek.setDate(today.getDate() - 600);

    this.dashboard.patchValue({
      fromdate: pastWeek,
      todate: today,
    });
    //  this.listLoader = true
    this.getDashboardData();
    this.getAdvancedStats();
    this.getUsers();
    this.getTrendingColleges();
    this.getTrendingCourse();
    this.sendData();
    this.fetchTrendingData();


  }
  fetchTrendingData() {
    this.campusService.getTrendingColleges(this.dashboard.value.fromdate, this.dashboard.value.todate)
      .subscribe((response) => {
        // alert(response)
        if (response.response_code == 200) {
          this.usersData = response.TrendingColleges;
          this.updateChart(); // Update chart after colleges data fetch
        }
      });

    this.campusService.getTrendingCourse(this.dashboard.value.fromdate, this.dashboard.value.todate)
      .subscribe((response) => {
        if (response.response_code == 200) {
          this.courseData = response.response_data;
          this.updateChart(); // Update chart after courses data fetch
        }
      });
  }
  updateChart() {
    // Full names for both colleges and courses
    const collegeNames = this.usersData?.map((college) => college.title) || [];
    const collegeViews = this.usersData?.map((college) => college.views) || [];
  
    const courseNames = this.courseData?.map((course) => course.name) || [];
    const courseViews = this.courseData?.map((course) => course.views) || [];
  
   
  
    this.chartOptions = {
      series: [
        { name: 'Colleges', data: collegeViews },
        { name: 'Courses', data: courseViews },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      // xaxis: {
      //   categories: [...collegeNames, ...courseNames], // Use full names for x-axis
      // },
      title: {
        text: 'Trending Colleges and Courses',
      },
      colors: ['#1f77b4', '#ff7f0e'],
      tooltip: {
        y: {
          formatter: (value, { dataPointIndex, seriesIndex }) => {
            // Ensure value is returned as a string
            const formattedValue = `${value}`;  // Explicitly convert value to a string
    
            // If the series is colleges (seriesIndex === 0)
            if (seriesIndex === 0) {
              return `${collegeNames[dataPointIndex]}: ${formattedValue} views`;
            } else if (seriesIndex === 1) {
              // If the series is courses (seriesIndex === 1), display full course name and its views
              const adjustedIndex = (dataPointIndex - collegeNames.length) + 25;
              // alert(adjustedIndex)
              return `${courseNames[adjustedIndex]}: ${formattedValue} views`;
            }
            return formattedValue;
          },
        },
      },
    };
  }
  
  
  // getShortName(fullName: string): string {
  //   // Extract short form from parentheses or return full name
  //   const match = fullName.match(/\(([^)]+)\)/);
  //   return match ? match[1] : fullName;
  // }

  sendData() {
    const data = '1';
    this.dataService.setData(data);
  }

  fromDateChange(event) {
    const d = new Date(this.dashboard.value.Fromdate);
    let month = d.getMonth();
    let today = new Date();
    this.fromDateFrom3month = new Date(new Date(d).setMonth(month + 3));
    var Difference_In_Time = today.getTime() - this.fromDateFrom3month.getTime();
    if (Difference_In_Time < 0)
      this.fromDateFrom3month = today;
  }

  getDashboardData() {
    this.campusService.getDashboardData(this.dashboard.value.fromdate, this.dashboard.value.todate).subscribe((res) => {
      this.dashboardData = res
      this.blogsCount = this.dashboardData.blogs_count
      this.collegeCount = this.dashboardData.college_count
      this.eventCount = this.dashboardData.event_count
      this.userCount = this.dashboardData.user_count
      this.coursesCount = this.dashboardData.courses_count
      this.enquiryCount = this.dashboardData.enquiry_count
      this.courseEnquiryCount = this.dashboardData.courseEnquiry_count
      this.applicationCount = this.dashboardData.application_count
    })
  }


  getUsers() {
    this.campusService.getUsers(this.page, this.pageSize, this.startNum, this.columnIndex, this.sortValue, this.userList.value.search).subscribe((res) => {
      this.usersData = res.data;
      if (res.recordsFiltered != 0) {
        setTimeout(() => {
          this.dataSource = new MatTableDataSource<any>(this.usersData);
          this.dataSource.paginator = this.paginatior;
          this.dataSource.sort = this.sort;
          this.listLoader = false;
        }, 3000)
      } else {
        Swal.fire('', 'Data not found , please try again', 'error')
        return
      }
    });
  }
  applyFilter() {
    this.getTrendingColleges();
    this.getTrendingCourse();
  }

  removeForm() {
    this.dashboard.get('fromdate').setValue('')
    this.getTrendingColleges();
    this.getTrendingCourse();
  }
  removeTo() {
    this.dashboard.get('todate').setValue('')
    this.getTrendingColleges();
    this.getTrendingCourse();
  }

  getTrendingColleges() {
    this.campusService.getTrendingColleges(this.dashboard.value.fromdate, this.dashboard.value.todate).subscribe((res) => {
      this.usersData = res.TrendingColleges;
      this.totalRecords = this.usersData.length;
    });
  }

  getTrendingCourse() {
    this.campusService.getTrendingCourse(this.dashboard.value.fromdate, this.dashboard.value.todate).subscribe((res) => {
      this.courseData = res.response_data;
      this.totalRecords = this.courseData.length;
    });
  }

  getAdvancedStats() {
    // Get Study Abroad Count
    this.campusService.getStudyAbroadList(1, 1, 0, 1, 'desc', '').subscribe((res) => {
      if (res.response_code === 1 || res.response_code === '1' || res.response_code === '200' || res.data) {
        this.studyAbroadCount = res.recordsTotal || res.data?.length || 0;
        // Count pending enquiries
        this.pendingEnquiriesCount = res.data?.filter((e: any) => e.status == 0 || e.status == '0').length || 0;
      }
    });

    // Get Mock Tests Count
    this.campusService.getMockTestList(1, 1, 0, 0, 'desc', '').subscribe((res) => {
      if (res.response_code === 1 || res.response_code === '1') {
        this.mockTestsCount = res.response_data?.recordsTotal || 0;
      }
    });

    // Get Mock Test Attempts Count
    this.campusService.getMockTestAttempts(1, 1, 0, '').subscribe((res) => {
      if (res.response_code === 1 || res.response_code === '1') {
        this.testAttemptsCount = res.response_data?.recordsTotal || 0;
      }
    });

    // Get Alerts Count
    this.campusService.getAlertsList(1, 1, 0, 0, 'desc', '').subscribe((res) => {
      if (res.response_code === 1 || res.response_code === '1') {
        this.alertsCount = res.response_data?.recordsTotal || 0;
      }
    });

    // Get Rank Predictor Exams Count
    this.campusService.getRankPredictorExamList(1, 1, 0, 0, 'desc', '').subscribe((res) => {
      if (res.response_code === 1 || res.response_code === '1') {
        this.rankPredictorCount = res.response_data?.recordsTotal || 0;
      }
    });
  }



}

