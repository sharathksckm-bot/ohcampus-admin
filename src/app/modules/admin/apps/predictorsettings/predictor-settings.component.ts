import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CampusService } from 'app/modules/service/campus.service';

interface PredictorSetting {
  id?: number;
  exam_id: number;
  exam_name: string;
  exam_date: string;
  result_date: string;
  rank_predictor_active: number;
  college_predictor_active: number;
  rank_predictor_message: string;
  college_predictor_message: string;
}

@Component({
  selector: 'app-predictor-settings',
  templateUrl: './predictor-settings.component.html',
  styleUrls: ['./predictor-settings.component.scss']
})
export class PredictorSettingsComponent implements OnInit {
  @ViewChild('editDialog') editDialog: TemplateRef<any>;

  predictorSettings: PredictorSetting[] = [];
  availableExams: any[] = [];
  loading = true;
  saving = false;
  isEditMode = false;
  currentSetting: PredictorSetting | null = null;

  settingsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private campusService: CampusService
  ) {
    this.settingsForm = this.fb.group({
      exam_id: ['', Validators.required],
      exam_name: ['', Validators.required],
      exam_date: [''],
      result_date: [''],
      rank_predictor_active: [false],
      college_predictor_active: [false],
      rank_predictor_message: [''],
      college_predictor_message: ['']
    });
  }

  ngOnInit() {
    this.loadSettings();
    this.loadExams();
  }

  loadSettings() {
    this.loading = true;
    this.campusService.getAllPredictorSettings().subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res && res.response_code === '200') {
          this.predictorSettings = res.data || [];
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.showSnackbar('Failed to load settings', 'error');
      }
    });
  }

  loadExams() {
    this.campusService.getExamList(1, 100, 0, '', 'asc', '').subscribe({
      next: (res: any) => {
        if (res && res.examslist) {
          this.availableExams = res.examslist;
        }
      },
      error: (err: any) => console.error('Failed to load exams', err)
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'Not set';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  isExamActive(setting: PredictorSetting): boolean {
    const today = new Date().toISOString().split('T')[0];
    return setting.exam_date && today >= setting.exam_date;
  }

  openAddDialog() {
    this.isEditMode = false;
    this.currentSetting = null;
    this.settingsForm.reset({
      rank_predictor_active: false,
      college_predictor_active: false
    });
    this.settingsForm.get('exam_id')?.enable();
    this.dialog.open(this.editDialog, { width: '600px' });
  }

  openEditDialog(setting: PredictorSetting) {
    this.isEditMode = true;
    this.currentSetting = setting;
    
    this.settingsForm.patchValue({
      exam_id: setting.exam_id,
      exam_name: setting.exam_name,
      exam_date: setting.exam_date ? new Date(setting.exam_date) : null,
      result_date: setting.result_date ? new Date(setting.result_date) : null,
      rank_predictor_active: setting.rank_predictor_active == 1,
      college_predictor_active: setting.college_predictor_active == 1,
      rank_predictor_message: setting.rank_predictor_message || '',
      college_predictor_message: setting.college_predictor_message || ''
    });
    
    this.settingsForm.get('exam_id')?.disable();
    this.dialog.open(this.editDialog, { width: '600px' });
  }

  onExamSelect(event: any) {
    const examId = event.value;
    const exam = this.availableExams.find(e => e.id === examId);
    if (exam) {
      this.settingsForm.patchValue({ exam_name: exam.title });
    }
  }

  saveSettings() {
    if (this.settingsForm.invalid) return;

    this.saving = true;
    const formData = this.settingsForm.getRawValue();

    // Format dates
    if (formData.exam_date instanceof Date) {
      formData.exam_date = formData.exam_date.toISOString().split('T')[0];
    }
    if (formData.result_date instanceof Date) {
      formData.result_date = formData.result_date.toISOString().split('T')[0];
    }

    formData.rank_predictor_active = formData.rank_predictor_active ? 1 : 0;
    formData.college_predictor_active = formData.college_predictor_active ? 1 : 0;

    if (this.isEditMode) {
      this.campusService.updatePredictorSettings(formData).subscribe({
        next: (res: any) => {
          this.saving = false;
          if (res && res.response_code === '200') {
            this.showSnackbar('Settings updated successfully', 'success');
            this.dialog.closeAll();
            this.loadSettings();
          } else {
            this.showSnackbar(res?.message || 'Update failed', 'error');
          }
        },
        error: (err: any) => {
          this.saving = false;
          this.showSnackbar('Network error', 'error');
        }
      });
    } else {
      this.campusService.createPredictorSettings(formData).subscribe({
        next: (res: any) => {
          this.saving = false;
          if (res && res.response_code === '200') {
            this.showSnackbar('Settings created successfully', 'success');
            this.dialog.closeAll();
            this.loadSettings();
          } else {
            this.showSnackbar(res?.message || 'Creation failed', 'error');
          }
        },
        error: (err: any) => {
          this.saving = false;
          this.showSnackbar('Network error', 'error');
        }
      });
    }
  }

  toggleRankPredictor(setting: PredictorSetting, event: any) {
    const data = {
      exam_id: setting.exam_id,
      rank_predictor_active: event.checked ? 1 : 0
    };
    this.campusService.updatePredictorSettings(data).subscribe({
      next: (res: any) => {
        if (res && res.response_code === '200') {
          setting.rank_predictor_active = event.checked ? 1 : 0;
          this.showSnackbar('Rank Predictor ' + (event.checked ? 'activated' : 'deactivated'), 'success');
        }
      },
      error: () => this.showSnackbar('Update failed', 'error')
    });
  }

  toggleCollegePredictor(setting: PredictorSetting, event: any) {
    const data = {
      exam_id: setting.exam_id,
      college_predictor_active: event.checked ? 1 : 0
    };
    this.campusService.updatePredictorSettings(data).subscribe({
      next: (res: any) => {
        if (res && res.response_code === '200') {
          setting.college_predictor_active = event.checked ? 1 : 0;
          this.showSnackbar('College Predictor ' + (event.checked ? 'activated' : 'deactivated'), 'success');
        }
      },
      error: () => this.showSnackbar('Update failed', 'error')
    });
  }

  confirmDelete(setting: PredictorSetting) {
    if (confirm('Are you sure you want to delete settings for ' + setting.exam_name + '?')) {
      this.campusService.deletePredictorSettings(setting.exam_id).subscribe({
        next: (res: any) => {
          if (res && res.response_code === '200') {
            this.showSnackbar('Settings deleted', 'success');
            this.loadSettings();
          }
        },
        error: () => this.showSnackbar('Delete failed', 'error')
      });
    }
  }

  showSnackbar(message: string, type: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'error' ? 'snack-error' : 'snack-success'
    });
  }
}
