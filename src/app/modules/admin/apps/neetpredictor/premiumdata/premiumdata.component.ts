import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from "app/config";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-premiumdata',
    templateUrl: './premiumdata.component.html',
    styleUrls: ['./premiumdata.component.scss']
})
export class PremiumdataComponent implements OnInit {
    @ViewChild('csvFileInput') csvFileInput: ElementRef;
    
    premiumData: any[] = [];
    displayedColumns: string[] = ['college_name', 'state', 'college_type', 'bond_years', 'bond_penalty', 'total_annual_cost', 'stipend_amount', 'actions'];
    loading = false;
    showForm = false;
    editMode = false;
    form: FormGroup;
    searchText = '';

    constructor(
        private http: HttpClient,
        private fb: FormBuilder,
        private snackBar: MatSnackBar
    ) {
        this.initForm();
    }

    ngOnInit(): void {
        this.loadPremiumData();
    }

    initForm(): void {
        this.form = this.fb.group({
            id: [null],
            college_name: ['', Validators.required],
            state: ['', Validators.required],
            college_type: ['Government'],
            course: ['MBBS'],
            bond_years: [0],
            bond_penalty: [0],
            bond_service_area: [''],
            tuition_fee: [0],
            hostel_fee: [0],
            mess_fee: [0],
            exam_fee: [0],
            library_fee: [0],
            lab_fee: [0],
            other_fees: [0],
            hidden_fees_total: [0],
            total_annual_cost: [0],
            stipend_amount: [0],
            stipend_frequency: ['Monthly'],
            nri_quota_fee: [0],
            management_quota_fee: [0],
            notes: [''],
            year: [new Date().getFullYear()]
        });
    }

    loadPremiumData(): void {
        this.loading = true;
        this.http.post<any>(`${config.apiurl3}PremiumAdmin/getPremiumData`, {
            search: this.searchText,
            limit: 100
        }).subscribe({
            next: (res) => {
                this.premiumData = res.data?.colleges || res.data || [];
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.snackBar.open('Failed to load data', 'Close', { duration: 3000 });
            }
        });
    }

    search(): void {
        this.loadPremiumData();
    }

    openForm(data?: any): void {
        if (data) {
            this.editMode = true;
            this.form.patchValue(data);
        } else {
            this.editMode = false;
            this.form.reset();
            this.form.patchValue({
                college_type: 'Government',
                course: 'MBBS',
                stipend_frequency: 'Monthly',
                year: new Date().getFullYear(),
                bond_years: 0,
                bond_penalty: 0,
                tuition_fee: 0,
                hostel_fee: 0,
                mess_fee: 0,
                exam_fee: 0,
                library_fee: 0,
                lab_fee: 0,
                other_fees: 0,
                hidden_fees_total: 0,
                total_annual_cost: 0,
                stipend_amount: 0,
                nri_quota_fee: 0,
                management_quota_fee: 0
            });
        }
        this.showForm = true;
    }

    closeForm(): void {
        this.showForm = false;
        this.form.reset();
    }

    saveData(): void {
        if (this.form.invalid) {
            this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
            return;
        }

        this.loading = true;
        this.http.post<any>(`${config.apiurl3}PremiumAdmin/savePremiumData`, this.form.value)
            .subscribe({
                next: (res) => {
                    if (res.response_code === '200' || res.response_code === 200) {
                        this.snackBar.open(res.response_message || 'Saved successfully', 'Close', { duration: 3000 });
                        this.closeForm();
                        this.loadPremiumData();
                    } else {
                        this.snackBar.open(res.response_message || 'Failed to save', 'Close', { duration: 3000 });
                        this.loading = false;
                    }
                },
                error: () => {
                    this.loading = false;
                    this.snackBar.open('Failed to save data', 'Close', { duration: 3000 });
                }
            });
    }

    deleteData(item: any): void {
        if (confirm('Are you sure you want to delete this record?')) {
            this.http.post<any>(`${config.apiurl3}PremiumAdmin/deletePremiumData`, { id: item.id })
                .subscribe({
                    next: (res) => {
                        this.snackBar.open('Record deleted', 'Close', { duration: 3000 });
                        this.loadPremiumData();
                    },
                    error: () => {
                        this.snackBar.open('Failed to delete', 'Close', { duration: 3000 });
                    }
                });
        }
    }

    calculateTotal(): void {
        const values = this.form.value;
        const total = Number(values.tuition_fee || 0) + Number(values.hostel_fee || 0) + 
                      Number(values.mess_fee || 0) + Number(values.exam_fee || 0) + 
                      Number(values.library_fee || 0) + Number(values.lab_fee || 0) + 
                      Number(values.other_fees || 0);
        this.form.patchValue({ 
            hidden_fees_total: total - Number(values.tuition_fee || 0),
            total_annual_cost: total 
        });
    }

    importCSV(event: any): void {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        this.loading = true;
        this.http.post<any>(`${config.apiurl3}PremiumAdmin/importPremiumDataCSV`, formData)
            .subscribe({
                next: (res) => {
                    if (res.response_code === '200' || res.response_code === 200) {
                        this.snackBar.open(res.response_message || 'CSV imported successfully', 'Close', { duration: 3000 });
                        this.loadPremiumData();
                    } else {
                        this.snackBar.open(res.response_message || 'Failed to import CSV', 'Close', { duration: 3000 });
                    }
                    this.loading = false;
                    if (this.csvFileInput) {
                        this.csvFileInput.nativeElement.value = '';
                    }
                },
                error: () => {
                    this.loading = false;
                    this.snackBar.open('Failed to import CSV', 'Close', { duration: 3000 });
                    if (this.csvFileInput) {
                        this.csvFileInput.nativeElement.value = '';
                    }
                }
            });
    }

    downloadSampleCSV(): void {
        const headers = ['college_name', 'state', 'college_type', 'course', 'bond_years', 'bond_penalty', 'bond_service_area', 'tuition_fee', 'hostel_fee', 'mess_fee', 'exam_fee', 'library_fee', 'lab_fee', 'other_fees', 'stipend_amount', 'stipend_frequency', 'nri_quota_fee', 'management_quota_fee', 'notes', 'year'];
        const sampleRow = ['Sample Medical College', 'Karnataka', 'Government', 'MBBS', '3', '2500000', 'Rural Karnataka', '50000', '25000', '15000', '5000', '2000', '3000', '5000', '15000', 'Monthly', '2500000', '5000000', 'Sample notes', '2025'];
        
        const csvContent = [headers.join(','), sampleRow.join(',')].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'sample_premium_data.csv';
        link.click();
    }
}
