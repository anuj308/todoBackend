import express from 'express';
import { 
  getNotes, 
  getNoteById, 
  createNote, 
  updateNote, 
  deleteNote,
  searchNotes
} from '../controllers/noteController.js';

const router = express.Router();

// Get all notes
router.get('/', getNotes);

// Search notes
router.get('/search', searchNotes);

// Get a specific note
router.get('/:id', getNoteById);

// Create a new note
router.post('/', createNote);

// Update a note
router.put('/:id', updateNote);

// Delete a note
router.delete('/:id', deleteNote);

export default router;