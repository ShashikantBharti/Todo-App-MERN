import express from 'express';
import {
  deleteTodo,
  addTodo,
  getAllTodo,
  getTodo,
  updateTodo,
} from '../controllers/todoController.js';

const router = express.Router();

/**
 * @route  GET /api/todos
 * @desc   Get all todos
 * @access Public
 */
router.route('/').get(getAllTodo);

/**
 * @route  GET /api/todos/:id
 * @desc   Get single todo
 * @access Public
 */
router.route('/:id').get(getTodo);

/**
 * @route  POST /api/todos/
 * @desc   Create new todo
 * @access Public
 */
router.route('/').post(addTodo);

/**
 * @route  PATCH /api/todos/:id
 * @desc   Update todo
 * @access Public
 */
router.route('/:id').patch(updateTodo);

/**
 * @route  DELETE /api/todos/:id
 * @desc   Create new todo
 * @access Public
 */
router.route('/:id').delete(deleteTodo);
export default router;
