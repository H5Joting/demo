import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Resolver, setDefaultResultOrder } from 'node:dns';
import { setGlobalDispatcher, Agent } from 'undici';
import apiRouter from './routes/api';
import { initDatabase } from './database/supabase';

setDefaultResultOrder('ipv4first');
const resolver = new Resolver();
resolver.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

setGlobalDispatcher(new Agent({
  keepAliveTimeout: 10000,
  keepAliveMaxTimeout: 60000,
  connections: 100
}));

const app = express();
const PORT = process.env.PORT || 3010;

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
