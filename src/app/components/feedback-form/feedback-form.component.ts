
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [FormsModule, CommonModule],  // Import MatRatingModule here
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.css']  // Fix typo: styleUrls
})
export class FeedbackFormComponent {
  @Input() taskId: number | null = null;

  @Output() close = new EventEmitter<void>();

  rating = 0;
  feedback = '';

  constructor(private authService: AuthService) {
    this.taskId = null;
  }

  closeModal() {
    this.close.emit();
  }

  submitFeedback() {
    if (this.rating && this.feedback) {
      this.authService.rateTask(this.taskId!, this.rating, this.feedback).subscribe(() => {
        this.closeModal();
      });
    } else {
      alert('Please provide both a rating and feedback.');
    }
  }
}

