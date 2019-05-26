import dotenv from 'dotenv';
import app from './app';
import socketIo from './helpers/utils/socketIo';

dotenv.config();

socketIo(app);

export default app;
