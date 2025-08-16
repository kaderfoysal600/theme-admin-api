// src/api/routes/aboutUs.routes.js

import { Router } from 'express';
import { getAboutUsContent, updateAboutUsContent } from '../controllers/aboutUs.controller.js';
// import { protect, admin } from '../middleware/authMiddleware.js'; // Optional: protect your routes
// import upload from '../middleware/uploadMiddleware.js'; // Optional: for file uploads

const router = Router();

// GET /api/about-us - Get the about us content (Public)
router.get('/', getAboutUsContent);

// POST /api/about-us - Update the about us content (Admin only)
// Add middleware for auth and file upload.
// Example: router.post('/', protect, admin, upload.single('image'), updateAboutUsContent);
router.post('/', updateAboutUsContent);

export default router;