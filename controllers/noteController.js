import Note from '../models/noteModel.js';

// Get all notes for a user
export const getNotes = async (req, res) => {
  try {
    // In a real app, get userId from auth middleware
    const userId = req.query.userId || 'default-user';
    
    const notes = await Note.find({ userId })
      .sort({ updatedAt: -1 })
      .select('id title content createdAt updatedAt');
    
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a specific note
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    // In a real app, get userId from auth middleware
    const userId = req.query.userId || 'default-user';
    
    const note = await Note.findOne({ _id: id, userId });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new note
export const createNote = async (req, res) => {
  try {
    const { title, content = '' } = req.body;
    
    // In a real app, get userId from auth middleware
    const userId = req.body.userId || 'default-user';
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const newNote = await Note.create({
      title,
      content,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a note
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // In a real app, get userId from auth middleware
    const userId = req.body.userId || 'default-user';
    
    // Make sure updatedAt is updated
    updates.updatedAt = new Date();
    
    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true, runValidators: true }
    );
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real app, get userId from auth middleware
    const userId = req.query.userId || 'default-user';
    
    const note = await Note.findOneAndDelete({ _id: id, userId });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search notes
export const searchNotes = async (req, res) => {
  try {
    const { query } = req.query;
    
    // In a real app, get userId from auth middleware
    const userId = req.query.userId || 'default-user';
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const notes = await Note.find(
      { 
        userId,
        $text: { $search: query } 
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .select('id title content createdAt updatedAt');
    
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};