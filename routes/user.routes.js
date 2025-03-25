const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const bearerAuth = require('../middlewares/bearer.auth');

router.use(bearerAuth);

router.post('/', UserController.create);
router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

module.exports = router;
