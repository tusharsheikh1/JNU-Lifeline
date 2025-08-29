const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');

// GET /api/donors/stats - Get donor statistics
router.get('/stats', donorController.getDonorStats);

// GET /api/donors/search - Search donors
router.get('/search', donorController.searchDonors);

// POST /api/donors/register - Register donor (placeholder)
router.post('/register', donorController.registerDonor);

module.exports = router;