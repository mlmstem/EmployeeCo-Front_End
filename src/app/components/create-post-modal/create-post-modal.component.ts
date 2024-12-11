import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { CreatePostDto } from '../../interfaces/create-post-dto';
import { CommonModule } from '@angular/common'; // Add this for template directives like *ngIf and *ngFor

@Component({
  selector: 'app-create-post-modal',
  standalone: true, // Declare this as a standalone component
  imports: [FormsModule, CommonModule], // Import FormsModule for ngModel
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.css']
})
export class CreatePostModalComponent {
  @Input() categories: string[] = [];
  @Output() postCreated = new EventEmitter<void>();
  @Output() closeModalEvent = new EventEmitter<void>();

  post: CreatePostDto = {
    title: '',
    author: '',
    category: '',
    content: ''
  };

  constructor(private postService: PostService, private authService: AuthService) {}

  ngOnInit(): void {
    this.setAuthorFromAuthService();
  }

  setAuthorFromAuthService(): void {
    const userDetail = this.authService.getUserDetail();
    if (userDetail) {
      this.post.author = userDetail.fullName || 'Anonymous'; // Fallback to 'Anonymous'
    }
  }

  createPost(form: NgForm): void {
    if (form.valid) {
      this.postService.createPost(this.post).subscribe({
        next: () => {
          this.postCreated.emit(); // Notify parent
          this.closeModal();
        },
        error: (err) => console.error('Error creating post:', err)
      });
    }
  }

  closeModal(): void {
    this.closeModalEvent.emit();
  }
}

