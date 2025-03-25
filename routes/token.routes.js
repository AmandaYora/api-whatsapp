const express = require('express');
const router = express.Router();
const TokenController = require('../controllers/token.controller');
const bearerAuth = require('../middlewares/bearer.auth');

router.use(bearerAuth);

router.post('/', TokenController.create);
router.get('/', TokenController.getAll);
router.get('/user/:user_id', TokenController.getByUser);
router.get('/:id', TokenController.getById);
router.put('/:id', TokenController.update);
router.delete('/:id', TokenController.delete);

module.exports = router;
