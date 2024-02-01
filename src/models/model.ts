export interface CreateArticleRequest {
  title: string;
  slug: string;
  content: string;
  author: string|null;
}