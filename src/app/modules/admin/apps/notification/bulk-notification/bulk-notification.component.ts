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
  
  // Loading states
  statesLoading: boolean = false;
  categoriesLoading: boolean = false;
  examsLoading: boolean = false;

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
    // Load states using the apps API (no auth required)
    this.statesLoading = true;
    this.campusService.getExamStateList().subscribe({
      next: (res: any) => {
        this.statesLoading = false;
        console.log('States response:', res);
        if (res.res_data) {
          this.stateList = res.res_data;
        } else if (res.response_data) {
          this.stateList = res.response_data;
        } else if (res.data) {
          this.stateList = res.data;
        }
      },
      error: (err) => {
        this.statesLoading = false;
        console.error('Error loading states:', err);
      }
    });
    
    // Load categories
    this.categoriesLoading = true;
    this.campusService.getCategoryListByType('college').subscribe({
      next: (res: any) => {
        this.categoriesLoading = false;
        console.log('Categories response:', res);
        if (res.response_data) {
          this.categoryList = res.response_data;
        } else if (res.data) {
          this.categoryList = res.data;
        }
      },
      error: (err) => {
        this.categoriesLoading = false;
        console.error('Error loading categories:', err);
      }
    });
    
    // Load exams
    this.examsLoading = true;
    this.campusService.getExams('', '').subscribe({
      next: (res: any) => {
        this.examsLoading = false;
        console.log('Exams response:', res);
        if (res.response_data) {
          this.examList = res.response_data;
        } else if (res.data) {
          this.examList = res.data;
        }
      },
      error: (err) => {
        this.examsLoading = false;
        console.error('Error loading exams:', err);
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
      this.campusService.getCityByState(stateIds).subscribe({
        next: (res: any) => {
          console.log('Cities response:', res);
          if (res.response_data) {
            this.cityList = res.response_data;
          } else if (res.data) {
            this.cityList = res.data;
          } else {
            this.cityList = [];
          }
        },
        error: (err) => {
          console.error('Error loading cities:', err);
          this.cityList = [];
        }
      });
    } else {
      this.cityList = [];
    }
  }

  loadCoursesByCategory() {
    if (this.selectedCategories.length > 0) {
      const catIds = this.selectedCategories.map(c => c.id).join(',');
      this.campusService.getCoursesByCategory(catIds).subscribe({
        next: (res: any) => {
          console.log('Courses response:', res);
          if (res.response_data) {
            this.courseList = res.response_data;
          } else if (res.data) {
            this.courseList = res.data;
          } else {
            this.courseList = [];
          }
        },
        error: (err) => {
          console.error('Error loading courses:', err);
          this.courseList = [];
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
      states: this.selectedStates.map(s => s.id).join(','),
      categories: this.selectedCategories.map(c => c.id).join(','),
      courses: this.selectedCourses.map(c => c.id).join(','),
      exams: this.selectedExams.map(e => e.id).join(','),
      cities: this.selectedCities.map(c => c.id).join(',')
    };

    this.campusService.getUsersByFilter(filterData).subscribe({
      next: (res: any) => {
        this.isPreviewLoading = false;
        console.log('Users response:', res);
        if (res.response_code === '200' || res.response_code === 200) {
          this.matchedUsers = res.response_data || [];
        } else {
          this.matchedUsers = [];
        }
      },
      error: (err) => {
        this.isPreviewLoading = false;
        console.error('Error fetching users:', err);
        this.matchedUsers = [];
      }
    });
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
      category: this.selectedCategories.length > 0 ? this.selectedCategories.map(c => c.id).join(',') : '',
      subcategory: this.selectedCourses.length > 0 ? this.selectedCourses.map(c => c.id).join(',') : '',
      exam: this.selectedExams.length > 0 ? this.selectedExams.map(e => e.id).join(',') : '',
      state: this.selectedStates.length > 0 ? this.selectedStates.map(s => s.id).join(',') : '',
      city: this.selectedCities.length > 0 ? this.selectedCities.map(c => c.id).join(',') : '',
      created_by: 'admin'
    };

    this.campusService.saveBulkNotification(payload).subscribe({
      next: (res: any) => {
        this.addLoader = false;
        if (res.response_code === '200' || res.response_code === 200) {
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
      error: (err) => {
        this.addLoader = false;
        console.error('Error sending notification:', err);
        Swal.fire('', 'Error sending notification. Please try again.', 'error');
      }
    });
  }

  clearFilters() {
    this.selectedStates = [];
    this.selectedCategories = [];
    this.selectedCourses = [];
    this.selectedExams = [];
    this.selectedCities = [];
    this.matchedUsers = [];
    this.showPreview = false;
    this.courseList = [];
    this.cityList = [];
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
