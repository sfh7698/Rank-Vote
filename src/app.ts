import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import { filename } from './utils/loggers';
import api from './api';
import { globalErrorhandler } from './error';

const app: Express = express();

const logStream = fs.createWriteStream(filename, {flags: 'a'});

const corsOptions = {
  origin: process.env.CLIENT_DOMAIN || 'http://localhost:3000'
};

const stream = process.env.NODE_ENV === 'development' ? process.stdout : logStream;

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('common', {stream: stream}));
app.use('/api', api);
app.use(globalErrorhandler);

export default app;