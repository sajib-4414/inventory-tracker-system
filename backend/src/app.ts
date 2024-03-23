import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { NotFoundError, errorHandler } from './utils/RequestUtilities';
import { authRoutes } from './routes/auth-routes';
import cookieParser from 'cookie-parser';
import { paintRoutes } from './routes/paint-routes';

const app = express();
app.set('trust proxy', true);

app.use(json());

app.use(express.urlencoded({ extended: true }));


app.use(cookieParser())
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/paints', paintRoutes)

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
