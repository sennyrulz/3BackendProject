import Task from '../models/task.model.js';

export const createTask = async (req, res) => {
  const {_id} = req.user;
  const { title, description, status, dueDate } = req.body;

  if (!title || !description || !dueDate) {
    return res.status(400).json({ message: 'Title, description, and due date are required' });
  };

  try {
    const newTask = new Task({
      user: _id,
      title, 
      description,
      status,
      dueDate,
    });

    // Populate user field with username and email
    const task = await newTask
    .populate({ 
      path: 'user', 
      select: 'username email'
    })
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }         
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task
    .find()
    .populate("user", "username email");
    return res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
