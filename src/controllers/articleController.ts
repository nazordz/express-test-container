import { clearCache, getOrSetCache, redisClient } from "@/configs/redis";
import Article from "@/models/article";
import { CreateArticleRequest } from "@/models/model";
import { Request, Response } from "express";
import * as articleRepo from "@/repositories/articleRepo";

export async function getArticles(req: Request, res: Response) {
  try {
    const articles = await getOrSetCache<Article[]>(
      "/api/articles",
      async () => {
        return await articleRepo.getArticles();
      }
    );
    res.json(articles);
  } catch (error) {
    res.json(error);
  }
}

export async function createArticle(
  req: Request<{}, {}, CreateArticleRequest>,
  res: Response
) {
  try {
    const article = new Article({
      title: req.body.title,
      slug: req.body.slug,
      author: req.body.author,
      content: req.body.content,
    });
    const newArticle = await articleRepo.createArticle(article);
    clearCache("/api/articles");
    res.json(newArticle);
  } catch (error) {
    res.json(error);
  }
}
