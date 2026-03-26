import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from "app/config";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-news-sources',
    templateUrl: './newsSources.component.html',
    styleUrls: ['./newsSources.component.scss']
})
export class NewsSourcesComponent implements OnInit {
    sources: any[] = [];
    displayedColumns: string[] = ['predictor_type', 'source_name', 'source_url', 'is_active', 'last_scraped_at', 'actions'];
    loading = false;
    showForm = false;
    editMode = false;
    form: FormGroup;
    filterType = '';

    // Cron Settings
    cronSettings: any = null;
    cronLogs: any[] = [];
    showCronPanel = true;
    showLogs = false;

    predictorTypes = [
        { code: 'KCET', name: 'KCET Karnataka' },
        { code: 'NEET', name: 'NEET Medical' },
        { code: 'JEE', name: 'JEE Main' },
        { code: 'COMEDK', name: 'COMEDK UGET' },
        { code: 'MCC', name: 'MCC All India' },
        { code: 'STATE_COUNSELING', name: 'State Counseling' }
    ];

    intervalOptions = [
        { value: 60, label: 'Every 1 hour' },
        { value: 180, label: 'Every 3 hours' },
        { value: 360, label: 'Every 6 hours' },
        { value: 720, label: 'Every 12 hours' },
        { value: 1440, label: 'Once daily' }
    ];

    constructor(
        private http: HttpClient,
        private fb: FormBuilder,
        private snackBar: MatSnackBar
    ) {
        this.initForm();
    }

    ngOnInit(): void {
        this.loadSources();
        this.loadCronSettings();
    }

    initForm(): void {
        this.form = this.fb.group({
            id: [null],
            predictor_type: ['', Validators.required],
            source_name: ['', Validators.required],
            source_url: ['', [Validators.required, Validators.pattern('https?://.+')]],
            scrape_selector: [''],
            is_active: [true]
        });
    }

    // ==================== CRON SETTINGS ====================

    loadCronSettings(): void {
        this.http.post<any>(`${config.apiurl3}NewsScraper/getCronSettings`, { cron_name: 'news_scraper' })
            .subscribe({
                next: (res) => {
                    if (res.response_code === '200' && res.data) {
                        this.cronSettings = res.data;
                    }
                },
                error: (err) => console.error('Error loading cron settings:', err)
            });
    }

    toggleCron(): void {
        const newStatus = !this.isCronEnabled();
        const action = newStatus ? 'start' : 'stop';
        
        Swal.fire({
            title: `${action.charAt(0).toUpperCase() + action.slice(1)} News Scraper?`,
            text: newStatus 
                ? 'The scraper will automatically fetch and summarize counseling updates.'
                : 'The scraper will stop fetching updates.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Yes, ${action} it`,
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                this.http.post<any>(`${config.apiurl3}NewsScraper/updateCronSettings`, {
                    cron_name: 'news_scraper',
                    is_enabled: newStatus
                }).subscribe({
                    next: (res) => {
                        this.loadCronSettings();
                        this.snackBar.open(`Scraper ${action}ed successfully`, 'Close', { duration: 3000 });
                    },
                    error: () => {
                        this.snackBar.open(`Failed to ${action} scraper`, 'Close', { duration: 3000 });
                    }
                });
            }
        });
    }

    updateInterval(interval: number): void {
        this.http.post<any>(`${config.apiurl3}NewsScraper/updateCronSettings`, {
            cron_name: 'news_scraper',
            interval_minutes: interval
        }).subscribe({
            next: () => {
                this.loadCronSettings();
                this.snackBar.open('Interval updated', 'Close', { duration: 2000 });
            }
        });
    }

    runNow(): void {
        Swal.fire({
            title: 'Run Scraper Now?',
            text: 'This will immediately scrape all active sources and generate alerts.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, run now',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return this.http.post<any>(`${config.apiurl3}NewsScraper/runNow`, {}).toPromise();
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const res = result.value;
                Swal.fire({
                    title: res.response_code === '200' ? 'Scraper Completed' : 'Scraper Failed',
                    html: `
                        <div style="text-align: left;">
                            <p><strong>Items Processed:</strong> ${res.items_processed || 0}</p>
                            <p><strong>Alerts Created:</strong> ${res.alerts_created || 0}</p>
                            <p><strong>Execution Time:</strong> ${res.execution_time || 'N/A'}</p>
                            ${res.errors?.length ? `<p><strong>Errors:</strong> ${res.errors.join(', ')}</p>` : ''}
                        </div>
                    `,
                    icon: res.response_code === '200' ? 'success' : 'error'
                });
                this.loadCronSettings();
                this.loadSources();
            }
        });
    }

    loadCronLogs(): void {
        this.showLogs = !this.showLogs;
        if (this.showLogs) {
            this.http.post<any>(`${config.apiurl3}NewsScraper/getCronLogs`, { cron_name: 'news_scraper', limit: 20 })
                .subscribe({
                    next: (res) => {
                        this.cronLogs = res.data || [];
                    }
                });
        }
    }

    isCronEnabled(): boolean {
        return this.cronSettings?.is_enabled === '1' || this.cronSettings?.is_enabled === 1;
    }

    getStatusClass(): string {
        if (!this.cronSettings) return 'text-gray-500';
        if (this.cronSettings.last_status === 'running') return 'text-blue-500';
        if (this.cronSettings.last_status === 'success') return 'text-green-500';
        if (this.cronSettings.last_status === 'failed') return 'text-red-500';
        return 'text-gray-500';
    }

    // ==================== NEWS SOURCES ====================

    loadSources(): void {
        this.loading = true;
        const payload: any = {};
        if (this.filterType) {
            payload.predictor_type = this.filterType;
        }
        
        this.http.post<any>(`${config.apiurlApps}PremiumPredictor/getNewsSources`, payload)
            .subscribe({
                next: (res) => {
                    this.sources = res.data || [];
                    this.loading = false;
                },
                error: () => {
                    this.loading = false;
                    this.snackBar.open('Failed to load news sources', 'Close', { duration: 3000 });
                }
            });
    }

    openForm(data?: any): void {
        if (data) {
            this.editMode = true;
            this.form.patchValue(data);
        } else {
            this.editMode = false;
            this.form.reset();
            this.form.patchValue({ is_active: true });
        }
        this.showForm = true;
    }

    closeForm(): void {
        this.showForm = false;
        this.form.reset();
    }

    saveSource(): void {
        if (this.form.invalid) {
            this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
            return;
        }

        this.loading = true;
        this.http.post<any>(`${config.apiurlApps}PremiumPredictor/saveNewsSource`, this.form.value)
            .subscribe({
                next: (res) => {
                    if (res.response_code === '200') {
                        this.snackBar.open('News source saved successfully', 'Close', { duration: 3000 });
                        this.closeForm();
                        this.loadSources();
                    } else {
                        this.snackBar.open(res.response_message || 'Failed to save', 'Close', { duration: 3000 });
                        this.loading = false;
                    }
                },
                error: () => {
                    this.loading = false;
                    this.snackBar.open('Failed to save news source', 'Close', { duration: 3000 });
                }
            });
    }

    deleteSource(item: any): void {
        Swal.fire({
            title: 'Delete News Source?',
            text: `Are you sure you want to delete "${item.source_name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'Yes, delete it'
        }).then((result) => {
            if (result.isConfirmed) {
                this.http.post<any>(`${config.apiurlApps}PremiumPredictor/deleteNewsSource`, { id: item.id })
                    .subscribe({
                        next: () => {
                            this.snackBar.open('News source deleted', 'Close', { duration: 3000 });
                            this.loadSources();
                        }
                    });
            }
        });
    }

    toggleActive(item: any): void {
        const newStatus = item.is_active === '1' || item.is_active === 1 ? 0 : 1;
        this.http.post<any>(`${config.apiurlApps}PremiumPredictor/saveNewsSource`, {
            id: item.id,
            predictor_type: item.predictor_type,
            source_name: item.source_name,
            source_url: item.source_url,
            is_active: newStatus
        }).subscribe({
            next: () => {
                this.snackBar.open(`Source ${newStatus ? 'activated' : 'deactivated'}`, 'Close', { duration: 3000 });
                this.loadSources();
            }
        });
    }

    getPredictorTypeName(code: string): string {
        const type = this.predictorTypes.find(t => t.code === code);
        return type ? type.name : code;
    }
}
