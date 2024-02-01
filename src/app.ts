import "module-alias/register";

import express, { Express, NextFunction, Request, Response } from "express";
import { getEnv } from "./configs/env";
import bodyParser from "body-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import articleRoutes from "@/routers/articleRoute";

const app: Express = express();
const port = getEnv('PORT', '8080')

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
const limiter = rateLimit({
  max: 1000,
  windowMs: 1 * 60 * 1000,
});
app.use("*", limiter);

app.use(express.json());

// routes
app.use('/api/articles', articleRoutes)

// route not found
app.all("*", (req, res, next) => {
  res.statusCode = 404;
  res.json({
    message: `Can't find ${req.originalUrl} on this server!`
  })
  return;
});

app.listen(port, () => {
  console.log(`[server] server is running at http://localhost:${port}`);
});