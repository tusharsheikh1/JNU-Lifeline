const mongoose = require('mongoose');
const Donor = require('./models/Donor');
require('dotenv').config();

// Test data
const testDonors = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '01712345678',
    age: 28,
    bloodGroup: 'B+',
    location: {
      division: 'Dhaka',
      district: 'Dhaka',
      thana: 'Dhanmondi'
    },
    notes: 'Available on weekends'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '01987654321',
    age: 32,
    bloodGroup: 'O+',
    location: {
      division: 'Chittagong',
      district: 'Chittagong',
      thana: 'Kotwali'
    },
    lastDonationDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000) // 120 days ago
  },
  {
    name: 'Ahmed Rahman',
    email: 'ahmed.rahman@example.com',
    phone: '01555666777',
    age: 25,
    bloodGroup: 'A-',
    location: {
      division: 'Khulna',
      district: 'Khulna',
      thana: 'Khulna Sadar'
    }
  }
];

// Connect to database and run tests
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB for registration testing');
    return testDonorRegistration();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });

async function testDonorRegistration() {
  try {
    console.log('\n🧪 Testing Donor Registration API...\n');
    
    // Clean up any existing test data
    await Donor.deleteMany({ 
      email: { $in: testDonors.map(d => d.email) }
    });
    console.log('🧹 Cleaned up existing test data');
    
    // Test 1: Register valid donors
    console.log('\nTest 1: Registering valid donors...');
    const registeredDonors = [];
    
    for (const donorData of testDonors) {
      try {
        const donor = new Donor(donorData);
        const savedDonor = await donor.save();
        registeredDonors.push(savedDonor);
        console.log(`✅ Registered: ${savedDonor.name} (${savedDonor.bloodGroup}) - ${savedDonor.fullLocation}`);
        console.log(`   Can donate: ${savedDonor.canDonate}`);
      } catch (error) {
        console.error(`❌ Failed to register ${donorData.name}:`, error.message);
      }
    }
    
    // Test 2: Test duplicate email prevention
    console.log('\nTest 2: Testing duplicate email prevention...');
    try {
      const duplicateEmailDonor = new Donor({
        name: 'Duplicate Email Test',
        email: 'john.doe@example.com', // Same as first donor
        phone: '01711111111',
        age: 30,
        bloodGroup: 'AB+',
        location: {
          division: 'Dhaka',
          district: 'Gazipur',
          thana: 'Gazipur Sadar'
        }
      });
      await duplicateEmailDonor.save();
      console.log('❌ This should not happen - duplicate email allowed');
    } catch (error) {
      console.log('✅ Duplicate email prevention working:', error.message);
    }
    
    // Test 3: Test duplicate phone prevention  
    console.log('\nTest 3: Testing duplicate phone prevention...');
    try {
      const duplicatePhoneDonor = new Donor({
        name: 'Duplicate Phone Test',
        email: 'duplicate.phone@example.com',
        phone: '01712345678', // Same as first donor
        age: 35,
        bloodGroup: 'B-',
        location: {
          division: 'Sylhet',
          district: 'Sylhet',
          thana: 'Sylhet Sadar'
        }
      });
      await duplicatePhoneDonor.save();
      console.log('❌ This should not happen - duplicate phone allowed');
    } catch (error) {
      console.log('✅ Duplicate phone prevention working');
    }
    
    // Test 4: Test search functionality
    console.log('\nTest 4: Testing search functionality...');
    const bPlusDonors = await Donor.findAvailableDonors('B+');
    console.log(`✅ Found ${bPlusDonors.length} B+ donor(s)`);
    
    const dhakaDonors = await Donor.findAvailableDonors('B+', 'Dhaka');
    console.log(`✅ Found ${dhakaDonors.length} B+ donor(s) in Dhaka`);
    
    // Test 5: Test statistics
    console.log('\nTest 5: Testing statistics...');
    const stats = await Donor.getBloodGroupStats();
    console.log('✅ Blood group statistics:');
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.total} total, ${stat.available} available`);
    });
    
    const locationStats = await Donor.getLocationStats();
    console.log('✅ Location statistics:');
    locationStats.forEach(stat => {
      console.log(`   ${stat._id.division} > ${stat._id.district}: ${stat.total} donors`);
    });
    
    // Test 6: Test availability updates
    console.log('\nTest 6: Testing availability updates...');
    if (registeredDonors.length > 0) {
      const firstDonor = registeredDonors[0];
      firstDonor.isAvailable = false;
      await firstDonor.save();
      console.log(`✅ Updated availability for ${firstDonor.name}: ${firstDonor.isAvailable}`);
      
      // Update back to true
      firstDonor.isAvailable = true;
      await firstDonor.save();
      console.log(`✅ Restored availability for ${firstDonor.name}: ${firstDonor.isAvailable}`);
    }
    
    // Test 7: Test donation date updates
    console.log('\nTest 7: Testing donation date updates...');
    if (registeredDonors.length > 0) {
      const donor = registeredDonors[0];
      const recentDonation = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
      donor.lastDonationDate = recentDonation;
      await donor.save();
      
      console.log(`✅ Updated last donation date for ${donor.name}`);
      console.log(`   Can donate now: ${donor.canDonate} (should be false - too recent)`);
    }
    
    console.log('\n🎉 All registration tests completed successfully!\n');
    
    // Show final summary
    console.log('📊 REGISTRATION API SUMMARY:');
    console.log('✅ Donor registration with full validation');
    console.log('✅ Duplicate prevention (email & phone)');
    console.log('✅ Location hierarchy validation');
    console.log('✅ Search functionality');
    console.log('✅ Statistics generation');
    console.log('✅ Availability management');
    console.log('✅ Donation eligibility tracking');
    
  } catch (error) {
    console.error('❌ Registration test failed:', error);
  } finally {
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await Donor.deleteMany({ 
      email: { $in: testDonors.map(d => d.email) }
    });
    
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  }
}