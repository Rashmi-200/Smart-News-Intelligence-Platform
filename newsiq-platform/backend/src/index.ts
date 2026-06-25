import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRouter from "./routes/auth";
import articlesRouter from "./routes/articles";
import bookmarksRouter from "./routes/bookmarks";
import historyRouter from "./routes/history";
import alertsRouter from "./routes/alerts";
import notificationsRouter from "./routes/notifications";
import financialRouter from "./routes/financial";
import climateRouter from "./routes/climate";
import { getCategories } from "./controllers/articleController";
import { initAlertMatcher } from "./services/alertMatcher";

dotenv.config({ path: "../.env" });

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/bookmarks', bookmarksRouter);
app.use('/api/history', historyRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/financial', financialRouter);
app.use('/api/climate', climateRouter);
app.get('/api/categories', getCategories);

app.get("/health", async (_req: Request, res: Response) => {
  try {
    const articleCount = await prisma.article.count();
    res.json({ status: "ok", articleCount });
  } catch (e) {
    res.status(500).json({ status: "error", message: (e as Error).message });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening on port ${process.env.PORT || 5000}`);
  initAlertMatcher();
});
// Restarted after alerts and notifications integration

