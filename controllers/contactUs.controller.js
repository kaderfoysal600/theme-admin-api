// import ContactUs from '../models/contactUs.model.js';

// // Get the single Contact Us document
// export const getContactUsContent = async (req, res) => {
//   try {
//     const content = await ContactUs.findOne();
//     if (!content) {
//       // If no document exists, send a default structure
//       return res.status(200).json({
//         address: 'Your Address, City, Country',
//         phone: '+880 123 456 7890',
//         email: 'contact@wushubd.com',
//         mapEmbedUrl: '',
//       });
//     }
//     res.status(200).json(content);
//   } catch (error) {
//     // Ensure error responses are also JSON
//     res.status(500).json({ message: 'Error fetching content: ' + error.message });
//   }
// };

// // Create or Update the single Contact Us document
// export const updateContactUsContent = async (req, res) => {
//   try {
//     const { address, phone, email, mapEmbedUrl } = req.body;
//     const updateData = { address, phone, email, mapEmbedUrl };

//     // Use findOneAndUpdate with upsert:true to either update the existing
//     // document or create it if it doesn't exist.
//     const updatedContent = await ContactUs.findOneAndUpdate({}, updateData, {
//       new: true, // Return the updated document
//       upsert: true, // Create the document if it doesn't exist
//       runValidators: true, // Ensure model validations are checked
//     });

//     res.status(200).json({ message: 'Contact info updated successfully', content: updatedContent });
//   } catch (error) {
//     // Ensure error responses are also JSON
//     res.status(500).json({ message: 'Error updating content: ' + error.message });
//   }
// };


// 2


// src/controllers/contactUs.controller.js
import ContactUs from '../models/contactUs.model.js';

// Get the single Contact Us document
export const getContactUsContent = async (req, res) => {
  try {
    let content = await ContactUs.findOne();
    if (!content) {
      // If no document exists, create and send a default structure
      content = new ContactUs({
        header: {
          tagline: 'Get In Touch',
          title: "READY TO <span class='text-red-600'>START</span> YOUR JOURNEY?",
          subtitle: "Have questions about our programs? Want to schedule a visit? Get in touch with our team and we'll help you take the first step towards becoming a champion.",
        },
        address: {
          title: 'Visit Our Gym',
          details: ['123 Fitness Street, New York, NY 10001', 'Ground Floor, Sword Building']
        },
        phoneNumbers: {
          title: 'Call Us',
          details: ['+1 (555) 123-4567', '+1 (555) 987-6543']
        },
        emails: {
          title: 'Email Us',
          details: ['info@boxinggym.com', 'support@boxinggym.com']
        },
        workingHours: {
          title: 'Working Hours',
          details: ['Mon-Fri: 5:00 AM - 10:00 PM', 'Sat-Sun: 6:00 AM - 8:00 PM']
        },
        socialLinks: [
          { platform: 'Facebook', url: '#' },
          { platform: 'Twitter', url: '#' },
          { platform: 'Instagram', url: '#' },
          { platform: 'Youtube', url: '#' },
        ],
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.618036294243!2d-73.98784368459395!3d40.74844097932824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1614123456789!5m2!1sen!2sus',
      });
      await content.save();
    }
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content: ' + error.message });
  }
};

// Create or Update the single Contact Us document
export const updateContactUsContent = async (req, res) => {
  try {
    const updateData = req.body;
    const updatedContent = await ContactUs.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    res.status(200).json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating content: ' + error.message });
  }
};