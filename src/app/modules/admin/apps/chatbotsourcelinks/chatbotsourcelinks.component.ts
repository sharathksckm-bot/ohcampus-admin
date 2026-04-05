import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

interface SourceLink {
  id: number;
  title: string;
  url: string;
  category: string;
  description: string;
  is_active: number | string;
}

interface GroupedLinks {
  value: string;
  label: string;
  links: SourceLink[];
}

@Component({
  selector: 'app-chatbotsourcelinks',
  templateUrl: './chatbotsourcelinks.component.html',
  styleUrls: ['./chatbotsourcelinks.component.scss']
})
export class ChatbotsourcelinksComponent implements OnInit {
  links: SourceLink[] = [];
  groupedLinks: GroupedLinks[] = [];
  loading = true;
  showForm = false;
  editingLink: SourceLink | null = null;
  formData: any = { title: '', url: '', category: 'general', description: '', is_active: 1 };
  categories = [
    { value: 'predictor', label: 'Predictor Tools' },
    { value: 'exam', label: 'Exams' },
    { value: 'course', label: 'Courses' },
    { value: 'app', label: 'App Links' },
    { value: 'general', label: 'General' }
  ];

  private apiUrl = 'https://campusapi.ohcampus.com/apps/Chatbot';

  constructor(
    private http: HttpClient, 
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchLinks();
  }

  fetchLinks(): void {
    this.loading = true;
    this.http.get<any>(`${this.apiUrl}/getSourceLinks_api`).subscribe({
      next: (res) => {
        if (res.response_code === '200') {
          this.links = res.data || [];
          this.updateGroupedLinks();
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { 
        this.loading = false; 
        this.snackBar.open('Failed to fetch links', 'Close', { duration: 3000 }); 
      }
    });
  }

  updateGroupedLinks(): void {
    this.groupedLinks = this.categories.map(cat => ({
      ...cat,
      links: this.links.filter(l => l.category === cat.value)
    })).filter(g => g.links.length > 0);
  }

  isActive(link: SourceLink): boolean {
    return Number(link.is_active) === 1;
  }

  openForm(link?: SourceLink): void {
    console.log('openForm called', link);
    this.editingLink = link || null;
    this.formData = link ? { ...link, is_active: Number(link.is_active) } : { title: '', url: '', category: 'general', description: '', is_active: 1 };
    this.showForm = true;
    this.cdr.detectChanges();
  }

  closeForm(): void {
    this.showForm = false;
    this.editingLink = null;
    this.cdr.detectChanges();
  }

  save(): void {
    if (!this.formData.title || !this.formData.url) {
      this.snackBar.open('Title and URL required', 'Close', { duration: 3000 });
      return;
    }
    const endpoint = this.editingLink ? 'updateSourceLink' : 'addSourceLink';
    const body = this.editingLink ? { ...this.formData, id: this.editingLink.id } : this.formData;
    
    this.http.post<any>(`${this.apiUrl}/${endpoint}`, body).subscribe({
      next: (res) => {
        if (res.response_code === '200') {
          this.snackBar.open(this.editingLink ? 'Updated' : 'Added', 'Close', { duration: 2000 });
          this.closeForm();
          this.fetchLinks();
        }
      },
      error: () => this.snackBar.open('Failed', 'Close', { duration: 3000 })
    });
  }

  delete(id: number): void {
    console.log('delete called', id);
    if (!confirm('Delete this link?')) return;
    this.http.post<any>(`${this.apiUrl}/deleteSourceLink`, { id }).subscribe({
      next: () => { 
        this.snackBar.open('Deleted', 'Close', { duration: 2000 }); 
        this.fetchLinks(); 
      },
      error: () => this.snackBar.open('Failed', 'Close', { duration: 3000 })
    });
  }

  toggleActive(link: SourceLink): void {
    console.log('toggleActive called', link);
    const newStatus = Number(link.is_active) === 1 ? 0 : 1;
    this.http.post<any>(`${this.apiUrl}/updateSourceLink`, { id: link.id, is_active: newStatus }).subscribe({
      next: () => {
        this.snackBar.open(newStatus ? 'Activated' : 'Deactivated', 'Close', { duration: 2000 });
        this.fetchLinks();
      },
      error: () => this.snackBar.open('Failed to update', 'Close', { duration: 3000 })
    });
  }
}
