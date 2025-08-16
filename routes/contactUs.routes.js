// src/api/routes/contactUs.routes.js

import { Router } from 'express';
import { getContactUsContent, updateContactUsContent } from '../controllers/contactUs.controller.js';
// import { protect, admin } from '../middleware/authMiddleware.js'; // Optional

const router = Router();

// GET /api/contact-us - Get contact info (Public)
router.get('/', getContactUsContent);

// POST /api/contact-us - Update contact info (Admin)
router.post('/', updateContactUsContent); // Add middleware here in a real app

export default router;