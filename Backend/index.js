
import dotenv from 'dotenv';
dotenv.config();
import { createRequire } from 'module';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);

const express = require('express'); // Importing express
const cors = require('cors');



   const app = express(); // Creating an express app
   app.use(cors());
   app.use(express.json());

// connect to mongo
   
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Define the schema
const cardSchema = new mongoose.Schema({
  text: { type: String, required: true },
  day: { type: String, required: true },
});

// Create the model
const Card = mongoose.model('Card', cardSchema);


app.post('/message', async (req, res) => {
    const cards = req.body;
  
    console.log('Received data:', cards);
  
    try {
      const results = [];
  
      for (const card of cards) {
        const updatedCard = await Card.findOneAndUpdate(
          { day: card.day }, // Match by day
          { text: card.text, day: card.day }, // Update fields
          { new: true, upsert: true } // Create a new document if no match is found
        );
        results.push(updatedCard);
      }
  
      res.status(200).json({ message: 'Data processed successfully', data: results });
    } catch (error) {
      console.error('Error saving/updating data:', error);
      res.status(500).json({ error: 'Failed to process data' });
    }
  });

  // Route to fetch all cards
app.get('/cards', async (req, res) => {
    try {
      // Fetch all cards from the 'cards' collection
      const cards = await Card.find();
      console.log(cards)
      res.status(200).json(cards); // Send the fetched cards as a response
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });

  app.delete('/message/:day', async (req, res) => {
    const { day } = req.params;
  
    try {
      const result = await Card.deleteOne({ day });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'No document found with the given day' });
      }
  
      res.status(200).json({ message: 'Document deleted successfully', result });
    } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).json({ error: 'Failed to delete document' });
    }
  });
  
  

   // Set up the server to listen on port 3000
   
   const PORT =process.env.PORT
   app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
   });

   // Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app's 'dist' folder
app.use(express.static(path.join(__dirname, '../Task/dist')));

// Catch-all route to serve React's index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Task/dist', 'index.html'));
});