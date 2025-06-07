import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { initDatabase, migrateUserIds } from './database/init';
import authRoutes from './routes/auth';
import uploadRoutes from './routes/upload';
import { SupabaseAdminService } from './services/SupabaseService';

// Load .env from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:8081', 
    'http://localhost:8082', 
    'http://localhost:19006', 
    'exp://192.168.68.63:8081', 
    'exp://192.168.68.63:8082',
    'http://192.168.68.63:8081',
    'http://192.168.68.63:8082',
    'http://192.168.68.63:19006'
  ],
  credentials: true
}));
app.use(express.json());

// Initialize database
initDatabase()
  .then(() => migrateUserIds())
  .catch(console.error);

// Initialize Supabase storage
SupabaseAdminService.initializeStorage().catch(console.error);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Snappy API is running!' });
});

app.listen(PORT, () => {
  console.log(`[SERVER] Server running on port ${PORT}`);
  console.log(`[APP] Ready for Expo app connections`);
});

export default app;
