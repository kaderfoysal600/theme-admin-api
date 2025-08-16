// src/controllers/member.controller.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Member from '../models/member.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

// Reusable image handling utilities
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

const deleteImageFile = (imageUrl) => {
    if (!imageUrl) return;
    try {
        const imagePath = path.join(PROJECT_ROOT, 'public', imageUrl);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    } catch (err) {
        console.error(`Failed to delete image: ${imageUrl}`, err);
    }
};

// CREATE a new member
export const createMember = async (req, res) => {
    try {
        const { imageUrl, ...memberData } = req.body;
        const savedImageUrl = saveImageFromBase64(imageUrl, 'member');
        
        const newMember = new Member({
            ...memberData,
            imageUrl: savedImageUrl
        });

        await newMember.save();
        res.status(201).json(newMember);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET all members (can be filtered by committee)
export const getAllMembers = async (req, res) => {
    try {
        const filter = {};
        if (req.query.committee) {
            filter.committee = req.query.committee;
        }
        const members = await Member.find(filter).sort({ createdAt: -1 });
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE a member
export const updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl, ...updateData } = req.body;
        let processedImageUrl = imageUrl;

        if (imageUrl && imageUrl.startsWith('data:image')) {
            const existingMember = await Member.findById(id);
            if (existingMember && existingMember.imageUrl) {
                deleteImageFile(existingMember.imageUrl);
            }
            processedImageUrl = saveImageFromBase64(imageUrl, 'member');
        }

        const updatedMember = await Member.findByIdAndUpdate(id, {
            ...updateData,
            imageUrl: processedImageUrl
        }, { new: true });

        if (!updatedMember) return res.status(404).json({ message: 'Member not found' });
        res.status(200).json(updatedMember);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE a member
export const deleteMember = async (req, res) => {
    try {
        const { id } = req.params;
        const memberToDelete = await Member.findById(id);
        if (!memberToDelete) return res.status(404).json({ message: 'Member not found' });

        if (memberToDelete.imageUrl) {
            deleteImageFile(memberToDelete.imageUrl);
        }

        await Member.findByIdAndDelete(id);
        res.status(200).json({ message: 'Member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};