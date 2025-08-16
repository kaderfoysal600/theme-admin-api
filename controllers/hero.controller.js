import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Hero from '../models/hero.model.js'; // Make sure to import the new Hero model

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

// CREATE a new hero section
export const createHeroSection = async (req, res) => {
    const { title, subtitle, subSubtitle, bgImage } = req.body;
    if (!title || !bgImage) {
        return res.status(400).json({ message: 'Title and background image are required.' });
    }

    try {
        const savedImageUrl = saveImageFromBase64(bgImage, 'hero-bg');
        if (!savedImageUrl) {
            return res.status(400).json({ message: 'Invalid image data.' });
        }

        const newHero = new Hero({ 
            title, 
            subtitle, 
            subSubtitle, 
            backgroundImageUrl: savedImageUrl 
        });
        await newHero.save();
        res.status(201).json(newHero);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create hero section.', error: error.message });
    }
};

// READ all hero sections
export const getHeroSections = async (req, res) => {
    try {
        // Typically, you might only want the latest hero section
        const heroSections = await Hero.find().sort({ createdAt: -1 });
        res.status(200).json(heroSections);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch hero sections.', error: error.message });
    }
};

// UPDATE a hero section
export const updateHeroSection = async (req, res) => {
    const { id } = req.params;
    const { title, subtitle, subSubtitle } = req.body;
    let { bgImage } = req.body;

    try {
        const newImageUrl = saveImageFromBase64(bgImage, 'hero-bg');
        
        const updateData = { title, subtitle, subSubtitle };
        if (newImageUrl) {
            updateData.backgroundImageUrl = newImageUrl;
        }

        const updatedHero = await Hero.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedHero) return res.status(404).json({ message: 'Hero section not found.' });
        res.status(200).json(updatedHero);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update hero section.', error: error.message });
    }
};

// DELETE a hero section
export const deleteHeroSection = async (req, res) => {
    const { id } = req.params;
    try {
        const hero = await Hero.findById(id);
        if (!hero) {
            return res.status(404).json({ message: 'Hero section not found.' });
        }

        // Delete the background image file from the server
        const imagePath = path.join(PROJECT_ROOT, 'public', hero.backgroundImageUrl);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await Hero.findByIdAndDelete(id);
        res.status(200).json({ message: 'Hero section deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete hero section.', error: error.message });
    }
};