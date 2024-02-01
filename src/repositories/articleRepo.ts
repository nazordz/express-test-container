import Article from "@/models/article";

export async function getArticles() {
  const articles = await Article.findAll();
  return articles;
}

export async function createArticle(articleData: Article) {
  const article = await Article.create({
    title: articleData.title,  
    slug: articleData.slug,
    author: articleData.author,
    content: articleData.content,
  })
  return article;
}