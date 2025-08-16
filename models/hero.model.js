import mongoose from 'mongoose';

const HeroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required.'],
    trim: true,
  },
  subtitle: {
    type: String,
    trim: true,
  },
  subSubtitle: {
    type: String,
    trim: true,
  },
  backgroundImageUrl: {
    type: String,
    required: [true, 'Background image URL is required.'],
  },
}, { timestamps: true });

const Hero = mongoose.model('Hero', HeroSchema);

export default Hero;