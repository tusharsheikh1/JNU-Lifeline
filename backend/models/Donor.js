const mongoose = require('mongoose');
const { BANGLADESH_LOCATIONS } = require('../utils/constants');

// Donor Schema Definition
const donorSchema = new mongoose.Schema({
  // Personal Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [
      /^(\+88)?01[3-9]\d{8}$/,
      'Please provide a valid Bangladeshi phone number'
    ]
  },
  
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'Donor must be at least 18 years old'],
    max: [65, 'Donor must be under 65 years old']
  },
  
  // Blood Information
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required'],
    enum: {
      values: BANGLADESH_LOCATIONS.bloodGroups,
      message: 'Blood group must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-'
    }
  },
  
  lastDonationDate: {
    type: Date,
    default: null,
    validate: {
      validator: function(date) {
        // If date is provided, it should not be in the future
        return !date || date <= new Date();
      },
      message: 'Last donation date cannot be in the future'
    }
  },
  
  // Location Information (Division → District → Thana)
  location: {
    division: {
      type: String,
      required: [true, 'Division is required'],
      enum: {
        values: BANGLADESH_LOCATIONS.getAllDivisions(),
        message: 'Please select a valid division'
      }
    },
    
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
      validate: {
        validator: function(district) {
          const districts = BANGLADESH_LOCATIONS.getDistrictsByDivision(this.location.division);
          return districts.includes(district);
        },
        message: 'Please select a valid district for the chosen division'
      }
    },
    
    thana: {
      type: String,
      required: [true, 'Thana is required'],
      trim: true,
      validate: {
        validator: function(thana) {
          const thanas = BANGLADESH_LOCATIONS.getThanasByDistrict(this.location.district);
          return thanas.includes(thana);
        },
        message: 'Please select a valid thana for the chosen district'
      }
    }
  },
  
  // Availability Status
  isAvailable: {
    type: Boolean,
    default: true
  },
  
  // Additional Information (Optional)
  notes: {
    type: String,
    default: '',
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
  
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'donors'
});

// Virtual for calculating if donor is eligible to donate
donorSchema.virtual('canDonate').get(function() {
  if (!this.lastDonationDate) return true;
  
  // Donors can donate every 3 months (90 days)
  const daysSinceLastDonation = Math.floor(
    (new Date() - this.lastDonationDate) / (1000 * 60 * 60 * 24)
  );
  
  return daysSinceLastDonation >= 90;
});

// Virtual for full location string
donorSchema.virtual('fullLocation').get(function() {
  return `${this.location.thana}, ${this.location.district}, ${this.location.division}`;
});

// Virtual for location hierarchy
donorSchema.virtual('locationHierarchy').get(function() {
  return BANGLADESH_LOCATIONS.getLocationHierarchy(
    this.location.division,
    this.location.district,
    this.location.thana
  );
});

// Compound index for efficient searching by blood group and location
donorSchema.index({ 
  bloodGroup: 1, 
  'location.division': 1, 
  'location.district': 1,
  'location.thana': 1,
  isAvailable: 1 
});

// Index for email uniqueness
donorSchema.index({ email: 1 }, { unique: true });

// Index for phone uniqueness (optional, but recommended)
donorSchema.index({ phone: 1 });

// Text index for search functionality
donorSchema.index({
  name: 'text',
  'location.division': 'text',
  'location.district': 'text', 
  'location.thana': 'text'
});

// Pre-save middleware to format phone number
donorSchema.pre('save', function(next) {
  // Ensure phone number starts with +88
  if (this.phone && !this.phone.startsWith('+88')) {
    if (this.phone.startsWith('88')) {
      this.phone = '+' + this.phone;
    } else if (this.phone.startsWith('01')) {
      this.phone = '+88' + this.phone;
    }
  }
  next();
});

// Pre-save middleware to validate location hierarchy
donorSchema.pre('save', function(next) {
  const validation = BANGLADESH_LOCATIONS.validateLocation(
    this.location.division, 
    this.location.district, 
    this.location.thana
  );
  
  if (!validation.valid) {
    return next(new Error(validation.message));
  }
  next();
});

// Instance method to update availability
donorSchema.methods.updateAvailability = function() {
  this.isAvailable = this.canDonate;
  return this.save();
};

// Static method to find donors by blood group and location (with flexible location matching)
donorSchema.statics.findAvailableDonors = function(bloodGroup, division = null, district = null, thana = null) {
  const query = {
    bloodGroup: bloodGroup,
    isAvailable: true
  };
  
  if (division) {
    query['location.division'] = division;
  }
  
  if (district) {
    query['location.district'] = new RegExp(district, 'i'); // Case insensitive
  }
  
  if (thana) {
    query['location.thana'] = new RegExp(thana, 'i'); // Case insensitive
  }
  
  return this.find(query)
    .select('name phone location bloodGroup lastDonationDate')
    .sort({ 'lastDonationDate': 1 }); // Oldest donation first
};

// Static method to search donors with text search
donorSchema.statics.searchDonors = function(searchTerm, bloodGroup = null) {
  const query = {
    $text: { $search: searchTerm },
    isAvailable: true
  };
  
  if (bloodGroup) {
    query.bloodGroup = bloodGroup;
  }
  
  return this.find(query, { score: { $meta: 'textScore' } })
    .select('name phone location bloodGroup lastDonationDate')
    .sort({ score: { $meta: 'textScore' } });
};

// Static method to get blood group statistics by location
donorSchema.statics.getBloodGroupStats = function(division = null, district = null) {
  const matchStage = {};
  
  if (division) matchStage['location.division'] = division;
  if (district) matchStage['location.district'] = district;
  
  const pipeline = [
    ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    {
      $group: {
        _id: '$bloodGroup',
        total: { $sum: 1 },
        available: {
          $sum: { $cond: ['$isAvailable', 1, 0] }
        }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ];
  
  return this.aggregate(pipeline);
};

// Static method to get location-wise donor statistics
donorSchema.statics.getLocationStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: {
          division: '$location.division',
          district: '$location.district'
        },
        total: { $sum: 1 },
        available: {
          $sum: { $cond: ['$isAvailable', 1, 0] }
        },
        bloodGroups: { $addToSet: '$bloodGroup' }
      }
    },
    {
      $sort: { '_id.division': 1, '_id.district': 1 }
    }
  ]);
};

// Export the model
module.exports = mongoose.model('Donor', donorSchema);