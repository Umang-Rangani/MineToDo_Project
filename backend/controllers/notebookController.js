import mongoose from 'mongoose'
import Note from '../models/notebook.js'

const getDateKey = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const getUserId = (req) => {
  return req.user?._id || req.user?.id || req.user?.userId
}

const validateUser = (req, res) => {
  const userId = getUserId(req)

  if (!userId || !mongoose.isValidObjectId(userId)) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized. Please login again.',
    })

    return null
  }

  return userId
}

// CREATE NOTE
export const createNote = async (req, res) => {
  try {
    const userId = validateUser(req, res)
    if (!userId) return

    const { title, content, dateKey } = req.body

    const note = await Note.create({
      userId,
      title: typeof title === 'string' && title.trim() ? title.trim() : 'Untitled Note',
      content: typeof content === 'string' ? content : '',
      dateKey: dateKey || getDateKey(),
      archived: false,
    })

    return res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note,
    })
  } catch (error) {
    console.error('Create note error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to create note',
    })
  }
}

// GET ACTIVE NOTES
export const getNotes = async (req, res) => {
  try {
    const userId = validateUser(req, res)
    if (!userId) return

    const filter = {
      userId,
      archived: false,
    }

    if (req.query.dateKey) {
      filter.dateKey = req.query.dateKey
    }

    const notes = await Note.find(filter).sort({
      dateKey: -1,
      updatedAt: -1,
    })

    return res.status(200).json({
      success: true,
      notes,
    })
  } catch (error) {
    console.error('Get notes error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notes',
    })
  }
}

// GET ARCHIVED NOTES
export const getArchivedNotes = async (req, res) => {
  try {
    const userId = validateUser(req, res)
    if (!userId) return

    const notes = await Note.find({
      userId,
      archived: true,
    }).sort({ updatedAt: -1 })

    return res.status(200).json({
      success: true,
      notes,
    })
  } catch (error) {
    console.error('Get archived notes error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch archived notes',
    })
  }
}

// UPDATE NOTE
export const updateNote = async (req, res) => {
  try {
    const userId = validateUser(req, res)
    if (!userId) return

    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID',
      })
    }

    const { title, content, dateKey } = req.body
    const updates = {}

    if (typeof title === 'string') {
      updates.title = title.trim() || 'Untitled Note'
    }

    if (typeof content === 'string') {
      updates.content = content
    }

    if (typeof dateKey === 'string' && dateKey) {
      updates.dateKey = dateKey
    }

    const note = await Note.findOneAndUpdate({ _id: id, userId, archived: false }, { $set: updates }, { new: true, runValidators: true })

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Active note not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      note,
    })
  } catch (error) {
    console.error('Update note error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to update note',
    })
  }
}

// ARCHIVE NOTE
export const archiveNote = async (req, res) => {
  try {
    const userId = validateUser(req, res)
    if (!userId) return

    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID',
      })
    }

    const note = await Note.findOneAndUpdate({ _id: id, userId, archived: false }, { $set: { archived: true } }, { new: true })

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Active note not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Note archived successfully',
      note,
    })
  } catch (error) {
    console.error('Archive note error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to archive note',
    })
  }
}

// UNARCHIVE NOTE
export const unarchiveNote = async (req, res) => {
  try {
    const userId = validateUser(req, res)
    if (!userId) return

    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID',
      })
    }

    const note = await Note.findOneAndUpdate({ _id: id, userId, archived: true }, { $set: { archived: false } }, { new: true })

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Archived note not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Note restored successfully',
      note,
    })
  } catch (error) {
    console.error('Unarchive note error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to restore note',
    })
  }
}

// DELETE NOTE PERMANENTLY
export const deleteNote = async (req, res) => {
  try {
    const userId = validateUser(req, res)
    if (!userId) return

    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID',
      })
    }

    const note = await Note.findOneAndDelete({
      _id: id,
      userId,
    })

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Note deleted permanently',
    })
  } catch (error) {
    console.error('Delete note error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to delete note',
    })
  }
}
