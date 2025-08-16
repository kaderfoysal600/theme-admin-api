// // src/api/controllers/news.controller.js

// import News from '../models/news.model.js';

// // GET all news items
// export const getAllNews = async (req, res) => {
//   try {
//     // Sort by eventDate in descending order (newest first)
//     const newsItems = await News.find().sort({ eventDate: -1 });
//     res.status(200).json(newsItems);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch news items', error: error.message });
//   }
// };

// // GET a single news item by ID
// export const getNewsById = async (req, res) => {
//     try {
//         const newsItem = await News.findById(req.params.id);
//         if (!newsItem) {
//             return res.status(404).json({ message: 'News item not found' });
//         }
//         res.status(200).json(newsItem);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch news item', error: error.message });
//     }
// };

// // POST a new news item
// export const createNews = async (req, res) => {
//   const { title, content, type, status, eventDate, imageUrl } = req.body;

//   if (!title || !content || !type || !eventDate) {
//     return res.status(400).json({ message: 'Missing required fields: title, content, type, eventDate' });
//   }

//   try {
//     const newNewsItem = new News({ title, content, type, status, eventDate, imageUrl });
//     const savedItem = await newNewsItem.save();
//     res.status(201).json(savedItem);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to create news item', error: error.message });
//   }
// };

// // PUT (update) a news item by ID
// export const updateNews = async (req, res) => {
//   try {
//     const updatedItem = await News.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true } // Return the updated doc and run schema validation
//     );
//     if (!updatedItem) {
//       return res.status(404).json({ message: 'News item not found' });
//     }
//     res.status(200).json(updatedItem);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to update news item', error: error.message });
//   }
// };

// // DELETE a news item by ID
// export const deleteNews = async (req, res) => {
//   try {
//     const deletedItem = await News.findByIdAndDelete(req.params.id);
//     if (!deletedItem) {
//       return res.status(404).json({ message: 'News item not found' });
//     }
//     res.status(200).json({ message: 'News item deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to delete news item', error: error.message });
//   }
// };



// 3


import News from '../models/news.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- File System Setup & Helper ---

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..'); // Adjust '..' if your folder structure is different

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
    return `/uploads/${fileName}`;
};

const deleteImageFile = (imageUrl) => {
    if (!imageUrl) return;
    try {
        const imagePath = path.join(PROJECT_ROOT, 'public', imageUrl);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    } catch (error) {
        console.error('Error deleting image file:', error);
    }
};


// --- API Functions ---

// GET all news items (No changes needed)
export const getAllNews = async (req, res) => {
  try {
    const newsItems = await News.find().sort({ eventDate: -1 });
    res.status(200).json(newsItems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch news items', error: error.message });
  }
};

// GET a single news item by ID (No changes needed)
export const getNewsById = async (req, res) => {
    try {
        const newsItem = await News.findById(req.params.id);
        if (!newsItem) {
            return res.status(404).json({ message: 'News item not found' });
        }
        res.status(200).json(newsItem);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch news item', error: error.message });
    }
};

// POST a new news item (UPDATED)
export const createNews = async (req, res) => {
  const { title, content, type, status, eventDate } = req.body;
  let { imageUrl } = req.body;

  if (!title || !content || !type || !eventDate || !imageUrl) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const savedImagePath = saveImageFromBase64(imageUrl, 'news');
    if (!savedImagePath) {
      return res.status(400).json({ message: 'Invalid image data.' });
    }

    const newNewsItem = new News({ 
        title, 
        content, 
        type, 
        status, 
        eventDate, 
        imageUrl: savedImagePath // Store the file path
    });
    const savedItem = await newNewsItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create news item', error: error.message });
  }
};

// PUT (update) a news item by ID (UPDATED)
export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    let { imageUrl } = req.body;

    // Check if a new image is being uploaded
    if (imageUrl && imageUrl.startsWith('data:image')) {
        // Find the old item to get the old image URL for deletion
        const oldItem = await News.findById(id);
        if (oldItem && oldItem.imageUrl) {
            deleteImageFile(oldItem.imageUrl); // Delete the old image
        }

        // Save the new image and update the imageUrl in the request body
        const newImagePath = saveImageFromBase64(imageUrl, 'news');
        if (newImagePath) {
            req.body.imageUrl = newImagePath;
        } else {
            // If saving fails, remove imageUrl to avoid saving invalid data
            delete req.body.imageUrl;
        }
    }

    const updatedItem = await News.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update news item', error: error.message });
  }
};

// DELETE a news item by ID (UPDATED)
export const deleteNews = async (req, res) => {
  try {
    // First, find the item to get its imageUrl
    const itemToDelete = await News.findById(req.params.id);
    if (!itemToDelete) {
      return res.status(404).json({ message: 'News item not found' });
    }

    // Delete the associated image file from the server
    if (itemToDelete.imageUrl) {
        deleteImageFile(itemToDelete.imageUrl);
    }

    // Then, delete the item from the database
    await News.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'News item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete news item', error: error.message });
  }
};