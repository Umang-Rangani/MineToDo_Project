const express = require('express')
const router = express.Router()

const { getNotes, createNote, getArchivedNotes, updateNote, archiveNote, unarchiveNote, deleteNote } = require('../controllers/notebookController')

// Active notes
router.get('/', getNotes)
router.post('/', createNote)

// Archived notes
router.get('/archived', getArchivedNotes)

// Update note
router.put('/:id', updateNote)

// Archive and restore
router.put('/:id/archive', archiveNote)
router.put('/:id/unarchive', unarchiveNote)

// Permanently delete note
router.delete('/:id', deleteNote)

module.exports = router
