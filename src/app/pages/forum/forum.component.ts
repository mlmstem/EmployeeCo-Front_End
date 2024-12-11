import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { Post } from '../../interfaces/post';
import { CreatePostModalComponent } from '../../components/create-post-modal/create-post-modal.component';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [FormsModule, CommonModule, CreatePostModalComponent],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  categories = [
    { name: 'Game title1', count: 10 },
    { name: 'Game title2', count: 4 },
    { name: 'Game title3', count: 5 },
    { name: 'Game title4', count: 2 }
  ];

  categoryNames: string[] = [];
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  activeTab = 'All';
  isCreatePostModalVisible = false;

  commentInputs: { [key: number]: string } = {}; // Track comment input for each post
  activeInputPostId: number | null = null; // Track active post input field

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.categoryNames = this.categories.map(c => c.name);
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.postService.getPosts().subscribe(
      (data: Post[]) => {
        this.posts = data;
        this.updateFilteredPosts();
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  updateFilteredPosts(): void {
    if (this.activeTab === 'Unanswered') {
      this.filteredPosts = this.posts.filter(post => post.comments.length === 0);
    } else {
      this.filteredPosts = [...this.posts];
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.updateFilteredPosts();
  }

  toggleComments(postId: number): void {
    const post = this.filteredPosts.find(p => p.id === postId);
    if (post) {
      post.showComments = !post.showComments;
    }
  }

  showCommentInput(postId: number): void {
    this.activeInputPostId = postId; // Set active post input field
  }

  addComment(postId: number): void {
    const commentContent = this.commentInputs[postId]?.trim();
    if (!commentContent) return;

    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    // Prepare updated comments
    const updatedComments = [...post.comments, { content: commentContent, date: new Date().toISOString() }];

    this.postService.updatePost(postId, { comments: updatedComments }).subscribe({
      next: () => {
        post.comments = updatedComments; // Update local post data
        this.commentInputs[postId] = ''; // Clear input field
        this.activeInputPostId = null; // Hide input field
      },
      error: (err) => console.error('Error updating post comments:', err)
    });
  }

  showCreatePostModal(): void {
    this.isCreatePostModalVisible = true;
  }

  hideCreatePostModal(): void {
    this.isCreatePostModalVisible = false;
  }

  handlePostCreated(): void {
    this.fetchPosts();
    this.hideCreatePostModal();
  }
}

