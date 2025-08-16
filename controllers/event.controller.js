import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Event from '../models/event.model.js';
import EventPage from '../models/eventPage.model.js';

// --- Setup File Path Constants ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Assuming your controller is in a subfolder like 'src/controllers', this goes up to the project root.
// Adjust if your folder structure is different.
const PROJECT_ROOT = path.join(__dirname, '..');

// --- Reusable Image Handling Utilities ---

/**
 * Saves a Base64 encoded image to the /public/uploads directory.
 * @param {string} base64Image - The base64 string (e.g., "data:image/jpeg;base64,...").
 * @param {string} entityName - A name for the file prefix (e.g., "event").
 * @returns {string|null} The URL path to the saved image (e.g., "/uploads/event-12345.jpeg") or null.
 */
const saveImageFromBase64 = (base64Image, entityName) => {
    if (!base64Image || !base64Image.startsWith('data:image')) return null;

    const uploadDir = path.join(PROJECT_ROOT, 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const fileExtension = base64Image.split(';')[0].split('/')[1];
    const fileName = `${entityName}-${Date.now()}.${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, imageBuffer);
    return `/uploads/${fileName}`; // Return the public URL path
};

/**
 * Deletes an image file from the /public directory.
 * @param {string} imageUrl - The URL path of the image to delete (e.g., "/uploads/event-12345.jpeg").
 */
const deleteImageFile = (imageUrl) => {
    if (!imageUrl) return;
    try {
        const imagePath = path.join(PROJECT_ROOT, 'public', imageUrl);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    } catch (err) {
        console.error(`Failed to delete image file: ${imageUrl}`, err);
    }
};


// --- Event Page Content Controller ---

export const getEventPageContent = async (req, res) => {
  try {
    let content = await EventPage.findOne();
    if (!content) {
      content = new EventPage({
        header: {
          title: "OUR <span class='text-red-600'>KARATE</span> EVENTS",
          subtitle: "Fight School has specialized in martial arts since 1986 and has one of the most innovative programs in the nation.",
        },
        mainImageUrl: '',
      });
      await content.save();
    }
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event page content: ' + error.message });
  }
};

export const updateEventPageContent = async (req, res) => {
  try {
    const { header, mainImageUrl } = req.body;
    let processedImageUrl = mainImageUrl;

    // Check if a new image is being uploaded
    if (mainImageUrl && mainImageUrl.startsWith('data:image')) {
        const existingPage = await EventPage.findOne();
        // Delete the old image if it exists
        if (existingPage && existingPage.mainImageUrl) {
            deleteImageFile(existingPage.mainImageUrl);
        }
        // Save the new image
        processedImageUrl = saveImageFromBase64(mainImageUrl, 'event-page');
    }
    
    const updateData = { header, mainImageUrl: processedImageUrl };

    const updatedContent = await EventPage.findOneAndUpdate({}, updateData, { new: true, upsert: true });
    res.status(200).json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event page content: ' + error.message });
  }
};


// --- Individual Events (CRUD) Controller ---

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, imageUrl } = req.body;
    const savedImageUrl = saveImageFromBase64(imageUrl, 'event');

    const newEvent = new Event({ title, description, date, imageUrl: savedImageUrl });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event: ' + error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events: ' + error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, imageUrl } = req.body;
    let processedImageUrl = imageUrl;

    // Check if a new base64 image is being uploaded
    if (imageUrl && imageUrl.startsWith('data:image')) {
        const existingEvent = await Event.findById(id);
        // Delete the old image if it existed
        if (existingEvent && existingEvent.imageUrl) {
            deleteImageFile(existingEvent.imageUrl);
        }
        // Save the new image
        processedImageUrl = saveImageFromBase64(imageUrl, 'event');
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, {
      title,
      description,
      date,
      imageUrl: processedImageUrl,
    }, { new: true });

    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event: ' + error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const eventToDelete = await Event.findById(id);

    if (!eventToDelete) {
        return res.status(404).json({ message: 'Event not found' });
    }

    // Delete the associated image file from the server
    if (eventToDelete.imageUrl) {
        deleteImageFile(eventToDelete.imageUrl);
    }

    // Delete the event from the database
    await Event.findByIdAndDelete(id);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event: ' + error.message });
  }
};