import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service';

interface ExamConfig {
  exam_type: string;
  subjects: string[];
  total_questions: number;
  duration: number;
  sections: { [key: string]: number };
  topics: { [key: string]: string[] };
}

@Component({
  selector: 'app-ai-generator',
  templateUrl: './ai-generator.component.html',
  styleUrls: ['./ai-generator.component.scss']
})
export class AiGeneratorComponent implements OnInit {
  generatorForm: FormGroup;
  examConfigs: ExamConfig[] = [];
  selectedExam: ExamConfig | null = null;
  isLoading = false;
  isGenerating = false;
  generationProgress = 0;
  generatedTest: any = null;
  previewMode = false;
  
  difficultyOptions = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private campusService: CampusService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.generatorForm = this.fb.group({
      exam_type: ['', Validators.required],
      title: [''],
      subjects: [[]],
      num_questions: [30, [Validators.required, Validators.min(5), Validators.max(200)]],
      easy_percent: [30, [Validators.min(0), Validators.max(100)]],
      medium_percent: [50, [Validators.min(0), Validators.max(100)]],
      hard_percent: [20, [Validators.min(0), Validators.max(100)]],
      save_as_draft: [true]
    });
  }
  
  ngOnInit(): void {
    this.loadExamConfigs();
  }
  
  loadExamConfigs(): void {
    this.isLoading = true;
    this.campusService.getAIExamConfigs().subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res.response_code === 1) {
          this.examConfigs = res.response_data;
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Error loading exam configs:', error);
      }
    );
  }
  
  onExamTypeChange(): void {
    const examType = this.generatorForm.get('exam_type').value;
    this.selectedExam = this.examConfigs.find(e => e.exam_type === examType) || null;
    
    if (this.selectedExam) {
      this.generatorForm.patchValue({
        subjects: this.selectedExam.subjects,
        num_questions: Math.min(30, this.selectedExam.total_questions),
        title: `AI Generated - ${examType} Practice Test`
      });
    }
  }
  
  getTotalPercent(): number {
    return (
      this.generatorForm.get('easy_percent').value +
      this.generatorForm.get('medium_percent').value +
      this.generatorForm.get('hard_percent').value
    );
  }
  
  generateTest(): void {
    if (this.getTotalPercent() !== 100) {
      this.snackBar.open('Difficulty percentages must sum to 100%', 'Close', { duration: 3000 });
      return;
    }
    
    if (!this.generatorForm.valid) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }
    
    this.isGenerating = true;
    this.generationProgress = 10;
    
    const formData = this.generatorForm.value;
    const requestData = {
      exam_type: formData.exam_type,
      title: formData.title || `AI Generated - ${formData.exam_type} Practice Test`,
      subjects: formData.subjects,
      num_questions: formData.num_questions,
      difficulty_distribution: {
        easy: formData.easy_percent,
        medium: formData.medium_percent,
        hard: formData.hard_percent
      },
      save_as_draft: formData.save_as_draft
    };
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      if (this.generationProgress < 90) {
        this.generationProgress += 10;
      }
    }, 2000);
    
    this.campusService.generateAITest(requestData).subscribe(
      (res: any) => {
        clearInterval(progressInterval);
        this.generationProgress = 100;
        this.isGenerating = false;
        
        if (res.response_code === 1) {
          this.generatedTest = res.response_data;
          this.snackBar.open(`Test generated with ${res.response_data.total_questions} questions!`, 'Close', { duration: 5000 });
          
          // Load preview
          this.loadPreview(res.response_data.test_id);
        } else {
          this.snackBar.open(res.response_message || 'Generation failed', 'Close', { duration: 5000 });
        }
      },
      (error) => {
        clearInterval(progressInterval);
        this.isGenerating = false;
        this.generationProgress = 0;
        this.snackBar.open('Error generating test. Please try again.', 'Close', { duration: 5000 });
        console.error('Generation error:', error);
      }
    );
  }
  
  loadPreview(testId: number): void {
    this.campusService.previewAITest({ test_id: testId }).subscribe(
      (res: any) => {
        if (res.response_code === 1) {
          this.generatedTest = res.response_data;
          this.previewMode = true;
        }
      },
      (error) => {
        console.error('Error loading preview:', error);
      }
    );
  }
  
  publishTest(): void {
    if (!this.generatedTest?.id) return;
    
    this.campusService.publishAITest({ test_id: this.generatedTest.id }).subscribe(
      (res: any) => {
        if (res.response_code === 1) {
          this.snackBar.open('Test published successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/admin/apps/mocktests/testlist']);
        } else {
          this.snackBar.open(res.response_message || 'Failed to publish', 'Close', { duration: 3000 });
        }
      },
      (error) => {
        this.snackBar.open('Error publishing test', 'Close', { duration: 3000 });
      }
    );
  }
  
  editQuestion(question: any, index: number): void {
    // Navigate to question editor or open dialog
    this.router.navigate(['/admin/apps/mocktests/questions', this.generatedTest.id], {
      queryParams: { questionId: question.id }
    });
  }
  
  regenerateQuestion(questionId: number): void {
    if (!this.generatedTest?.id) return;
    
    this.campusService.regenerateAIQuestions({
      test_id: this.generatedTest.id,
      question_ids: [questionId]
    }).subscribe(
      (res: any) => {
        if (res.response_code === 1) {
          this.snackBar.open(res.response_message, 'Close', { duration: 3000 });
          this.loadPreview(this.generatedTest.id);
        } else {
          this.snackBar.open(res.response_message || 'Failed to regenerate', 'Close', { duration: 3000 });
        }
      },
      (error) => {
        this.snackBar.open('Error regenerating question', 'Close', { duration: 3000 });
      }
    );
  }
  
  goToTestList(): void {
    this.router.navigate(['/admin/apps/mocktests/testlist']);
  }
  
  resetForm(): void {
    this.generatorForm.reset({
      exam_type: '',
      title: '',
      subjects: [],
      num_questions: 30,
      easy_percent: 30,
      medium_percent: 50,
      hard_percent: 20,
      save_as_draft: true
    });
    this.selectedExam = null;
    this.generatedTest = null;
    this.previewMode = false;
    this.generationProgress = 0;
  }
  
  getCorrectOption(options: any[]): string {
    const correctIdx = options?.findIndex(o => o.is_correct === '1' || o.is_correct === true);
    return correctIdx >= 0 ? String.fromCharCode(65 + correctIdx) : 'N/A';
  }
}
