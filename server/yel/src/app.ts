import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  return res.json({ name: 'yela' });
});

app.listen(3000, () => {
  console.log('Server listening at http://localhost:3000');
});
