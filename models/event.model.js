// src/models/event.model.js
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  imageUrl: {
    type: String, // Will store the path to the uploaded image
  },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

export default Event;