import mongoose from 'mongoose';

const GalleryImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  }
});

const GallerySchema = new mongoose.Schema({
  bannerImageUrl: {
    type: String,
    default: '',
  },
  galleryImages: [GalleryImageSchema],
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', GallerySchema);

export default Gallery;