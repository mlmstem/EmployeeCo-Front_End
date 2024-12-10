import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [FormsModule, CommonModule], // Include CommonModule
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent {
  categories = [
    { name: 'Game title1', count: 10 },
    { name: 'Game title2', count: 4 },
    { name: 'Game title3', count: 5 },
    { name: 'Game title4', count: 2 }
  ];

  posts = [
    {
      id: 1,
      title: 'User Profile/ACL to Control Target Blog Audience',
      author: 'Daniel Pierce',
      date: '3 minutes ago',
      category: 'Category name',
      content: 'Lorem ipsum dolor sit amet...',
      comments: [
        { content: 'Interesting post!', date: '2 minutes ago' },
        { content: 'I have a similar issue.', date: '1 minute ago' }
      ],
      showComments: true
    },
    {
      id: 2,
      title: 'Help & Suggestions',
      author: 'Daniel Pierce',
      date: '5 minutes ago',
      category: 'Category name',
      content: 'Another interesting topic...',
      comments: [{ content: 'Thanks for this!', date: '4 minutes ago' }],
      showComments: true
    }
  ];

  newComment = '';

  toggleComments(postId: number): void {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.showComments = !post.showComments;
    }
  }

  addComment(postId: number): void {
    const post = this.posts.find(p => p.id === postId);
    if (post && this.newComment.trim()) {
      post.comments.push({ content: this.newComment, date: 'Just now' });
      this.newComment = '';
    }
  }
}

