const Donor = require('../models/Donor');
const { validationResult } = require('express-validator');

// Get donor statistics
exports.getDonorStats = async (req, res) => {
  try {
    const { division, district } = req.query;
    
    const stats = await Donor.getBloodGroupStats(division, district);
    
    res.json({
      status: 'success',
      data: {
        filters: { division, district },
        bloodGroupStats: stats,
        totalDonors: stats.reduce((sum, stat) => sum + stat.total, 0),
        totalAvailable: stats.reduce((sum, stat) => sum + stat.available, 0)
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch donor statistics'
    });
  }
};

// Search donors (basic implementation)
exports.searchDonors = async (req, res) => {
  try {
    const { bloodGroup, division, district, thana } = req.query;
    
    if (!bloodGroup) {
      return res.status(400).json({
        status: 'error',
        message: 'Blood group is required'
      });
    }
    
    const donors = await Donor.findAvailableDonors(bloodGroup, division, district, thana);
    
    res.json({
      status: 'success',
      data: {
        filters: { bloodGroup, division, district, thana },
        donors,
        count: donors.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Search failed'
    });
  }
};

// Placeholder for donor registration (will be implemented in next phase)
exports.registerDonor = async (req, res) => {
  res.json({
    status: 'info',
    message: 'Donor registration endpoint will be implemented in Phase 1.5'
  });
};