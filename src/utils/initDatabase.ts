
import { ensureArticlesExist } from '@/services/articleService';

export async function initializeDatabase() {
  try {
    await ensureArticlesExist();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}
