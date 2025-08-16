import mongoose from 'mongoose';

const eventPageSchema = new mongoose.Schema({
  // This object holds the static text content for the top of the page
  header: {
    title: {
      type: String,
      required: [true, 'Header title is required.'],
      trim: true,
    },
    subtitle: {
      type: String,
      required: [true, 'Header subtitle is required.'],
    },
  },
  
  // This field stores the URL path for the large image displayed
  // on the events page, next to the list of individual events.
  mainImageUrl: {
    type: String,
    default: '', // A default empty string is good practice
  },
}, {
  // This option automatically adds `createdAt` and `updatedAt` fields
  // to your document, which is useful for tracking changes.
  timestamps: true
});

const EventPage = mongoose.model('EventPage', eventPageSchema);

export default EventPage;