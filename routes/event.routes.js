// src/routes/event.routes.js

import { Router } from 'express';
import {
  getEventPageContent,
  updateEventPageContent,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/event.controller.js';

// Optional: Import your authentication middleware for protected routes
// import { protect, admin } from '../middleware/authMiddleware.js';

const router = Router();

// ======================================================
// Public Routes - Accessible by anyone
// ======================================================

// GET all events, sorted by date
router.get('/events', getEvents);

// GET the static content for the main events page (header, image)
router.get('/event-page', getEventPageContent);


// ======================================================
// Protected Admin Routes - Require authentication/authorization
// ======================================================

// In a real application, you would add middleware like: protect, admin
// Example: router.post('/events', protect, admin, createEvent);

// POST a new event
router.post('/events', createEvent);

// PUT (update) an existing event by its ID
router.put('/events/:id', updateEvent);

// DELETE an event by its ID
router.delete('/events/:id', deleteEvent);

// POST (update) the static content of the events page
router.post('/event-page', updateEventPageContent);


export default router;