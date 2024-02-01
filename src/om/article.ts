import { redisClient } from '@/configs/redis'
import { Repository, Schema } from 'redis-om'

const articleSchema = new Schema('article', {
  id: { type: 'string' },
  title: {type: 'string'},
  slug: {type: 'string'},
  content: {type: 'text'},
  author: {type: 'string'}
}, {
  dataStructure: 'JSON'
})

export const articleRepository = new Repository(articleSchema, redisClient)