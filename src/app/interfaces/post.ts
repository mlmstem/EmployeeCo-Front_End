export interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  category: string;
  content: string;
  comments: Comment[];
  showComments: boolean;
}

export interface Comment {
  content: string;
  date: string;
}
