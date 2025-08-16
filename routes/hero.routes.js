import express from 'express';
import { createHeroSection, getHeroSections, updateHeroSection, deleteHeroSection } from '../controllers/hero.controller.js';

const router = express.Router();

router.post('/hero', createHeroSection);
router.get('/hero', getHeroSections);
router.put('/hero/:id', updateHeroSection);
router.delete('/hero/:id', deleteHeroSection);

export default router;