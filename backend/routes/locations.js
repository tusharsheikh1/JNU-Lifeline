const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// GET /api/locations/divisions - Get all divisions
router.get('/divisions', locationController.getAllDivisions);

// GET /api/locations/districts/:division - Get districts by division
router.get('/districts/:division', locationController.getDistrictsByDivision);

// GET /api/locations/thanas/:district - Get thanas by district
router.get('/thanas/:district', locationController.getThanasByDistrict);

// GET /api/locations/hierarchy - Get complete location hierarchy
router.get('/hierarchy', locationController.getLocationHierarchy);

// GET /api/locations/search - Search locations
router.get('/search', locationController.searchLocations);

// GET /api/locations/validate - Validate location combination
router.get('/validate', locationController.validateLocation);

// GET /api/locations/blood-groups - Get blood groups
router.get('/blood-groups', locationController.getBloodGroups);

module.exports = router;