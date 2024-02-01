import { Router } from 'express';
import * as ArticleController from '@/controllers/articleController';

const router = Router();

router.get('/', ArticleController.getArticles)
router.post('/', ArticleController.createArticle)

export default router;