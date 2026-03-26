import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from "app/config";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-stray-vacancy',
    templateUrl: './strayVacancy.component.html',
    styleUrls: ['./strayVacancy.component.scss']
})
export class StrayVacancyComponent implements OnInit {
    @ViewChild('csvFileInput') csvFileInput: ElementRef;
    
    vacancies: any[] = [];
    displayedColumns: string[] = ['college_name', 'state', 'round', 'category', 'total_seats', 'vacant_seats', 'cutoff_rank', 'actions'];
    loading = false;
    showForm = false;
    editMode = false;
    form: FormGroup;
    searchText = '';
    filterRound = '';

    constructor(
        private http: HttpClient,
        private fb: FormBuilder,
        private snackBar: MatSnackBar
    ) {
        this.initForm();
    }

    ngOnInit(): void {
        this.loadVacancies();
    }

    initForm(): void {
        this.form = this.fb.group({
            id: [null],
            college_name: ['', Validators.required],
            state: ['', Validators.required],
            course: ['MBBS'],
            counseling_type: ['State Quota'],
            round: ['', Validators.required],
            category: ['', Validators.required],
            total_seats: [0],
            filled_seats: [0],
            vacant_seats: [0],
            last_allotted_rank: [null],
            cutoff_rank: [null],
            college_type: ['Government'],
            year: [new Date().getFullYear()],
            is_active: [true]
        });
    }

    loadVacancies(): void {
        this.loading = true;
        this.http.post<any>(`${config.apiurl3}PremiumAdmin/getStrayVacancies`, {
            search: this.searchText,
            round: this.filterRound,
            limit: 100
        }).subscribe({
            next: (res) => {
                this.vacancies = res.data || [];
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    search(): void {
        this.loadVacancies();
    }

    openForm(data?: any): void {
        if (data) {
            this.editMode = true;
            this.form.patchValue(data);
        } else {
            this.editMode = false;
            this.form.reset();
            this.form.patchValue({
                course: 'MBBS',
                counseling_type: 'State Quota',
                college_type: 'Government',
                year: new Date().getFullYear(),
                is_active: true
            });
        }
        this.showForm = true;
    }

    closeForm(): void {
        this.showForm = false;
        this.form.reset();
    }

    calculateVacant(): void {
        const total = this.form.value.total_seats || 0;
        const filled = this.form.value.filled_seats || 0;
        this.form.patchValue({ vacant_seats: total - filled });
    }

    saveVacancy(): void {
        if (this.form.invalid) {
            this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
            return;
        }

        this.loading = true;
        this.http.post<any>(`${config.apiurl3}PremiumAdmin/saveStrayVacancy`, this.form.value)
            .subscribe({
                next: (res) => {
                    this.snackBar.open(res.response_message, 'Close', { duration: 3000 });
                    this.closeForm();
                    this.loadVacancies();
                },
                error: () => {
                    this.loading = false;
                    this.snackBar.open('Failed to save vacancy', 'Close', { duration: 3000 });
                }
            });
    }

    deleteVacancy(item: any): void {
        if (confirm('Are you sure you want to delete this vacancy record?')) {
            this.http.post<any>(`${config.apiurl3}PremiumAdmin/deleteStrayVacancy`, { id: item.id })
                .subscribe({
                    next: () => {
                        this.snackBar.open('Vacancy deleted', 'Close', { duration: 3000 });
                        this.loadVacancies();
                    }
                });
        }
    }

    importCSV(event: any): void {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        this.loading = true;
        this.http.post<any>(`${config.apiurl3}PremiumAdmin/importStrayVacancyCSV`, formData)
            .subscribe({
                next: (res) => {
                    this.snackBar.open(res.response_message || 'CSV imported successfully', 'Close', { duration: 3000 });
                    this.loadVacancies();
                    this.csvFileInput.nativeElement.value = '';
                },
                error: () => {
                    this.loading = false;
                    this.snackBar.open('Failed to import CSV', 'Close', { duration: 3000 });
                }
            });
    }

    downloadSampleCSV(): void {
        const sampleData = `college_name,state,course,counseling_type,round,category,total_seats,filled_seats,vacant_seats,cutoff_rank,college_type,year
AIIMS Delhi,Delhi,MBBS,All India Quota,Stray Vacancy,GEN,100,95,5,15000,Government,2025
GMC Mumbai,Maharashtra,MBBS,State Quota,Mop-up,OBC,50,40,10,35000,Government,2025`;
        
        const blob = new Blob([sampleData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'stray_vacancy_sample.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    exportToExcel(): void {
        if (this.vacancies.length === 0) {
            this.snackBar.open('No data to export', 'Close', { duration: 3000 });
            return;
        }

        const headers = ['College Name', 'State', 'Course', 'Counseling Type', 'Round', 'Category', 'Total Seats', 'Filled Seats', 'Vacant Seats', 'Cutoff Rank', 'College Type', 'Year'];
        const rows = this.vacancies.map(v => [
            v.college_name,
            v.state,
            v.course,
            v.counseling_type,
            v.round,
            v.category,
            v.total_seats,
            v.filled_seats,
            v.vacant_seats,
            v.cutoff_rank || '',
            v.college_type,
            v.year
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stray_vacancy_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}
