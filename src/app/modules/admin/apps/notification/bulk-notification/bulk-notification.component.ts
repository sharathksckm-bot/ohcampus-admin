import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bulk-notification',
  templateUrl: './bulk-notification.component.html',
  styleUrls: ['./bulk-notification.component.scss']
})
export class BulkNotificationComponent implements OnInit {
  bulkNotificationForm: FormGroup;
  addLoader: boolean = false;
  
  // Filter options
  stateList: any[] = [];
  categoryList: any[] = [];
  courseList: any[] = [];
  examList: any[] = [];
  cityList: any[] = [];
  
  // Selected filters
  selectedStates: any[] = [];
  selectedCategories: any[] = [];
  selectedCourses: any[] = [];
  selectedExams: any[] = [];
  selectedCities: any[] = [];
  
  // Preview data
  matchedUsers: any[] = [];
  isPreviewLoading: boolean = false;
  showPreview: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService: CampusService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.bulkNotificationForm = this._formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      states: [[]],
      categories: [[]],
      courses: [[]],
      exams: [[]],
      cities: [[]]
    });
    
    this.loadFilterOptions();
  }

  loadFilterOptions() {
    // Load states
    this.campusService.getStateList(1, 100, 0, 0, 'asc', '').subscribe((res: any) => {
      if (res.response_code === '200') {
        this.stateList = res.response_data || res.data || [];
      }
    });
    
    // Load categories
    this.campusService.getCategoryListByType('college').subscribe((res: any) => {
      if (res.response_data) {
        this.categoryList = res.response_data;
      }
    });
    
    // Load exams
    this.campusService.getExams('', '').subscribe((res: any) => {
      if (res.response_data) {
        this.examList = res.response_data;
      }
    });
  }

  onStateChange(event: any) {
    this.selectedStates = event;
    this.loadCitiesByStates();
    this.previewMatchedUsers();
  }

  onCategoryChange(event: any) {
    this.selectedCategories = event;
    this.loadCoursesByCategory();
    this.previewMatchedUsers();
  }

  onCourseChange(event: any) {
    this.selectedCourses = event;
    this.previewMatchedUsers();
  }

  onExamChange(event: any) {
    this.selectedExams = event;
    this.previewMatchedUsers();
  }

  onCityChange(event: any) {
    this.selectedCities = event;
    this.previewMatchedUsers();
  }

  loadCitiesByStates() {
    if (this.selectedStates.length > 0) {
      const stateIds = this.selectedStates.map(s => s.id).join(',');
      this.campusService.getCityByState(stateIds).subscribe((res: any) => {
        if (res.response_data) {
          this.cityList = res.response_data;
        }
      });
    } else {
      this.cityList = [];
    }
  }

  loadCoursesByCategory() {
    if (this.selectedCategories.length > 0) {
      const catIds = this.selectedCategories.map(c => c.id).join(',');
      this.campusService.getCoursesByCategory(catIds).subscribe((res: any) => {
        if (res.response_data) {
          this.courseList = res.response_data;
        }
      });
    } else {
      this.courseList = [];
    }
  }

  previewMatchedUsers() {
    if (this.selectedStates.length === 0 && this.selectedCategories.length === 0 && 
        this.selectedExams.length === 0 && this.selectedCities.length === 0) {
      this.matchedUsers = [];
      this.showPreview = false;
      return;
    }

    this.isPreviewLoading = true;
    this.showPreview = true;

    const filterData = {
      states: this.selectedStates,
      categories: this.selectedCategories,
      courses: this.selectedCourses,
      exams: this.selectedExams,
      cities: this.selectedCities
    };

    this.campusService.getUsersByFilter(filterData).subscribe(
      (res: any) => {
        this.isPreviewLoading = false;
        if (res.response_code === '200') {
          this.matchedUsers = res.response_data || [];
        }
      },
      (error) => {
        this.isPreviewLoading = false;
        console.error('Error fetching users:', error);
      }
    );
  }

  sendBulkNotification() {
    if (this.bulkNotificationForm.invalid) {
      this.bulkNotificationForm.markAllAsTouched();
      Swal.fire('', 'Please fill all required fields', 'error');
      return;
    }

    if (this.matchedUsers.length === 0) {
      Swal.fire('', 'No users match the selected filters. Please adjust your filters.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Send Bulk Notification?',
      html: `
        <p>You are about to send notification to <strong>${this.matchedUsers.length}</strong> users.</p>
        <p><strong>Title:</strong> ${this.bulkNotificationForm.value.title}</p>
        <p><strong>Message:</strong> ${this.bulkNotificationForm.value.message.substring(0, 100)}...</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3290d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, send it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.executeBulkSend();
      }
    });
  }

  executeBulkSend() {
    this.addLoader = true;

    const payload = {
      title: this.bulkNotificationForm.value.title,
      description: this.bulkNotificationForm.value.message,
      category: this.selectedCategories.length > 0 ? this.selectedCategories.map(c => c.id).join(',') : null,
      subcategory: this.selectedCourses.length > 0 ? this.selectedCourses.map(c => c.id).join(',') : null,
      exam: this.selectedExams.length > 0 ? this.selectedExams.map(e => e.id).join(',') : null,
      state: this.selectedStates.length > 0 ? this.selectedStates.map(s => s.id).join(',') : null,
      city: this.selectedCities.length > 0 ? this.selectedCities.map(c => c.id).join(',') : null,
      created_by: 'admin'
    };

    this.campusService.saveBulkNotification(payload).subscribe(
      (res: any) => {
        this.addLoader = false;
        if (res.response_code === '200') {
          Swal.fire({
            title: 'Success!',
            text: `Bulk notification sent to ${this.matchedUsers.length} users successfully!`,
            icon: 'success',
            confirmButtonColor: '#3290d6'
          }).then(() => {
            this._router.navigate(['apps/notification/notificationList']);
          });
        } else {
          Swal.fire('', res.response_message || 'Failed to send notification', 'error');
        }
      },
      (error) => {
        this.addLoader = false;
        Swal.fire('', 'Error sending notification. Please try again.', 'error');
      }
    );
  }

  clearFilters() {
    this.selectedStates = [];
    this.selectedCategories = [];
    this.selectedCourses = [];
    this.selectedExams = [];
    this.selectedCities = [];
    this.matchedUsers = [];
    this.showPreview = false;
    this.bulkNotificationForm.patchValue({
      states: [],
      categories: [],
      courses: [],
      exams: [],
      cities: []
    });
  }

  back() {
    this._router.navigate(['apps/notification/notificationList']);
  }
}
