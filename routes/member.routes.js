// src/routes/member.routes.js
import { Router } from 'express';
import {
  createMember,
  getAllMembers,
  updateMember,
  deleteMember
} from '../controllers/member.controller.js';

const router = Router();

// Public route to get all members (can be filtered with ?committee=Executive)
router.get('/members', getAllMembers);

// Admin routes
router.post('/members', createMember);
router.put('/members/:id', updateMember);
router.delete('/members/:id', deleteMember);

export default router;