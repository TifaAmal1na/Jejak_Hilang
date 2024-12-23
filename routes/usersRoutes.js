const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');

router.get('/', usersController.getUsers);
router.post('/login', usersController.loginUser);

module.exports = router;
