import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Gallery from '../models/gallery.model.js'; // Assuming this path is correct

// --- THE ONLY CHANGE IS HERE ---
// Get the path to the current file (e.g., D:\habib\admnapi\controllers\gallery.controller.js)
const __filename = fileURLToPath(import.meta.url);
// Get the directory of the current file (e.g., D:\habib\admnapi\controllers)
const __dirname = path.dirname(__filename);
// CORRECTED PATH: Navigate up only ONE level from the 'controllers' directory to the project root.
const PROJECT_ROOT = path.join(__dirname, '..'); 

/**
 * Saves a Base64 encoded image to the disk.
 */
const saveImageFromBase64 = (base64Image, entityName) => {
    if (!base64Image || !base64Image.startsWith('data:image')) {
        return null; 
    }

    // This path is now correct because PROJECT_ROOT is correct.
    const uploadDir = path.join(PROJECT_ROOT, 'public', 'uploads');
    
    console.log(`[Uploader] Attempting to save to directory: ${uploadDir}`);

    if (!fs.existsSync(uploadDir)) {
        console.log(`[Uploader] Directory did not exist. Creating it...`);
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const fileExtension = base64Image.split(';')[0].split('/')[1];
    const fileName = `${entityName}-${Date.now()}.${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);
    
    fs.writeFileSync(filePath, imageBuffer);
    console.log(`[Uploader] SUCCESS: Saved file to ${filePath}`);

    return `/uploads/${fileName}`;
};


// ==========================================================
// NO OTHER CHANGES ARE NEEDED BELOW THIS LINE.
// The rest of the controller functions will work correctly now.
// ==========================================================

const getGalleryDoc = () => {
    return Gallery.findOneAndUpdate({}, {}, { new: true, upsert: true });
};

export const getGallery = async (req, res) => {
    try {
        const gallery = await getGalleryDoc();
        res.status(200).json(gallery);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch gallery', error: error.message });
    }
};

export const updateBanner = async (req, res) => {
    try {
        const { imageUrl } = req.body;
        const newImageUrl = saveImageFromBase64(imageUrl, 'gallery-banner');

        if (!newImageUrl) {
            return res.status(400).json({ message: 'Invalid image data provided.' });
        }
        
        const gallery = await Gallery.findOneAndUpdate({}, { bannerImageUrl: newImageUrl }, { new: true, upsert: true });
        res.status(200).json(gallery);
    } catch (error) {
        console.error("[ERROR] Updating Banner:", error);
        res.status(500).json({ message: 'Failed to update banner', error: error.message });
    }
};

export const addImages = async (req, res) => {
    try {
        const { images } = req.body;
        if (!images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ message: 'No images provided.' });
        }
        
        const newImageObjects = images
            .map(base64String => {
                const url = saveImageFromBase64(base64String, 'gallery-item');
                return url ? { url } : null;
            })
            .filter(Boolean);

        const gallery = await Gallery.findOneAndUpdate(
            {},
            { $push: { galleryImages: { $each: newImageObjects } } },
            { new: true, upsert: true }
        );
        res.status(200).json(gallery);
    } catch (error) {
        console.error("[ERROR] Adding Images:", error);
        res.status(500).json({ message: 'Failed to add images', error: error.message });
    }
};

export const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const gallery = await Gallery.findOneAndUpdate(
            {},
            { $pull: { galleryImages: { _id: id } } },
            { new: true }
        );
        res.status(200).json(gallery);
    } catch (error) {
        console.error("[ERROR] Deleting Image:", error);
        res.status(500).json({ message: 'Failed to delete image', error: error.message });
    }
};