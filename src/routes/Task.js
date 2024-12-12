const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); // Assuming the Task model is in the models folder
const Authenticate = require('../controllers/auth.authenticate');

// Get all tasks for a specific trip
router.get('/tasks/:tripId', Authenticate, async (req, res) => {
  const { tripId } = req.params;
  try {
    
    const tasks = await Task.find({ tripId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});

// Add a new task
router.post('/tasks', Authenticate, async (req, res) => {
  console.log('task todo')
  const { tripId, taskDescription, priority } = req.body;
  

  if (!tripId || !taskDescription) {
    return res.status(400).json({ message: 'Trip ID and task description are required' });
  }

  try {
    const newTask = new Task({ tripId, taskDescription, priority });
    await newTask.save();

  // Log the generated _id (MongoDB's default ObjectId)
    console.log('Task Created with ID:', newTask._id);
    res.status(201).json(newTask);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error adding task', error });
  }
});

// Delete a task by ID
router.delete('/tasks/:id', Authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
});

// Update a task by ID
router.put('/tasks/:id', Authenticate, async (req, res) => {
  const { id } = req.params;
  const { isCompleted } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(id, { isCompleted }, { new: true });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
});

module.exports = router;
