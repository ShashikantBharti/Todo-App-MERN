import { Todo } from '../models/todoModel.js';

/**
 * @desc returns all todos from db
 * @param req
 * @param res
 */
export const getAllTodo = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json({
      success: true,
      message: 'Data Fetched Successfully',
      data: todos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

/**
 * @desc returns single todo from db
 * @param req
 * @param res
 */
export const getTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: `To do not found!` });
    }
    res.status(200).json({
      success: true,
      message: 'Data fetched successfully!',
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

/**
 * @desc  Create new todo
 * @param req
 * @param res
 */
export const addTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const todo = new Todo({
      title,
      description,
    });
    const createdTodo = await todo.save();
    res.status(201).json({
      success: true,
      message: 'New todo created successfully!',
      data: createdTodo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

/**
 * @desc  Update todo
 * @param req
 * @param res
 */
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      {
        new: true,
        runValidators: false,
      }
    );
    if (!updatedTodo) {
      return res.status(400).json({
        success: false,
        message: 'Todo not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Todo Updated successfully!',
      data: updatedTodo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

/**
 * @desc  Delete todo
 * @param req
 * @param res
 */
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully!',
      data: deletedTodo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};
