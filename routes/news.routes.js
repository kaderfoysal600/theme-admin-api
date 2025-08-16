// src/api/routes/news.routes.js

import { Router } from 'express';
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
} from '../controllers/news.controller.js';
// Optional: import your authentication middleware here
// import { protect, admin } from '../middleware/authMiddleware.js';

const router = Router();

// Public route to get all news
router.get('/', getAllNews);

// Public route to get a single news item
router.get('/:id', getNewsById);

// Protected admin routes
// In a real app, you would uncomment the middleware like so:
// router.post('/', protect, admin, createNews);
router.post('/', createNews);
router.put('/:id', updateNews);
router.delete('/:id', deleteNews);

export default router;