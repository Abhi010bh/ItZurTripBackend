// Task Schema
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  tripId: {
    type: String,
    required: true
  },
  taskDescription: {
    type: String,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports=Task;