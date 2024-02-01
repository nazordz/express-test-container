import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { RedisContainer, StartedRedisContainer } from "@testcontainers/redis";
import { Client } from "pg";
import * as articleRepo from "@/repositories/articleRepo";
import Article from "@/models/article";
import redis, { createClient, RedisClientType } from "redis";

type RedisClient = RedisClientType<redis.RedisModules, redis.RedisFunctions, redis.RedisScripts>

describe("Article Repository", () => {
  jest.setTimeout(60000);

  let postgresContainer: StartedPostgreSqlContainer;
  let postgresClient: Client;
  let redisContainer: StartedRedisContainer;
  let redisClient: RedisClient

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer('postgres:16-alpine3.18')
      .start();
    postgresClient = new Client({
      connectionString: postgresContainer.getConnectionUri(),
    });
    await postgresClient.connect();
    await createSchema(postgresClient)
    await createArticletable(postgresClient)
    
    redisContainer = await new RedisContainer('redis:7.2.4-alpine').start();
    redisClient = await connectToRedis(redisContainer)

  });

  afterAll(async () => {
    await postgresClient.end();
    await postgresContainer.stop();

    await redisClient.disconnect();
    await redisContainer.stop();
  });

  it("should create and return an article", async () => {
    const article = await articleRepo.createArticle(
      new Article({
        content: "lorem ipsum",
        slug: "lorem-ipsum",
        title: "lorem",
        author: "anonymous",
      })
    );
    expect(article).not.toBeNull();
  });

  it('should get articles', async () => {
    const articles = await articleRepo.getArticles();
    expect(articles).not.toHaveLength(0);
  })

});

async function connectToRedis(container: StartedRedisContainer) {
  const client = createClient({
    url: container.getConnectionUrl(),
  });
  await client.connect();
  expect(client.isOpen).toBeTruthy();
  return client;
}

async function createSchema(client: Client) {
  const sql = `CREATE SCHEMA article;`;
  await client.query(sql);
}

async function createArticletable(client: Client) {
  const sql = `CREATE TABLE article.articles (
    id uuid NOT NULL,
    title varchar NOT NULL,
    slug varchar NOT NULL,
    "content" text NOT NULL,
    author varchar NULL,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL,
    CONSTRAINT articles_pk PRIMARY KEY (id)
  );`;
    await client.query(sql);
}