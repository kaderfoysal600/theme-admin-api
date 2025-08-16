// /server.js

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';

// Import Routes
import authRoutes from './routes/auth.routes.js';
import aboutUsRoutes from './routes/aboutUs.routes.js';
import contactUsRoutes from './routes/contactUs.routes.js';
import newsRoutes from './routes/news.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import brandLogoRoutes from './routes/brandLogo.routes.js';
import heroRoutes from './routes/hero.routes.js';
import eventRoutes from './routes/event.routes.js';
import memberRoutes from './routes/member.routes.js';
memberRoutes

const app = express();

// --- UPDATED CORS CONFIGURATION FOR DEBUGGING ---
// This temporarily allows requests from ALL origins.
// This is the most important change to test if your CORS setup is the problem.
app.use(cors());


// --- Create HTTP Server and Initialize Socket.IO ---
const server = http.createServer(app); 
const io = new Server(server, {         
    cors: {
      origin: "*", // Also allow all origins for Socket.IO
      methods: ["GET", "POST"]
    }
});


// --- Middleware ---
// We already called app.use(cors()) above, so the old line is removed.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from the 'public' directory
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));


// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Successfully connected to MongoDB."))
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });


// --- Real-time Logic with Socket.IO ---
let userSockets = {};

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on('storeUserId', (data) => {
        if (data.userId) {
            userSockets[data.userId] = socket.id;
            console.log(`Associated userId ${data.userId} with socketId ${socket.id}`);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        for (const userId in userSockets) {
            if (userSockets[userId] === socket.id) {
                delete userSockets[userId];
                break;
            }
        }
    });
});


// --- Middleware to make 'io' and 'userSockets' accessible in your routes ---
app.use((req, res, next) => {
    req.io = io;
    req.userSockets = userSockets;
    next();
});
app.use(express.static('public'));
// --- Use Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/about-us', aboutUsRoutes);
app.use('/api/contact-us', contactUsRoutes);
app.use('/api/news', newsRoutes); 
app.use('/api/gallery', galleryRoutes);
app.use('/api/brands', brandLogoRoutes);
app.use('/api', heroRoutes);
app.use('/api', eventRoutes);
app.use('/api', memberRoutes);
// --- Start Server ---
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});