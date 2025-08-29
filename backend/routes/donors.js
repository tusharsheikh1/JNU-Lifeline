const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');
const { donorValidationRules, checkValidation } = require('../middleware/validation');

// POST /api/donors/register - Register new donor
router.post('/register', 
  donorValidationRules(), 
  checkValidation, 
  donorController.registerDonor
);

// GET /api/donors/stats - Get donor statistics
router.get('/stats', donorController.getDonorStats);

// GET /api/donors/search - Search donors
router.get('/search', donorController.searchDonors);

// GET /api/donors/:id - Get donor by ID
router.get('/:id', donorController.getDonorById);

// PUT /api/donors/:id/availability - Update donor availability
router.put('/:id/availability', donorController.updateDonorAvailability);

module.exports = router;