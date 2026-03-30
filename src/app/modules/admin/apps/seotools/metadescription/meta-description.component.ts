import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CampusService } from 'app/modules/service/campus.service';

interface GeneratedResult {
  title: string;
  contentType: string;
  metaDescription: string;
  characterCount: number;
  timestamp: Date;
}

interface BatchResult {
  title: string;
  contentType: string;
  metaDescription?: string;
  characterCount?: number;
  success: boolean;
  error?: string;
  itemId?: number;
}

@Component({
  selector: 'app-meta-description',
  templateUrl: './meta-description.component.html',
  styleUrls: ['./meta-description.component.scss']
})
export class MetaDescriptionComponent implements OnInit {
  @ViewChild('batchDialog') batchDialog: TemplateRef<any>;

  // Form fields
  title: string = '';
  primaryKeyword: string = '';
  secondaryKeywords: string = '';
  contentType: string = 'Article';
  keyDetails: string = '';

  // Content types dropdown
  contentTypes: string[] = ['Article', 'College', 'Exam', 'Course'];

  // State
  loading: boolean = false;
  generatedDescription: string = '';
  characterCount: number = 0;
  error: string = '';
  success: string = '';
  copied: boolean = false;

  // History of generated descriptions
  history: GeneratedResult[] = [];

  // Batch generation
  batchContentType: string = 'College';
  batchLimit: number = 10;
  batchProcessing: boolean = false;
  batchProgress: number = 0;
  batchTotal: number = 0;
  batchResults: BatchResult[] = [];

  constructor(
    private campusService: CampusService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    const savedHistory = localStorage.getItem('metaDescHistory');
    if (savedHistory) {
      this.history = JSON.parse(savedHistory);
    }
  }

  generate() {
    if (!this.title.trim()) {
      this.error = 'Title is required';
      return;
    }
    if (!this.contentType) {
      this.error = 'Content type is required';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';
    this.generatedDescription = '';
    this.characterCount = 0;

    const secondaryKeywordsArray = this.secondaryKeywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const payload = {
      title: this.title.trim(),
      primary_keyword: this.primaryKeyword.trim() || this.title.trim(),
      secondary_keywords: secondaryKeywordsArray,
      content_type: this.contentType,
      key_details: this.keyDetails.trim()
    };

    this.campusService.generateMetaDescription(payload).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response && response.response_code === 1) {
          this.generatedDescription = response.meta_description;
          this.characterCount = response.character_count;
          this.success = 'Meta description generated successfully!';

          const result: GeneratedResult = {
            title: this.title,
            contentType: this.contentType,
            metaDescription: response.meta_description,
            characterCount: response.character_count,
            timestamp: new Date()
          };
          this.history.unshift(result);
          
          if (this.history.length > 20) {
            this.history = this.history.slice(0, 20);
          }
          
          localStorage.setItem('metaDescHistory', JSON.stringify(this.history));
        } else {
          this.error = response?.message || 'Failed to generate meta description';
          if (response?.fallback_description) {
            this.generatedDescription = response.fallback_description;
            this.characterCount = response.fallback_description.length;
            this.success = 'Used fallback template (AI unavailable)';
          }
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.error = 'Network error. Please try again.';
        console.error('Meta description generation failed', err);
      }
    });
  }

  copyToClipboard() {
    if (this.generatedDescription) {
      navigator.clipboard.writeText(this.generatedDescription).then(() => {
        this.copied = true;
        setTimeout(() => this.copied = false, 2000);
      });
    }
  }

  clearForm() {
    this.title = '';
    this.primaryKeyword = '';
    this.secondaryKeywords = '';
    this.contentType = 'Article';
    this.keyDetails = '';
    this.generatedDescription = '';
    this.characterCount = 0;
    this.error = '';
    this.success = '';
  }

  loadFromHistory(item: GeneratedResult) {
    this.title = item.title;
    this.contentType = item.contentType;
    this.generatedDescription = item.metaDescription;
    this.characterCount = item.characterCount;
  }

  clearHistory() {
    this.history = [];
    localStorage.removeItem('metaDescHistory');
  }

  getCharacterCountClass(): string {
    if (this.characterCount >= 140 && this.characterCount <= 160) {
      return 'text-green-600';
    } else if (this.characterCount > 0 && (this.characterCount < 140 || this.characterCount > 160)) {
      return 'text-orange-500';
    }
    return 'text-gray-500';
  }

  openBatchDialog() {
    this.batchContentType = 'College';
    this.batchLimit = 10;
    this.batchResults = [];
    this.dialog.open(this.batchDialog, {
      width: '500px',
      disableClose: this.batchProcessing
    });
  }

  startBatchGeneration() {
    if (!this.batchContentType || this.batchProcessing) return;

    this.batchProcessing = true;
    this.batchProgress = 0;
    this.batchResults = [];

    this.campusService.generateBatchMetaDescriptions(this.batchContentType, this.batchLimit).subscribe({
      next: (response: any) => {
        this.batchProcessing = false;
        if (response && response.response_code === 1) {
          this.batchTotal = response.total;
          this.batchResults = response.results.map((r: any) => ({
            title: r.title,
            contentType: this.batchContentType,
            metaDescription: r.meta_description,
            characterCount: r.character_count,
            success: r.success,
            error: r.error,
            itemId: r.item_id
          }));
          this.dialog.closeAll();
        } else {
          this.error = response?.message || 'Batch generation failed';
        }
      },
      error: (err: any) => {
        this.batchProcessing = false;
        this.error = 'Batch generation failed. Please try again.';
        console.error('Batch generation failed', err);
      }
    });
  }

  copyBatchResult(result: BatchResult) {
    if (result.metaDescription) {
      navigator.clipboard.writeText(result.metaDescription);
    }
  }

  exportBatchResults() {
    if (this.batchResults.length === 0) return;

    let csv = 'Title,Content Type,Meta Description,Character Count,Status\n';
    this.batchResults.forEach(r => {
      const desc = r.metaDescription ? r.metaDescription.replace(/"/g, '""') : '';
      csv += `"${r.title}","${r.contentType}","${desc}",${r.characterCount || 0},${r.success ? 'Success' : 'Failed'}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meta-descriptions-${this.batchContentType.toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
