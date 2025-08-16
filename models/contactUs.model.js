// import mongoose from 'mongoose';

// const contactUsSchema = new mongoose.Schema({
//   address: { 
//     type: String, 
//     required: true 
//   },
//   phone: { 
//     type: String, 
//     required: true 
//   },
//   email: {
//     type: String,
//     required: true,
//     lowercase: true,
//     match: [/\S+@\S+\.\S+/, 'is invalid'], // Simple email validation
//   },
//   mapEmbedUrl: { 
//     type: String 
//   }, // For Google Maps iframe URL
// }, { timestamps: true });

// const ContactUs = mongoose.model('ContactUs', contactUsSchema);

// export default ContactUs;


// src/models/contactUs.model.js
import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true, enum: ['Facebook', 'Twitter', 'Instagram', 'Youtube'] },
  url: { type: String, required: true },
});

const contactUsSchema = new mongoose.Schema({
  header: {
    tagline: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
  },
  address: {
    title: { type: String, default: 'Visit Our Gym' },
    details: [String], // Array for multiple address lines
  },
  phoneNumbers: {
    title: { type: String, default: 'Call Us' },
    details: [String], // Array for multiple phone numbers
  },
  emails: {
    title: { type: String, default: 'Email Us' },
    details: [String], // Array for multiple email addresses
  },
  workingHours: {
    title: { type: String, default: 'Working Hours' },
    details: [String], // Array for multiple lines of hours
  },
  socialLinks: [socialLinkSchema],
  mapEmbedUrl: { type: String },
}, { timestamps: true });

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

export default ContactUs;