import mongoose from 'mongoose';

const BrandLogoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required.'],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required.'],
  },
  link: { // Optional link to the brand's website
    type: String,
    trim: true,
    default: '',
  },
}, { timestamps: true });

const BrandLogo = mongoose.model('BrandLogo', BrandLogoSchema);

export default BrandLogo;