const { BANGLADESH_LOCATIONS } = require('../utils/constants');

// Get all divisions
exports.getAllDivisions = (req, res) => {
  try {
    const divisions = BANGLADESH_LOCATIONS.getAllDivisions();
    
    res.json({
      status: 'success',
      data: {
        divisions,
        count: divisions.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch divisions'
    });
  }
};

// Get districts by division
exports.getDistrictsByDivision = (req, res) => {
  try {
    const { division } = req.params;
    
    // Validate division exists
    if (!BANGLADESH_LOCATIONS.getAllDivisions().includes(division)) {
      return res.status(404).json({
        status: 'error',
        message: 'Division not found'
      });
    }
    
    const districts = BANGLADESH_LOCATIONS.getDistrictsByDivision(division);
    
    res.json({
      status: 'success',
      data: {
        division,
        districts,
        count: districts.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch districts'
    });
  }
};

// Get thanas by district
exports.getThanasByDistrict = (req, res) => {
  try {
    const { district } = req.params;
    
    // Validate district exists
    if (!BANGLADESH_LOCATIONS.getAllDistricts().includes(district)) {
      return res.status(404).json({
        status: 'error',
        message: 'District not found'
      });
    }
    
    const thanas = BANGLADESH_LOCATIONS.getThanasByDistrict(district);
    
    res.json({
      status: 'success',
      data: {
        district,
        thanas,
        count: thanas.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch thanas'
    });
  }
};

// Get complete location hierarchy
exports.getLocationHierarchy = (req, res) => {
  try {
    const divisions = BANGLADESH_LOCATIONS.getAllDivisions();
    const hierarchy = {};
    
    divisions.forEach(division => {
      hierarchy[division] = {};
      const districts = BANGLADESH_LOCATIONS.getDistrictsByDivision(division);
      
      districts.forEach(district => {
        hierarchy[division][district] = BANGLADESH_LOCATIONS.getThanasByDistrict(district);
      });
    });
    
    res.json({
      status: 'success',
      data: {
        hierarchy,
        summary: {
          totalDivisions: divisions.length,
          totalDistricts: BANGLADESH_LOCATIONS.getAllDistricts().length,
          totalThanas: BANGLADESH_LOCATIONS.getAllThanas().length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch location hierarchy'
    });
  }
};

// Search locations
exports.searchLocations = (req, res) => {
  try {
    const { q: searchTerm, type = 'all' } = req.query;
    
    if (!searchTerm) {
      return res.status(400).json({
        status: 'error',
        message: 'Search term is required'
      });
    }
    
    if (!['all', 'divisions', 'districts', 'thanas'].includes(type)) {
      return res.status(400).json({
        status: 'error',
        message: 'Type must be one of: all, divisions, districts, thanas'
      });
    }
    
    const results = BANGLADESH_LOCATIONS.searchLocation(searchTerm, type);
    
    res.json({
      status: 'success',
      data: {
        searchTerm,
        type,
        results,
        totalResults: Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Search failed'
    });
  }
};

// Validate location combination
exports.validateLocation = (req, res) => {
  try {
    const { division, district, thana } = req.query;
    
    if (!division || !district) {
      return res.status(400).json({
        status: 'error',
        message: 'Division and district are required'
      });
    }
    
    const validation = BANGLADESH_LOCATIONS.validateLocation(division, district, thana);
    
    res.json({
      status: 'success',
      data: {
        input: { division, district, thana },
        validation: {
          isValid: validation.valid,
          message: validation.message
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Validation failed'
    });
  }
};

// Get blood groups
exports.getBloodGroups = (req, res) => {
  try {
    const bloodGroups = BANGLADESH_LOCATIONS.bloodGroups;
    
    res.json({
      status: 'success',
      data: {
        bloodGroups,
        count: bloodGroups.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch blood groups'
    });
  }
};