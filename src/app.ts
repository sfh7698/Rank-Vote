import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import { filename } from './utils/loggers';
import api from './api';
import { globalErrorhandler } from './error';

const app: Express = express();

const logStream = fs.createWriteStream(filename, {flags: 'a'});

app.use(cors());
app.use(express.json());
app.use(morgan('common', {stream: logStream}));
app.use('/api', api);
app.use(globalErrorhandler);

export default app;