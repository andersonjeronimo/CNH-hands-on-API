import express, { Request, Response, NextFunction } from 'express';
import { WithId, Document } from 'mongodb';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import apiRouter from './routers/api-router';

// Auth-middleware++++++++++++++++++++++++
declare global {
  namespace Express {
    interface Request {
      user?: Partial<WithId<Document>>; // Adiciona a nova propriedade opcional
    }
  }
}
// Auth-middleware++++++++++++++++++++++++

const app = express();
app.use(morgan('tiny'));
app.use(cors());
//app.use(cors({ origin: 'http://localhost:5173' }));
//app.use(cors({ origin: 'https://cnhnamao2026.com.br' }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
//app.use(express.static(path.join(__dirname, '/public')));
//app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// auth & instructor
app.use('/api', apiRouter);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    message: `Error: ${error.message}`,
    timestamp: new Date().toISOString()
  });
})

export default app;