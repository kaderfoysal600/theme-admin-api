import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import BrandLogo from '../models/brandLogo.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..'); // Adjust if your folder structure is different

// Reusable helper for saving Base64 images
const saveImageFromBase64 = (base64Image, entityName) => {
    if (!base64Image || !base64Image.startsWith('data:image')) return null;
    const uploadDir = path.join(PROJECT_ROOT, 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const fileExtension = base64Image.split(';')[0].split('/')[1];
    const fileName = `${entityName}-${Date.now()}.${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, imageBuffer);
    return `/uploads/${fileName}`;
};

// CREATE a new brand logo
export const createLogo = async (req, res) => {
    const { title, link, imageUrl } = req.body;
    if (!title || !imageUrl) {
        return res.status(400).json({ message: 'Title and image are required.' });
    }

    try {
        const savedImageUrl = saveImageFromBase64(imageUrl, 'brand');
        if (!savedImageUrl) {
            return res.status(400).json({ message: 'Invalid image data.' });
        }

        const newLogo = new BrandLogo({ title, link, imageUrl: savedImageUrl });
        await newLogo.save();
        res.status(201).json(newLogo);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create logo.', error: error.message });
    }
};

// READ all brand logos
export const getAllLogos = async (req, res) => {
    try {
        const logos = await BrandLogo.find().sort({ createdAt: -1 });
        res.status(200).json(logos);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch logos.', error: error.message });
    }
};

// UPDATE a brand logo
export const updateLogo = async (req, res) => {
    const { id } = req.params;
    const { title, link } = req.body;
    let { imageUrl } = req.body;

    try {
        const newImageUrl = saveImageFromBase64(imageUrl, 'brand');
        if (newImageUrl) {
            imageUrl = newImageUrl;
        }

        const updatedLogo = await BrandLogo.findByIdAndUpdate(
            id,
            { title, link, imageUrl },
            { new: true, runValidators: true }
        );

        if (!updatedLogo) return res.status(404).json({ message: 'Logo not found.' });
        res.status(200).json(updatedLogo);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update logo.', error: error.message });
    }
};

// DELETE a brand logo
export const deleteLogo = async (req, res) => {
    const { id } = req.params;
    try {
        const logo = await BrandLogo.findById(id);
        if (!logo) {
            return res.status(404).json({ message: 'Logo not found.' });
        }

        // Delete the image file from the server
        const imagePath = path.join(PROJECT_ROOT, 'public', logo.imageUrl);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await BrandLogo.findByIdAndDelete(id);
        res.status(200).json({ message: 'Logo deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete logo.', error: error.message });
    }
};