// // src/models/aboutUs.model.js

// import mongoose from 'mongoose';

// const aboutUsSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'Title is required'],
//     trim: true,
//   },
//   content: {
//     type: String,
//     required: [true, 'Content is required'],
//   },
//   imageUrl: {
//     type: String, // Stores the URL of the uploaded image
//     required: false,
//   },
// }, { timestamps: true });

// // Since there should only be one "About Us" document, we can enforce this.
// // A better approach is to handle this at the application logic level.

// const AboutUs = mongoose.model('AboutUs', aboutUsSchema);

// export default AboutUs;

// src/models/aboutUs.model.js
import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  icon: { type: String, required: false },
  title: { type: String, required: false },
  description: { type: String, required: true },
});

const achievementSchema = new mongoose.Schema({
  number: { type: String, required: false },
  label: { type: String, required: false },
  icon: { type: String, required: false },
});

const valueSchema = new mongoose.Schema({
  icon: { type: String, required: false },
  title: { type: String, required: false },
  description: { type: String, required: false },
});

const aboutUsSchema = new mongoose.Schema({
  header: {
    title: { type: String, required: false },
    subtitle: { type: String, required: false },
    tagline: { type: String, required: false },
  },
  story: {
    title: { type: String, required: false },
    paragraph1: { type: String, required: false },
    paragraph2: { type: String, required: false },
  },
  whyChooseUs: {
    title: { type: String, required: false },
    features: [featureSchema],
  },
  achievements: [achievementSchema],
  values: [valueSchema],
  showcaseImageUrl: { type: String },
}, {
  timestamps: true
});

const AboutUs = mongoose.model('AboutUs', aboutUsSchema);

export default AboutUs;