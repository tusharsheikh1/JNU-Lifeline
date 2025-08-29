const { body, validationResult } = require('express-validator');
const { BANGLADESH_LOCATIONS } = require('../utils/constants');

// Validation rules for donor registration
const donorValidationRules = () => {
  return [
    // Name validation
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters')
      .matches(/^[a-zA-Z\s.-]+$/)
      .withMessage('Name can only contain letters, spaces, dots, and hyphens'),

    // Email validation
    body('email')
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .isLength({ max: 255 })
      .withMessage('Email cannot exceed 255 characters'),

    // Phone validation
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required')
      .matches(/^(\+88)?01[3-9]\d{8}$/)
      .withMessage('Please provide a valid Bangladeshi phone number (01XXXXXXXXX)'),

    // Age validation
    body('age')
      .isInt({ min: 18, max: 65 })
      .withMessage('Age must be between 18 and 65 years'),

    // Blood group validation
    body('bloodGroup')
      .notEmpty()
      .withMessage('Blood group is required')
      .isIn(BANGLADESH_LOCATIONS.bloodGroups)
      .withMessage(`Blood group must be one of: ${BANGLADESH_LOCATIONS.bloodGroups.join(', ')}`),

    // Division validation
    body('location.division')
      .notEmpty()
      .withMessage('Division is required')
      .isIn(BANGLADESH_LOCATIONS.getAllDivisions())
      .withMessage(`Division must be one of: ${BANGLADESH_LOCATIONS.getAllDivisions().join(', ')}`),

    // District validation
    body('location.district')
      .notEmpty()
      .withMessage('District is required')
      .custom((district, { req }) => {
        const division = req.body.location?.division;
        if (!division) {
          throw new Error('Division must be provided first');
        }
        
        const validDistricts = BANGLADESH_LOCATIONS.getDistrictsByDivision(division);
        if (!validDistricts.includes(district)) {
          throw new Error(`District '${district}' is not valid for division '${division}'`);
        }
        return true;
      }),

    // Thana validation
    body('location.thana')
      .notEmpty()
      .withMessage('Thana is required')
      .custom((thana, { req }) => {
        const district = req.body.location?.district;
        if (!district) {
          throw new Error('District must be provided first');
        }
        
        const validThanas = BANGLADESH_LOCATIONS.getThanasByDistrict(district);
        if (!validThanas.includes(thana)) {
          throw new Error(`Thana '${thana}' is not valid for district '${district}'`);
        }
        return true;
      }),

    // Last donation date validation (optional)
    body('lastDonationDate')
      .optional()
      .isISO8601()
      .withMessage('Last donation date must be a valid date')
      .custom((date) => {
        if (new Date(date) > new Date()) {
          throw new Error('Last donation date cannot be in the future');
        }
        return true;
      }),

    // Notes validation (optional)
    body('notes')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Notes cannot exceed 500 characters')
  ];
};

// Middleware to check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  
  next();
};

// Search validation rules
const searchValidationRules = () => {
  return [
    body('bloodGroup')
      .notEmpty()
      .withMessage('Blood group is required for search')
      .isIn(BANGLADESH_LOCATIONS.bloodGroups)
      .withMessage(`Blood group must be one of: ${BANGLADESH_LOCATIONS.bloodGroups.join(', ')}`),
      
    body('division')
      .optional()
      .isIn(BANGLADESH_LOCATIONS.getAllDivisions())
      .withMessage(`Division must be one of: ${BANGLADESH_LOCATIONS.getAllDivisions().join(', ')}`),
      
    body('district')
      .optional()
      .custom((district, { req }) => {
        const division = req.body.division;
        if (district && division) {
          const validDistricts = BANGLADESH_LOCATIONS.getDistrictsByDivision(division);
          if (!validDistricts.includes(district)) {
            throw new Error(`District '${district}' is not valid for division '${division}'`);
          }
        }
        return true;
      }),
      
    body('thana')
      .optional()
      .custom((thana, { req }) => {
        const district = req.body.district;
        if (thana && district) {
          const validThanas = BANGLADESH_LOCATIONS.getThanasByDistrict(district);
          if (!validThanas.includes(thana)) {
            throw new Error(`Thana '${thana}' is not valid for district '${district}'`);
          }
        }
        return true;
      })
  ];
};

module.exports = {
  donorValidationRules,
  searchValidationRules,
  checkValidation
};