// src/models/member.model.js
import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  designation: { type: String, required: true }, // Replaces 'specialty'
  committee: {
    type: String,
    required: true,
    enum: ['Executive', 'Technical'], // This field separates the two types
  },
  imageUrl: { type: String },
  experience: { type: String, default: '' },
  students: { type: String, default: '' }, // Can be repurposed for other stats
  rating: { type: Number, default: 0 },
  bio: { type: String, default: '' },
  achievements: [String],
  expertise: [String],
  socialLinks: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
  }
}, { timestamps: true });

const Member = mongoose.model('Member', memberSchema);

export default Member;