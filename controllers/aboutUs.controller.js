// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import AboutUs from '../models/aboutUs.model.js'; // Ensure the .js extension is here

// // Helper to get __dirname in ES Modules, necessary for path resolution
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// /**
//  * Saves a Base64 encoded image to the disk.
//  * @param {string | undefined} base64Image - The Base64 string (e.g., "data:image/jpeg;base64,...")
//  * @param {string} entityName - A name for the file prefix (e.g., "about-us")
//  * @returns {string | null} The public URL of the saved file or null if input is invalid.
//  */
// const saveImageFromBase64 = (base64Image, entityName) => {
//     // 1. Check if the input is a valid new Base64 string
//     if (!base64Image || !base64Image.startsWith('data:image')) {
//         return null; // Not a new upload, so we don't process it.
//     }

//     // 2. Prepare file path and directory
//     // This path navigates from src/api/controllers up to the project root and then to public/uploads
//     const uploadDir = path.join(__dirname, '..' ,'public', 'uploads');
//     if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     // 3. Extract data and create a buffer
//     const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
//     const imageBuffer = Buffer.from(base64Data, 'base64');
    
//     // 4. Generate a unique filename
//     const fileExtension = base64Image.split(';')[0].split('/')[1];
//     const fileName = `${entityName}-${Date.now()}.${fileExtension}`;
//     const filePath = path.join(uploadDir, fileName);

//     // 5. Write the file and return the public URL
//     fs.writeFileSync(filePath, imageBuffer);
    
//     // Assumes your server serves the 'public' directory statically.
//     // The URL should not include 'public'.
//     const fileUrl = `/uploads/${fileName}`;
//     return fileUrl;
// };


// // --- CONTROLLER FUNCTIONS ---

// // This function is fine and needs no changes
// export const getAboutUsContent = async (req, res) => {
//   try {
//     const content = await AboutUs.findOne();
//     if (!content) {
//       return res.status(200).json({
//         title: 'About Us',
//         content: 'Please update this content.',
//         imageUrl: ''
//       });
//     }
//     res.status(200).json(content);
//   } catch (error) {
//     // Changed to .json for consistency
//     res.status(500).json({ message: 'Error fetching content: ' + error.message });
//   }
// };


// // Create or Update the About Us document
// export const updateAboutUsContent = async (req, res) => {
//   try {
//     const { title, content } = req.body;
//     let { imageUrl } = req.body; // Use let to allow modification

//     // --- START OF THE NEW LOGIC ---
//     // Check if imageUrl is a new Base64 upload and process it
//     const newImageUrl = saveImageFromBase64(imageUrl, 'about-us');
//     if (newImageUrl) {
//         // If a new image was saved, update imageUrl to the new file path
//         imageUrl = newImageUrl;
//     }
//     // If it wasn't a new Base64 string, the original imageUrl (which could be an existing URL or empty) is preserved.
//     // --- END OF THE NEW LOGIC ---

//     const updateData = { title, content, imageUrl };

//     // Find one and update. If it doesn't exist, create it (upsert: true).
//     const updatedContent = await AboutUs.findOneAndUpdate({}, updateData, {
//       new: true, // Return the updated document
//       upsert: true, // Create the document if it doesn't exist
//       runValidators: true,
//     });

//     res.status(200).json({ message: 'Content updated successfully', content: updatedContent });
//   } catch (error) {
//     // Changed to .json for consistency
//     res.status(500).json({ message: 'Error updating content: ' + error.message });
//   }
// };
// src/controllers/aboutUs.controller.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import AboutUs from '../models/aboutUs.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const saveImageFromBase64 = (base64Image, entityName) => {
    if (!base64Image || !base64Image.startsWith('data:image')) {
        return null;
    }
    const uploadDir = path.join(__dirname, '..' ,'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const fileExtension = base64Image.split(';')[0].split('/')[1];
    const fileName = `${entityName}-${Date.now()}.${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, imageBuffer);
    const fileUrl = `/uploads/${fileName}`;
    return fileUrl;
};

export const getAboutUsContent = async (req, res) => {
  try {
    let content = await AboutUs.findOne();
    if (!content) {
      // Create and return a default structure if no content exists
      content = new AboutUs({
        header: {
          title: "WHERE CHAMPIONS ARE BORN",
          subtitle: "Founded with a vision to revolutionize fitness training, Sword Fitness Academy stands as a beacon of excellence in combat sports and athletic development. We don't just train bodies – we transform lives.",
          tagline: "About Sword Fitness Academy",
        },
        story: {
          title: "Our Story",
          paragraph1: "Sword Fitness Academy was established in 2009 with a simple mission: to provide world-class combat sports and fitness training to everyone who walks through our doors. What started as a small gym has grown into a premier fitness destination.",
          paragraph2: "Our founder, a former champion fighter, envisioned a place where beginners and professionals alike could train in a supportive, challenging environment. Today, that vision is realized through our state-of-the-art facility and elite coaching staff.",
        },
        whyChooseUs: {
          title: "Why Choose Us?",
          features: [
            { icon: 'FaFistRaised', title: 'World-Class Training', description: 'Elite coaching from certified professionals with years of experience in combat sports and fitness training.' },
            { icon: 'FaTrophy', title: 'Proven Results', description: 'Join thousands of success stories from members who have achieved their fitness and fighting goals.' },
            { icon: 'FaUsers', title: 'Supportive Community', description: 'Become part of a family of like-minded individuals who motivate and inspire each other daily.' },
            { icon: 'FaHeartbeat', title: 'State-of-the-Art Facility', description: 'Train in a premium facility equipped with the latest gear and technology for optimal performance.' }
          ],
        },
        achievements: [
          { number: '15+', label: 'Years of Excellence', icon: 'FaAward' },
          { number: '10,000+', label: 'Members Transformed', icon: 'FaUsers' },
          { number: '50+', label: 'Expert Trainers', icon: 'FaMedal' },
          { number: '25+', label: 'Championship Titles', icon: 'FaTrophy' }
        ],
        values: [
          { icon: 'FaFire', title: 'Passion', description: 'We live and breathe fitness. Our passion drives us to deliver exceptional training experiences every single day.' },
          { icon: 'FaShieldAlt', title: 'Integrity', description: 'We uphold the highest standards of honesty, respect, and professionalism in everything we do.' },
          { icon: 'FaHeartbeat', title: 'Excellence', description: 'We continuously strive for perfection in our training methods, facility, and member experience.' },
          { icon: 'FaUsers', title: 'Community', description: 'We foster a supportive environment where everyone feels welcome and motivated to achieve their best.' }
        ],
        showcaseImageUrl: ''
      });
      await content.save();
    }
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content: ' + error.message });
  }
};

export const updateAboutUsContent = async (req, res) => {
  try {
    const updateData = req.body;

    const newImageUrl = saveImageFromBase64(updateData.showcaseImageUrl, 'about-us');
    if (newImageUrl) {
      updateData.showcaseImageUrl = newImageUrl;
    }

    const updatedContent = await AboutUs.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true, // Creates the document if it doesn't exist
      runValidators: true,
    });
    
    // The API should return the updated document directly
    res.status(200).json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating content: ' + error.message });
  }
};