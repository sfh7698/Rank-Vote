import express, { Express } from 'express';
import cors, {CorsOptions} from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import { filename } from './utils/loggers.js';
import api from './api/index.js';
import { apiErrorhandler } from './utils/errorHandler.js';

const app: Express = express();

export const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_DOMAIN || 'http://localhost:5173',
  exposedHeaders: ['Authorization']
};

const stream = process.env.NODE_ENV === 'development' ? process.stdout : fs.createWriteStream(filename, {flags: 'a'});

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('common', {stream: stream}));
app.use('/api', api);
app.use(apiErrorhandler);

export default app;