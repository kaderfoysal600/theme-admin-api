import { Router } from 'express';
import { createLogo, getAllLogos, updateLogo, deleteLogo } from '../controllers/brandLogo.controller.js';

const router = Router();

router.get('/', getAllLogos);
router.post('/', createLogo);
router.put('/:id', updateLogo);
router.delete('/:id', deleteLogo);

export default router;