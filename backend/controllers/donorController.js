const Donor = require('../models/Donor');
const { validationResult } = require('express-validator');

// Register a new donor
exports.registerDonor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      age,
      bloodGroup,
      location,
      lastDonationDate,
      notes
    } = req.body;

    // Check if donor with email already exists
    const existingDonorByEmail = await Donor.findOne({ email });
    if (existingDonorByEmail) {
      return res.status(409).json({
        status: 'error',
        message: 'A donor with this email address already exists',
        field: 'email'
      });
    }

    // Check if donor with phone already exists
    const existingDonorByPhone = await Donor.findOne({ phone: new RegExp(`^\\+88${phone.replace(/^\+88/, '')}$`) });
    if (existingDonorByPhone) {
      return res.status(409).json({
        status: 'error',
        message: 'A donor with this phone number already exists',
        field: 'phone'
      });
    }

    // Create new donor
    const newDonor = new Donor({
      name,
      email,
      phone,
      age,
      bloodGroup,
      location,
      lastDonationDate: lastDonationDate || null,
      notes: notes || ''
    });

    // Save donor
    const savedDonor = await newDonor.save();

    // Return success response (excluding sensitive info)
    res.status(201).json({
      status: 'success',
      message: 'Donor registered successfully!',
      data: {
        id: savedDonor._id,
        name: savedDonor.name,
        bloodGroup: savedDonor.bloodGroup,
        location: savedDonor.fullLocation,
        canDonate: savedDonor.canDonate,
        registeredAt: savedDonor.createdAt
      }
    });

  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));

      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        status: 'error',
        message: `A donor with this ${field} already exists`,
        field
      });
    }

    console.error('Donor registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to register donor. Please try again.'
    });
  }
};

// Get donor statistics
exports.getDonorStats = async (req, res) => {
  try {
    const { division, district } = req.query;
    
    const stats = await Donor.getBloodGroupStats(division, district);
    const locationStats = await Donor.getLocationStats();
    
    // Calculate totals
    const totalDonors = stats.reduce((sum, stat) => sum + stat.total, 0);
    const totalAvailable = stats.reduce((sum, stat) => sum + stat.available, 0);
    
    res.json({
      status: 'success',
      data: {
        filters: { division, district },
        summary: {
          totalDonors,
          totalAvailable,
          availabilityRate: totalDonors > 0 ? ((totalAvailable / totalDonors) * 100).toFixed(1) : 0
        },
        bloodGroupStats: stats,
        locationStats: locationStats.slice(0, 10) // Top 10 locations
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch donor statistics'
    });
  }
};

// Search donors
exports.searchDonors = async (req, res) => {
  try {
    const { bloodGroup, division, district, thana, limit = 20 } = req.query;
    
    if (!bloodGroup) {
      return res.status(400).json({
        status: 'error',
        message: 'Blood group is required for search'
      });
    }
    
    const donors = await Donor.findAvailableDonors(bloodGroup, division, district, thana)
      .limit(parseInt(limit));
    
    // Format response to protect privacy
    const formattedDonors = donors.map(donor => ({
      id: donor._id,
      name: donor.name,
      phone: donor.phone,
      bloodGroup: donor.bloodGroup,
      location: donor.fullLocation,
      lastDonation: donor.lastDonationDate ? 
        Math.floor((new Date() - donor.lastDonationDate) / (1000 * 60 * 60 * 24)) + ' days ago' : 
        'Never donated',
      canDonate: donor.canDonate
    }));
    
    res.json({
      status: 'success',
      data: {
        filters: { bloodGroup, division, district, thana },
        donors: formattedDonors,
        count: formattedDonors.length,
        message: formattedDonors.length > 0 ? 
          `Found ${formattedDonors.length} available ${bloodGroup} donor(s)` :
          `No available ${bloodGroup} donors found in the specified location`
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Search failed. Please try again.'
    });
  }
};

// Get donor by ID (for verification)
exports.getDonorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const donor = await Donor.findById(id).select('-email -notes');
    
    if (!donor) {
      return res.status(404).json({
        status: 'error',
        message: 'Donor not found'
      });
    }
    
    res.json({
      status: 'success',
      data: {
        id: donor._id,
        name: donor.name,
        phone: donor.phone,
        age: donor.age,
        bloodGroup: donor.bloodGroup,
        location: donor.fullLocation,
        canDonate: donor.canDonate,
        lastDonation: donor.lastDonationDate,
        registeredAt: donor.createdAt,
        isAvailable: donor.isAvailable
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid donor ID format'
      });
    }
    
    console.error('Get donor error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch donor information'
    });
  }
};

// Update donor availability
exports.updateDonorAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable, lastDonationDate } = req.body;
    
    const donor = await Donor.findById(id);
    
    if (!donor) {
      return res.status(404).json({
        status: 'error',
        message: 'Donor not found'
      });
    }
    
    if (typeof isAvailable === 'boolean') {
      donor.isAvailable = isAvailable;
    }
    
    if (lastDonationDate) {
      donor.lastDonationDate = new Date(lastDonationDate);
      // Automatically update availability based on donation date
      donor.isAvailable = donor.canDonate;
    }
    
    const updatedDonor = await donor.save();
    
    res.json({
      status: 'success',
      message: 'Donor availability updated successfully',
      data: {
        id: updatedDonor._id,
        isAvailable: updatedDonor.isAvailable,
        canDonate: updatedDonor.canDonate,
        lastDonation: updatedDonor.lastDonationDate
      }
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update donor availability'
    });
  }
};