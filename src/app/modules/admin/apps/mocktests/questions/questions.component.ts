import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service';
import Swal from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as xlsx from 'xlsx';

@Component({
    selector: 'app-questions',
    templateUrl: './questions.component.html',
    styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('editQuestionDialog') editQuestionDialog: TemplateRef<any>;
    @ViewChild('uploadDialog') uploadDialog: TemplateRef<any>;
    @ViewChild('fileInput') fileInput: ElementRef;

    displayedColumns: string[] = ['Sr.No', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'marks', 'actions'];
    questionsData: any[] = [];
    dataSource: any;
    listLoader: boolean = false;
    page: number = 1;
    pageSize: number = 10;
    startNum: number = 0;
    recordsTotal: any = 0;
    showMathPreview: boolean = true;  // Toggle for LaTeX preview

    testId: number = null;
    testDetails: any = {};
    
    editForm: FormGroup;
    editLoader: boolean = false;
    currentQuestionId: number = null;
    uploadLoader: boolean = false;
    selectedFile: File = null;
    selectedImage: File = null;
    imagePreview: string = null;
    currentImageUrl: string = null;

    correctAnswers = [
        { id: 'A', name: 'Option A' },
        { id: 'B', name: 'Option B' },
        { id: 'C', name: 'Option C' },
        { id: 'D', name: 'Option D' }
    ];

    constructor(
        private _formBuilder: FormBuilder,
        private campusService: CampusService,
        private route: ActivatedRoute,
        public _route: Router,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.testId = params['testId'];
            if (this.testId) {
                this.getTestDetails();
                this.getQuestions();
            } else {
                this._route.navigate(['/apps/mocktests/testlist']);
            }
        });

        this.editForm = this._formBuilder.group({
            question: [''],
            option_a: [''],
            option_b: [''],
            option_c: [''],
            option_d: [''],
            correct_answer: ['A'],
            marks: [4],
            negative_marks: [1],
            explanation: [''],
            subject: [''],
            topic: [''],
            image_url: ['']
        });
    }

    getTestDetails() {
        this.campusService.getMockTestById(this.testId).subscribe((res) => {
            if (res.response_code === 1 || res.response_code === '1') {
                this.testDetails = res.response_data || {};
            }
        });
    }

    onPageChange(event: PageEvent): void {
        this.page = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.startNum = (this.pageSize * (event.pageIndex));
        this.getQuestions();
    }

    getQuestions() {
        this.listLoader = true;
        this.campusService.getMockTestQuestions(this.testId).subscribe((res) => {
            if (res.response_code === 1 || res.response_code === '1') {
                this.questionsData = res.response_data?.data || res.response_data || [];
                this.recordsTotal = this.questionsData.length;
                this.dataSource = new MatTableDataSource<any>(this.questionsData);
            } else {
                this.questionsData = [];
                this.dataSource = new MatTableDataSource<any>([]);
            }
            this.listLoader = false;
        }, (error) => {
            this.listLoader = false;
            this.questionsData = [];
            this.dataSource = new MatTableDataSource<any>([]);
        });
    }

    addNewQuestion() {
        this.currentQuestionId = null;
        this.selectedImage = null;
        this.imagePreview = null;
        this.currentImageUrl = null;
        this.editForm.reset({
            question: '',
            option_a: '',
            option_b: '',
            option_c: '',
            option_d: '',
            correct_answer: 'A',
            marks: 4,
            negative_marks: 1,
            explanation: '',
            subject: '',
            topic: '',
            image_url: ''
        });
        this.dialog.open(this.editQuestionDialog, { width: '750px', maxHeight: '90vh' });
    }

    editQuestion(question) {
        console.log('Editing question:', question);
        console.log('image_url from question:', question.image_url);
        
        this.currentQuestionId = question.id;
        this.selectedImage = null;
        this.imagePreview = null;
        this.currentImageUrl = question.image_url || null;
        
        console.log('currentImageUrl set to:', this.currentImageUrl);
        
        this.editForm.patchValue({
            question: question.question,
            option_a: question.option_a,
            option_b: question.option_b,
            option_c: question.option_c,
            option_d: question.option_d,
            correct_answer: question.correct_answer,
            marks: question.marks,
            negative_marks: question.negative_marks,
            explanation: question.explanation,
            subject: question.subject,
            topic: question.topic,
            image_url: question.image_url || ''
        });
        this.dialog.open(this.editQuestionDialog, { width: '750px', maxHeight: '90vh' });
    }

    onImageSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.selectedImage = input.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imagePreview = e.target?.result as string;
            };
            reader.readAsDataURL(this.selectedImage);
        }
    }

    removeImage() {
        this.selectedImage = null;
        this.imagePreview = null;
        this.currentImageUrl = null;
        this.editForm.patchValue({ image_url: '' });
    }

    async uploadImage(): Promise<string> {
        if (!this.selectedImage) return this.editForm.value.image_url || '';
        
        const formData = new FormData();
        formData.append('image', this.selectedImage);
        
        try {
            const res: any = await this.campusService.uploadMockTestImage(formData).toPromise();
            if (res.response_code === 1 || res.response_code === '1') {
                return res.image_url;
            }
        } catch (error) {
            console.error('Image upload failed:', error);
        }
        return '';
    }

    async saveQuestion() {
        this.editLoader = true;
        
        // Upload image first if selected
        let imageUrl = this.editForm.value.image_url || '';
        if (this.selectedImage) {
            imageUrl = await this.uploadImage();
        }
        
        const questionData = {
            ...this.editForm.value,
            test_id: this.testId,
            image_url: imageUrl
        };

        if (this.currentQuestionId) {
            questionData.id = this.currentQuestionId;
            this.campusService.updateMockTestQuestion(questionData).subscribe((res) => {
                this.editLoader = false;
                if (res.response_code === 1 || res.response_code === '1') {
                    Swal.fire('Success', 'Question updated successfully', 'success');
                    this.dialog.closeAll();
                    this.getQuestions();
                } else {
                    Swal.fire('Error', res.response_message || 'Failed to update question', 'error');
                }
            }, () => {
                this.editLoader = false;
                Swal.fire('Error', 'Failed to update question', 'error');
            });
        } else {
            this.campusService.insertMockTestQuestion(questionData).subscribe((res) => {
                this.editLoader = false;
                if (res.response_code === 1 || res.response_code === '1') {
                    Swal.fire('Success', 'Question added successfully', 'success');
                    this.dialog.closeAll();
                    this.getQuestions();
                } else {
                    Swal.fire('Error', res.response_message || 'Failed to add question', 'error');
                }
            }, () => {
                this.editLoader = false;
                Swal.fire('Error', 'Failed to add question', 'error');
            });
        }
    }

    deleteQuestion(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this question?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                this.campusService.deleteMockTestQuestion(id).subscribe((res) => {
                    if (res.response_code === 1 || res.response_code === '1') {
                        this.getQuestions();
                        Swal.fire('Deleted!', 'Question has been deleted.', 'success');
                    } else {
                        Swal.fire({ icon: 'warning', text: res.response_message || 'Failed to delete' });
                    }
                });
            }
        });
    }

    openUploadDialog() {
        this.selectedFile = null;
        this.dialog.open(this.uploadDialog, { width: '600px' });
    }

    onFileSelected(event) {
        this.selectedFile = event.target.files[0];
    }

    uploadExcel() {
        if (!this.selectedFile) {
            Swal.fire('Error', 'Please select an Excel file', 'error');
            return;
        }

        this.uploadLoader = true;
        const reader = new FileReader();
        
        reader.onload = (e: any) => {
            const workbook = xlsx.read(e.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);

            // Transform Excel data to question format
            const questions = jsonData.map((row: any) => ({
                question: row['Question'] || row['question'],
                option_a: row['Option A'] || row['option_a'] || row['A'],
                option_b: row['Option B'] || row['option_b'] || row['B'],
                option_c: row['Option C'] || row['option_c'] || row['C'],
                option_d: row['Option D'] || row['option_d'] || row['D'],
                correct_answer: row['Correct Answer'] || row['correct_answer'] || row['Answer'] || 'A',
                marks: row['Marks'] || row['marks'] || 4,
                negative_marks: row['Negative Marks'] || row['negative_marks'] || 1,
                explanation: row['Explanation'] || row['explanation'] || '',
                subject: row['Subject'] || row['subject'] || '',
                topic: row['Topic'] || row['topic'] || ''
            }));

            if (questions.length === 0) {
                this.uploadLoader = false;
                Swal.fire('Error', 'No valid questions found in the Excel file', 'error');
                return;
            }

            // Bulk insert questions
            this.campusService.bulkInsertMockTestQuestions(this.testId, questions).subscribe((res) => {
                this.uploadLoader = false;
                if (res.response_code === 1 || res.response_code === '1') {
                    Swal.fire('Success', `${questions.length} questions uploaded successfully`, 'success');
                    this.dialog.closeAll();
                    this.getQuestions();
                } else {
                    Swal.fire('Error', res.response_message || 'Failed to upload questions', 'error');
                }
            }, () => {
                this.uploadLoader = false;
                Swal.fire('Error', 'Failed to upload questions', 'error');
            });
        };

        reader.readAsBinaryString(this.selectedFile);
    }

    downloadTemplate() {
        const templateData = [
            {
                'Question': 'What is the atomic number of Carbon?',
                'Option A': '4',
                'Option B': '6',
                'Option C': '8',
                'Option D': '12',
                'Correct Answer': 'B',
                'Marks': 4,
                'Negative Marks': 1,
                'Subject': 'Chemistry',
                'Topic': 'Periodic Table',
                'Explanation': 'Carbon has 6 protons in its nucleus.'
            },
            {
                'Question': 'What is 2 + 2?',
                'Option A': '3',
                'Option B': '4',
                'Option C': '5',
                'Option D': '6',
                'Correct Answer': 'B',
                'Marks': 4,
                'Negative Marks': 1,
                'Subject': 'Mathematics',
                'Topic': 'Basic Arithmetic',
                'Explanation': '2 + 2 = 4'
            }
        ];

        const ws = xlsx.utils.json_to_sheet(templateData);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Questions');
        xlsx.writeFile(wb, 'mock_test_questions_template.xlsx');
    }

    close() {
        this.dialog.closeAll();
    }

    goBack() {
        this._route.navigate(['/apps/mocktests/testlist']);
    }

    truncateText(text: string, length: number = 50): string {
        if (!text) return '-';
        return text.length > length ? text.substring(0, length) + '...' : text;
    }
}
