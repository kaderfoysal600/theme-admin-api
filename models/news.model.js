// src/models/news.model.js

import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  content: {
    type: String, // For the full article content, to be used in the add/edit form
    required: [true, 'Content is required'],
  },
  type: {
    type: String,
    enum: ['Event', 'News'], // Ensures only these values are allowed
    required: true,
  },
  status: {
    type: String,
    enum: ['Published', 'Draft'], // Ensures only these values are allowed
    default: 'Draft',
  },
  imageUrl: { // Optional: for a header image
    type: String,
  },
  eventDate: { // Use a specific field for dates to allow for proper sorting
      type: Date,
      required: true,
  }
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

const News = mongoose.model('News', newsSchema);

export default News;