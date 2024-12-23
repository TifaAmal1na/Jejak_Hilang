const express = require('express');
const router = express.Router();
const hilangController = require('../controllers/hilangController');
const { upload } = require('../libs/multer');

router.get('/', hilangController.getAllHilang);
router.post('/', upload.single('foto'), hilangController.addHilang);

router.get('/:id', hilangController.getHilangById);
router.put('/:id', upload.single('foto'), hilangController.updateHilang);
router.delete('/:id', hilangController.deleteHilang);

module.exports = router;
