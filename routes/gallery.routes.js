import { Router } from 'express';
import { getGallery, updateBanner, addImages, deleteImage } from '../controllers/gallery.controller.js';
// Optional: Add auth middleware
const router = Router();

router.get('/', getGallery);
router.post('/banner', updateBanner);
router.post('/images', addImages);
router.delete('/images/:id', deleteImage);

export default router;