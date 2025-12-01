import { ALLOWED_ORIGINS, PORT } from '@/env';
import { authMiddleware } from '@/middlewares/auth';
import { corsMiddleware } from '@/middlewares/cors';
import { errorHandlerMiddleware } from '@/middlewares/error';
import { i18nMiddleware } from '@/middlewares/i18n';
import { routes } from '@/routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import i18next from 'i18next';
import i18nextFsBackend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';
import path from 'path';

dotenv.config();

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('NOT_ALLOWED_BY_CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

i18next.use(i18nextFsBackend).init({
  fallbackLng: 'en',
  preload: ['en', 'nl'],
  ns: ['error-codes', 'validations', 'emails'],
  backend: {
    loadPath: path.join(__dirname, '/locales/{{lng}}/{{ns}}.json'),
  },
});

app.use(i18nextMiddleware.handle(i18next));
app.use('/:lng/*', i18nMiddleware);
app.use(corsMiddleware);
app.use(authMiddleware);

routes(app);

// Error handler middleware must be after all other middleware and routes
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
