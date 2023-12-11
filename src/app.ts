import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import api from './api';
import { globalErrorhandler } from './error';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use('/api', api);
app.use(globalErrorhandler);

export default app;