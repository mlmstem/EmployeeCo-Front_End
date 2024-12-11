import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Post } from '../interfaces/post';
import { CreatePostDto } from '../interfaces/create-post-dto';
import { UpdatePostDto } from '../interfaces/update-post-dto';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  apiUrl: string = `${environment.apiUrl}/posts`;

  // Cache for posts
  private postsCache = new BehaviorSubject<Post[] | null>(null);

  constructor(private http: HttpClient) {}

  // Get all posts
  getPosts(): Observable<Post[]> {
    if (this.postsCache.value) {
      return of(this.postsCache.value); // Return cached posts
    }
    return this.http.get<Post[]>(this.apiUrl).pipe(
      tap((posts) => this.postsCache.next(posts)) // Populate cache
    );
  }

  // Get posts with no comments
  getPostsWithNoComments(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/empty`);
  }

  // Get a single post by ID
  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  // Create a new post
  createPost(createPostDto: CreatePostDto): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/create`, createPostDto).pipe(
      tap((newPost) => this.addToPostsCache(newPost)) // Add to cache
    );
  }

  // Update a post
  updatePost(id: number, updatePostDto: UpdatePostDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updatePostDto).pipe(
      tap(() => this.refreshPostsCache()) // Refresh cache
    );
  }

  // Delete a post
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.refreshPostsCache()) // Refresh cache
    );
  }

  // Cache Management
  private addToPostsCache(newPost: Post): void {
    const currentPosts = this.postsCache.value || [];
    this.postsCache.next([...currentPosts, newPost]);
  }

  private refreshPostsCache(): void {
    this.http.get<Post[]>(this.apiUrl).subscribe((posts) => {
      this.postsCache.next(posts);
    });
  }

  clearPostsCache(): void {
    this.postsCache.next(null);
  }
}
