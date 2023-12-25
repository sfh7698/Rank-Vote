import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import fs from 'fs';
import api from './api';
import { filename } from './utils/loggers';
import { globalErrorhandler } from './error';

dotenv.config();

const app: Express = express();

const logStream = fs.createWriteStream(filename, {flags: 'a'});

app.use(cors());
app.use(express.json());
app.use(morgan('common', {stream: logStream}));
app.use('/api', api);
app.use(globalErrorhandler);

export default app;