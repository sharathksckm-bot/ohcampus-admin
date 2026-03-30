import { Component, OnInit } from '@angular/core';
import { CampusService } from 'app/modules/service/campus.service';

interface GeneratedResult {
  title: string;
  contentType: string;
  metaDescription: string;
  characterCount: number;
  timestamp: Date;
}

@Component({
  selector: 'app-meta-description',
  templateUrl: './meta-description.component.html',
  styleUrls: ['./meta-description.component.scss']
})
export class MetaDescriptionComponent implements OnInit {

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

  constructor(private campusService: CampusService) { }

  ngOnInit() {
    // Load history from localStorage if available
    const savedHistory = localStorage.getItem('metaDescHistory');
    if (savedHistory) {
      this.history = JSON.parse(savedHistory);
    }
  }

  generate() {
    // Validation
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

    // Parse secondary keywords
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

          // Add to history
          const result: GeneratedResult = {
            title: this.title,
            contentType: this.contentType,
            metaDescription: response.meta_description,
            characterCount: response.character_count,
            timestamp: new Date()
          };
          this.history.unshift(result);
          
          // Keep only last 20 items
          if (this.history.length > 20) {
            this.history = this.history.slice(0, 20);
          }
          
          // Save to localStorage
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
}
